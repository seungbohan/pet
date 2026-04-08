import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './components/common/BottomNav';
import TopNav from './components/common/TopNav';
import ToastContainer from './components/common/Toast';
import useAuthStore from './store/authStore';
import { getMyProfile } from './api/users';

function App() {
  const location = useLocation();
  const isMapPage = location.pathname === '/' || location.pathname === '/map';
  const { token, user, setUser, logout } = useAuthStore();

  // Restore user from token on app start
  useEffect(() => {
    if (token && !user) {
      getMyProfile()
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* TopNav only shown on non-map pages (desktop has its own map overlay nav) */}
      {!isMapPage && <TopNav />}

      <main className={isMapPage ? 'flex-1 relative overflow-hidden' : 'flex-1 bg-pet-cream overflow-auto pb-16 md:pb-0'}>
        <Outlet />
      </main>

      {/* Mobile bottom tab bar - always visible */}
      <BottomNav />

      {/* Global toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
