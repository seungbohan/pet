import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: '총 사용자', value: stats?.totalUsers || 0, icon: '👥', color: 'bg-blue-50 text-blue-600' },
    { label: '일반 회원', value: stats?.userCount || 0, icon: '🙋', color: 'bg-green-50 text-green-600' },
    { label: '총 피드', value: stats?.feedCount || 0, icon: '📝', color: 'bg-orange-50 text-orange-600' },
    { label: '총 리뷰', value: stats?.reviewCount || 0, icon: '⭐', color: 'bg-yellow-50 text-yellow-600' },
    { label: '총 장소', value: stats?.placeCount || 0, icon: '📍', color: 'bg-purple-50 text-purple-600' },
  ];

  const menus = [
    { to: '/admin/users', label: '사용자 관리', icon: '👥' },
    { to: '/admin/feeds', label: '피드 관리', icon: '📝' },
    { to: '/admin/places', label: '장소 관리', icon: '📍' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-pet-dark-brown mb-6">📊 관리자 대시보드</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <div className={`inline-flex w-12 h-12 rounded-full items-center justify-center text-xl mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-pet-dark-brown">{card.value}</p>
            <p className="text-xs text-pet-brown/60 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-pet-dark-brown mb-4">관리 메뉴</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {menus.map((menu) => (
          <Link key={menu.to} to={menu.to}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
            <span className="text-2xl">{menu.icon}</span>
            <span className="font-medium text-pet-brown">{menu.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
