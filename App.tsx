
import React, { useState, useCallback, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider, useToast } from './components/Toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import FooterBottom from './components/FooterBottom';
import DownloadPage from './pages/DownloadPage';
import SystemRequirementsPage from './pages/SystemRequirementsPage';
import GamesPage from './pages/GamesPage';
import AllGamesPage from './pages/AllGamesPage';
import HowToStartPage from './pages/HowToStartPage';
import GuidesPage from './pages/GuidesPage';
import GameDetailsPage from './pages/GameDetailsPage';
import AboutServicePage from './pages/AboutServicePage';
import SupportPage from './pages/SupportPage';
import NvidiaTechPage from './pages/NvidiaTechPage';
import HomePage from './pages/HomePage';
import { Game, Language, User, NavigateOptions } from './types';
import { translations } from './translations';
import { useLocalStorage } from './hooks/useLocalStorage';
import { api } from './services/api';
import { loggingService } from './services/loggingService'; // Import loggingService
import { useAppStore } from './store/store';

type TranslationKey = keyof typeof translations.ENG;

const getInitialLanguage = (): Language => {
  try {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang && ['ENG', 'RUS', 'UZB'].includes(savedLang)) {
      return savedLang as Language;
    }
  } catch (error) {
    loggingService.logError(error, { context: 'getInitialLanguage', message: 'Could not access localStorage. Proceeding with browser language detection.' });
    // console.warn("Could not access localStorage. Proceeding with browser language detection.", error); // Remove console.warn
  }

  const browserLang = navigator.language?.toLowerCase().split('-')[0];
  if (browserLang === 'uz') return 'UZB';
  if (browserLang === 'ru') return 'RUS';

  return 'ENG';
};

// Browser history state interface
interface HistoryState {
  page: string;
  game?: Game;
  filter?: string;
  search?: string;
  platform?: string;
}

// Get initial page from URL hash or default to home
const getInitialPage = (): string => {
  const hash = window.location.hash.slice(1); // Remove #
  return hash || 'home';
};

const AppContent: React.FC = () => {
  const {
    isSidebarOpen,
    isAuthModalOpen,
    isLoggedIn,
    currentUser,
    language,
    actions,
  } = useAppStore();
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeGameFilter, setActiveGameFilter] = useState('All Games');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState('windows');
  const { addToast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await api.login(email, password);
      actions.login(user);
      addToast(t('loginSuccess'), 'success');
      actions.closeAuthModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? t(error.message) : 'An error occurred';
      addToast(errorMessage, 'error');
      throw error;
    }
  };

  const handleRegister = async (email: string, password: string, username: string) => {
    try {
      const user = await api.register(username, email, password);
      actions.login(user);
      addToast(t('registerSuccess'), 'success');
      actions.closeAuthModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? t(error.message) : 'An error occurred';
      addToast(errorMessage, 'error');
      throw error;
    }
  };

  const handleLogout = () => {
    api.logout();
    actions.logout();
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as HistoryState | null;
      if (state) {
        setCurrentPage(state.page);
        if (state.game) setSelectedGame(state.game);
        if (state.filter) setActiveGameFilter(state.filter);
        if (state.search) setSearchQuery(state.search);
        if (state.platform) setActivePlatform(state.platform);
      } else {
        // Fallback to hash-based routing
        const hash = window.location.hash.slice(1);
        setCurrentPage(hash || 'home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL hash when page changes
  useEffect(() => {
    const hash = currentPage === 'home' ? '' : currentPage;
    if (window.location.hash.slice(1) !== hash) {
      window.location.hash = hash;
    }
  }, [currentPage]);

  const t = useCallback((key: string, fallback?: string): string => {
    const translationKey = key as TranslationKey;
    return (translations[language] as typeof translations.ENG)[translationKey] || translations.ENG[translationKey] || fallback || key;
  }, [language]);

  const navigate = useCallback((page: string, options: NavigateOptions = {}) => {
    const { game, filter, search, platform } = options;
    
    // Update state
    if (page === 'game-details' && game) {
      setSelectedGame(game);
    }
    if (page === 'all-games') {
      setActiveGameFilter(filter || 'All Games');
      setSearchQuery(search || '');
    }
    if (page === 'system-requirements' && platform) {
      setActivePlatform(platform);
    }
    
    // Create history state
    const historyState: HistoryState = {
      page,
      ...(game && { game }),
      ...(filter && { filter }),
      ...(search && { search }),
      ...(platform && { platform })
    };
    
    // Update browser history
    const url = page === 'home' ? '/' : `/#${page}`;
    window.history.pushState(historyState, '', url);
    
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    actions.toggleSidebar();
  }, [actions]);

  const renderCurrentPage = useCallback(() => {
    switch (currentPage) {
      case 'download':
        return <DownloadPage navigate={navigate} t={t} />;
      case 'system-requirements':
        return <SystemRequirementsPage navigate={navigate} currentPage={currentPage} platform={activePlatform} t={t} />;
      case 'games':
        return <GamesPage navigate={navigate} t={t} />;
      case 'all-games':
        return <AllGamesPage navigate={navigate} initialFilter={activeGameFilter} searchQuery={searchQuery} t={t} />;
      case 'game-details':
        return selectedGame ? <GameDetailsPage game={selectedGame} navigate={navigate} t={t} /> : <GamesPage navigate={navigate} t={t} />;
      case 'how-to-start':
        return <HowToStartPage navigate={navigate} currentPage={currentPage} t={t} />;
      case 'guides':
        return <GuidesPage navigate={navigate} t={t}/>;
       case 'nvidia-tech':
        return <NvidiaTechPage navigate={navigate} t={t} />;
      case 'about-service':
        return <AboutServicePage navigate={navigate} t={t} />;
      case 'support':
        return <SupportPage navigate={navigate} t={t} />;
      case 'home':
      default:
        return <HomePage navigate={navigate} t={t} />;
    }
  }, [currentPage, navigate, t, activePlatform, activeGameFilter, searchQuery, selectedGame]);

  return (
    <>
        <div className="bg-[#0A0A10] text-gray-200 overflow-x-hidden">
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={actions.toggleSidebar}
            isLoggedIn={isLoggedIn}
            language={language}
            setLanguage={actions.setLanguage}
            navigate={navigate}
            t={t}
            onLoginClick={actions.openAuthModal}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
          <Sidebar
            isOpen={isSidebarOpen}
            isLoggedIn={isLoggedIn}
            navigate={navigate}
            t={t}
            onLoginClick={actions.openAuthModal}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
          <main className="pt-[72px]">
            {renderCurrentPage()}
          </main>
          <Footer navigate={navigate} t={t} />
          <FooterBottom t={t} navigate={navigate} />
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
              onClick={actions.toggleSidebar}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  actions.toggleSidebar();
                }
              }}
              aria-label="Sidebar yopish"
            />
          )}
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={actions.closeAuthModal}
          onLogin={handleLogin}
          onRegister={handleRegister}
          t={t}
        />
    </>
  );
};

const App: React.FC = () => (
  <ErrorBoundary language={getInitialLanguage()}>
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  </ErrorBoundary>
);

export default App;
