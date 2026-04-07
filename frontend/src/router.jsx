import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import MapPage from './pages/MapPage';
import LoadingSpinner from './components/common/LoadingSpinner';

const FeedPage = lazy(() => import('./pages/FeedPage'));
const FeedDetailPage = lazy(() => import('./pages/FeedDetailPage'));
const FeedWritePage = lazy(() => import('./pages/FeedWritePage'));
const PlaceDetailPage = lazy(() => import('./pages/PlaceDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const OAuth2CallbackPage = lazy(() => import('./pages/OAuth2CallbackPage'));
const MyPage = lazy(() => import('./pages/MyPage'));
const PetRegisterPage = lazy(() => import('./pages/PetRegisterPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminFeedsPage = lazy(() => import('./pages/admin/AdminFeedsPage'));
const AdminPlacesPage = lazy(() => import('./pages/admin/AdminPlacesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

const L = ({ children }) => <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      /* Map is the landing page */
      { index: true, element: <MapPage /> },
      { path: 'map', element: <MapPage /> },

      /* Feeds */
      { path: 'feeds', element: <L><FeedPage /></L> },
      { path: 'feeds/:id', element: <L><FeedDetailPage /></L> },
      {
        path: 'feeds/write',
        element: <ProtectedRoute><L><FeedWritePage /></L></ProtectedRoute>,
      },

      /* Places (standalone detail page kept for deep links) */
      { path: 'places/:id', element: <L><PlaceDetailPage /></L> },

      /* Auth */
      { path: 'login', element: <L><LoginPage /></L> },
      { path: 'signup', element: <L><SignupPage /></L> },
      { path: 'oauth2/callback', element: <L><OAuth2CallbackPage /></L> },

      /* User pages */
      {
        path: 'mypage',
        element: <ProtectedRoute><L><MyPage /></L></ProtectedRoute>,
      },
      {
        path: 'pets/register',
        element: <ProtectedRoute><L><PetRegisterPage /></L></ProtectedRoute>,
      },

      /* Admin pages */
      {
        path: 'admin',
        element: <AdminRoute><L><AdminDashboardPage /></L></AdminRoute>,
      },
      {
        path: 'admin/users',
        element: <AdminRoute><L><AdminUsersPage /></L></AdminRoute>,
      },
      {
        path: 'admin/feeds',
        element: <AdminRoute><L><AdminFeedsPage /></L></AdminRoute>,
      },
      {
        path: 'admin/places',
        element: <AdminRoute><L><AdminPlacesPage /></L></AdminRoute>,
      },

      /* 404 */
      { path: '*', element: <L><NotFoundPage /></L> },
    ],
  },
]);

export default router;
