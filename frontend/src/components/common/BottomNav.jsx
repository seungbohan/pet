import { Link, useLocation } from 'react-router-dom';

const tabs = [
  {
    to: '/',
    matchPaths: ['/', '/map'],
    label: '지도',
    icon: (active) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        {active ? (
          <path d="M9 6.882l-7-3.5v13.236l7 3.5 6-3 7 3.5V7.382l-7-3.5-6 3z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.882l-7-3.5v13.236l7 3.5 6-3 7 3.5V7.382l-7-3.5-6 3z" />
        )}
      </svg>
    ),
  },
  {
    to: '/feeds',
    matchPaths: ['/feeds'],
    label: '피드',
    icon: (active) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        {active ? (
          <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM7 7h10M7 11h10M7 15h6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2zM7 8h10M7 12h10M7 16h6" />
        )}
      </svg>
    ),
  },
  {
    to: '/mypage',
    matchPaths: ['/mypage'],
    label: '마이',
    icon: (active) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        {active ? (
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.5-1.632z" />
        )}
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();

  const isActive = (tab) => {
    if (tab.to === '/' || tab.to === '/map') {
      return location.pathname === '/' || location.pathname === '/map';
    }
    return location.pathname.startsWith(tab.to);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-white border-t border-pet-gray
                  flex items-center justify-around"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {tabs.map((tab) => {
        const active = isActive(tab);
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
              active ? 'text-pet-orange' : 'text-pet-brown/50'
            }`}
          >
            {tab.icon(active)}
            <span className={`text-[10px] font-semibold ${active ? 'text-pet-orange' : 'text-pet-brown/50'}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
