
import React, { useState, useEffect, useRef } from 'react';
import { GlobeIcon, LoginIcon, MenuIcon, CloseIcon, ChevronDownIcon } from './icons';
import { Language, User } from '../types';
import Logo from './Logo';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: () => void;
    isLoggedIn: boolean;
    navigate: (page: string, options?: object) => void;
    language: Language;
    setLanguage: React.Dispatch<React.SetStateAction<Language>>;
    t: (key: string) => string;
    onLoginClick: () => void;
    onLogout: () => void;
    currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({
    isSidebarOpen,
    setIsSidebarOpen,
    isLoggedIn,
    navigate,
    language,
    setLanguage,
    t,
    onLoginClick,
    onLogout,
    currentUser
}) => {
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const languages: { code: Language; name: string }[] = [
        { code: 'ENG', name: 'English' },
        { code: 'RUS', name: 'Русский' },
        { code: 'UZB', name: 'O‘zbekcha' },
    ];

    const handleLanguageChange = (langCode: Language) => {
        setLanguage(langCode);
        setIsLangMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsLangMenuOpen(false);
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full glass h-[72px] px-6 lg:px-4 z-50">
            <div className="flex items-center justify-between w-full h-full">
                <div className="flex items-center">
                    <Logo onClick={() => navigate('home')} className="mr-10 text-2xl lg:text-xl" />
                    
                    <nav className="hidden lg:flex items-center space-x-6">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('games'); }} className="text-gray-300 hover:text-white transition-colors">{t('games')}</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('download'); }} className="text-gray-300 hover:text-white transition-colors">{t('download')}</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('guides'); }} className="text-gray-300 hover:text-white transition-colors">{t('guides')}</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('about-service'); }} className="text-gray-300 hover:text-white transition-colors">{t('aboutService')}</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('support'); }} className="text-gray-300 hover:text-white transition-colors">{t('support')}</a>
                    </nav>
                </div>

                <div className="flex items-center">
                    <div className="flex items-center space-x-2 md:space-x-4">
                         <div className="relative" ref={langMenuRef}>
                            <button
                                type="button"
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                                aria-expanded={isLangMenuOpen}
                                aria-haspopup="true"
                                aria-label="Tilni tanlash"
                            >
                                <GlobeIcon className="w-5 h-5" />
                                <span className="font-medium text-sm">{language}</span>
                                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isLangMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-40 glass rounded-lg shadow-lg z-10">
                                    <ul className="py-1">
                                        {languages.map((lang) => (
                                            <li key={lang.code}>
                                                <button
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === lang.code ? 'text-white bg-white/10' : 'text-gray-300 hover:bg-white/5'}`}
                                                >
                                                    {lang.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="h-8 w-px bg-white/20 hidden lg:block"></div>
                        
                        {!isLoggedIn ? (
                            <button onClick={onLoginClick} className="bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white transition-colors rounded-lg px-4 py-2 hidden lg:flex items-center space-x-2">
                                <LoginIcon className="w-5 h-5" />
                                <span>{t('login')}</span>
                            </button>
                        ) : (
                            <div className="relative hidden lg:block" ref={userMenuRef}>
                                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">
                                        {currentUser?.username.charAt(0).toUpperCase()}
                                    </div>
                                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isUserMenuOpen && (
                                     <div className="absolute top-full right-0 mt-2 w-48 glass rounded-lg shadow-lg z-10">
                                         <div className="p-4 border-b border-white/10">
                                             <p className="font-semibold text-white truncate">{currentUser?.username}</p>
                                             <p className="text-sm text-gray-400 truncate">{currentUser?.email}</p>
                                         </div>
                                         <ul className="py-1">
                                             <li>
                                                 <button
                                                     onClick={onLogout}
                                                     className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                                                 >
                                                     {t('logout')}
                                                 </button>
                                             </li>
                                         </ul>
                                     </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button type="button" onClick={setIsSidebarOpen} className="p-2 ml-2 lg:hidden text-gray-200 hover:bg-white/10 rounded-md">
                        {isSidebarOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
