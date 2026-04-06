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
    {
      label: '총 사용자',
      value: stats?.totalUsers || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      label: '일반 회원',
      value: stats?.userCount || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
    },
    {
      label: '총 피드',
      value: stats?.feedCount || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      gradient: 'from-pet-orange to-orange-500',
      bgLight: 'bg-orange-50',
    },
    {
      label: '총 리뷰',
      value: stats?.reviewCount || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      gradient: 'from-yellow-500 to-amber-500',
      bgLight: 'bg-yellow-50',
    },
    {
      label: '총 장소',
      value: stats?.placeCount || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
    },
  ];

  const menus = [
    {
      to: '/admin/users',
      label: '사용자 관리',
      description: '회원 목록 조회 및 권한 관리',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'text-blue-500 bg-blue-50 group-hover:bg-blue-100',
    },
    {
      to: '/admin/feeds',
      label: '피드 관리',
      description: '피드 목록 조회 및 삭제',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'text-orange-500 bg-orange-50 group-hover:bg-orange-100',
    },
    {
      to: '/admin/places',
      label: '장소 관리',
      description: '반려동물 동반 장소 관리',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'text-purple-500 bg-purple-50 group-hover:bg-purple-100',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 pb-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="text-2xl font-bold text-pet-dark-brown font-heading">관리자 대시보드</h1>
        <p className="text-sm text-pet-brown/50 mt-1">WithPet 서비스 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 stagger-children">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 animate-slide-up"
          >
            <div className={`inline-flex w-11 h-11 rounded-xl items-center justify-center text-white bg-gradient-to-br ${card.gradient} mb-3 shadow-sm`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-pet-dark-brown animate-count-up">{card.value.toLocaleString()}</p>
            <p className="text-xs text-pet-brown/50 mt-1 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Access Menu */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-lg font-bold text-pet-dark-brown mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-pet-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          관리 메뉴
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {menus.map((menu) => (
            <Link
              key={menu.to}
              to={menu.to}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${menu.color}`}>
                  {menu.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-pet-dark-brown group-hover:text-pet-orange transition-colors">{menu.label}</h3>
                  <p className="text-xs text-pet-brown/50 mt-0.5">{menu.description}</p>
                </div>
                <svg className="w-5 h-5 text-pet-brown/30 group-hover:text-pet-orange group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
