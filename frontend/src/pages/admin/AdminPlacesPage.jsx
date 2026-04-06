import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlaces } from '../../api/places';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPlaces(); }, [page]);

  const loadPlaces = () => {
    setLoading(true);
    getPlaces({ page, size: 20 })
      .then((res) => {
        setPlaces(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/admin" className="text-sm text-pet-brown/50 hover:text-pet-orange transition-colors">대시보드</Link>
            <svg className="w-4 h-4 text-pet-brown/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-sm text-pet-dark-brown font-medium">장소 관리</span>
          </div>
          <h1 className="text-2xl font-bold text-pet-dark-brown font-heading">장소 관리</h1>
        </div>
        <div className="px-3 py-1.5 bg-purple-50 rounded-lg text-sm font-medium text-purple-600">
          총 {places.length}건
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-pet-gray to-pet-cream border-b border-pet-gray">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">장소명</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">주소</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">카테고리</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">전화</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pet-gray/50">
              {places.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`transition-colors hover:bg-pet-cream/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-pet-gray/20'}`}
                >
                  <td className="px-5 py-3.5 text-pet-brown/50 font-mono text-xs">{p.id}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-pet-dark-brown">{p.title}</span>
                  </td>
                  <td className="px-5 py-3.5 text-pet-brown/60 max-w-[250px]">
                    <p className="truncate">{p.addr1}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2.5 py-1 bg-pet-mint/30 text-pet-brown rounded-full text-xs font-medium">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-pet-brown/50">
                    {p.tel ? (
                      <a href={`tel:${p.tel}`} className="hover:text-pet-orange transition-colors">{p.tel}</a>
                    ) : (
                      <span className="text-pet-brown/30">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-pet-gray/50">
          {places.map((p) => (
            <div key={p.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pet-mint/30 to-pet-sky/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-pet-brown/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-pet-dark-brown line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-pet-brown/50 mt-0.5 line-clamp-1">{p.addr1}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="inline-flex px-2 py-0.5 bg-pet-mint/30 text-pet-brown rounded-full text-xs">{p.category}</span>
                    {p.tel && <span className="text-xs text-pet-brown/40">{p.tel}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {places.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-pet-brown/40">등록된 장소가 없습니다</p>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
