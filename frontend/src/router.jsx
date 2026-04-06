import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import FeedDetailPage from './pages/FeedDetailPage';
import FeedWritePage from './pages/FeedWritePage';
import MapPage from './pages/MapPage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage';
import MyPage from './pages/MyPage';
import PetRegisterPage from './pages/PetRegisterPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminFeedsPage from './pages/admin/AdminFeedsPage';
import AdminPlacesPage from './pages/admin/AdminPlacesPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'feeds', element: <FeedPage /> },
      { path: 'feeds/:id', element: <FeedDetailPage /> },
      {
        path: 'feeds/write',
        element: <ProtectedRoute><FeedWritePage /></ProtectedRoute>,
      },
      { path: 'map', element: <MapPage /> },
      { path: 'places/:id', element: <PlaceDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'oauth2/callback', element: <OAuth2CallbackPage /> },
      {
        path: 'mypage',
        element: <ProtectedRoute><MyPage /></ProtectedRoute>,
      },
      {
        path: 'pets/register',
        element: <ProtectedRoute><PetRegisterPage /></ProtectedRoute>,
      },
      {
        path: 'admin',
        element: <AdminRoute><AdminDashboardPage /></AdminRoute>,
      },
      {
        path: 'admin/users',
        element: <AdminRoute><AdminUsersPage /></AdminRoute>,
      },
      {
        path: 'admin/feeds',
        element: <AdminRoute><AdminFeedsPage /></AdminRoute>,
      },
      {
        path: 'admin/places',
        element: <AdminRoute><AdminPlacesPage /></AdminRoute>,
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
