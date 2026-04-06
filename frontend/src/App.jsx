import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './components/common/BottomNav';
import TopNav from './components/common/TopNav';

function App() {
  const location = useLocation();
  const isMapPage = location.pathname === '/' || location.pathname === '/map';

  return (
    <div className="h-screen flex flex-col">
      {/* TopNav only shown on non-map pages (desktop has its own map overlay nav) */}
      {!isMapPage && <TopNav />}

      <main className={isMapPage ? 'flex-1 relative overflow-hidden' : 'flex-1 bg-pet-cream overflow-auto pb-16 md:pb-0'}>
        <Outlet />
      </main>

      {/* Mobile bottom tab bar - always visible */}
      <BottomNav />
    </div>
  );
}

export default App;
