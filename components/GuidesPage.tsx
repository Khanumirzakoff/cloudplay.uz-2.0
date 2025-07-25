
import React from 'react';

interface GuideCardProps {
  title: string;
  text: string;
  imgSrc: string;
  onClick: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ title, text, imgSrc, onClick }) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className="guidesSelect__item group relative block overflow-hidden rounded-lg bg-[#222] p-6 text-white transition-colors hover:bg-[#333]"
  >
    <div className="guidesSelect__itemContent relative z-10">
      <h4 className="text-xl font-medium mb-2">{title}</h4>
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="guidesSelect__itemIcon absolute top-6 right-6 z-10 text-gray-500 group-hover:text-white transition-colors">
      <path d="M7 17L17 7M17 7V17M17 7H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
    <img src={imgSrc} alt="" className="guidesSelect__itemImg absolute bottom-0 right-0 z-0 h-24 w-auto object-contain transition-transform group-hover:scale-110 fade-in-on-load" />
  </a>
);

interface GuidesPageProps {
    navigate: (page: string) => void;
    t: (key: string) => string;
}

const GuidesPage: React.FC<GuidesPageProps> = ({ navigate, t }) => {

  const guides = [
    {
      title: t('guide1Title'),
      text: t('guide1Text'),
      imgSrc: 'https://gfn.am/img/guides/gamepad.png',
      page: 'how-to-start'
    },
    {
      title: t('guide2Title'),
      text: t('guide2Text'),
      imgSrc: 'https://gfn.am/img/guides/puzzle.png',
      page: 'support' // Changed to support page as it fits FAQ
    },
    {
      title: t('guide3Title'),
      text: t('guide3Text'),
      imgSrc: 'https://gfn.am/img/guides/lightning.png',
      page: 'nvidia-tech'
    },
    {
      title: t('guide4Title'),
      text: t('guide4Text'),
      imgSrc: 'https://gfn.am/img/guides/cog.png',
      page: 'system-requirements'
    }
  ];

  return (
    <main className="page page_fullheight page_dark bg-[#111]">
      <div className="container mx-auto px-4 py-16">
        <div className="pageHeadline pageHeadline__guides text-center mb-12">
          <h1 className="pageHeadline__title text-4xl font-orbitron font-bold">
            {t('guidesTitle')}
          </h1>
          <h2 className="pageHeadline__subtitle text-lg text-gray-400 mt-2">{t('guidesSubtitle')}</h2>
        </div>
        <section className="guidesSelect max-w-4xl mx-auto">
          <div className="guidesSelect__items grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <GuideCard
                key={guide.title}
                title={guide.title}
                text={guide.text}
                imgSrc={guide.imgSrc}
                onClick={() => navigate(guide.page)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default GuidesPage;
