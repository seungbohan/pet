import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminFeeds, deleteAdminFeed } from '../../api/admin';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useToastStore from '../../store/toastStore';

export default function AdminFeedsPage() {
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadFeeds(); }, [page]);

  const loadFeeds = () => {
    setLoading(true);
    getAdminFeeds(page)
      .then((res) => {
        setFeeds(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAdminFeed(deleteTarget);
      loadFeeds();
    } catch {
      useToastStore.getState().addToast('삭제에 실패했습니다.', 'error');
    }
    setDeleteTarget(null);
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
            <span className="text-sm text-pet-dark-brown font-medium">피드 관리</span>
          </div>
          <h1 className="text-2xl font-bold text-pet-dark-brown font-heading">피드 관리</h1>
        </div>
        <div className="px-3 py-1.5 bg-pet-orange/10 rounded-lg text-sm font-medium text-pet-orange">
          총 {feeds.length}건
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
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">제목</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">작성자</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">작성일</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pet-gray/50">
              {feeds.map((f, idx) => (
                <tr
                  key={f.id}
                  className={`transition-colors hover:bg-pet-cream/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-pet-gray/20'}`}
                >
                  <td className="px-5 py-3.5 text-pet-brown/50 font-mono text-xs">{f.id}</td>
                  <td className="px-5 py-3.5">
                    <Link to={`/feeds/${f.id}`} className="font-medium text-pet-dark-brown hover:text-pet-orange transition-colors">
                      {f.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pet-peach to-pet-orange flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {f.writerName?.charAt(0) || '?'}
                      </div>
                      <span className="text-pet-brown/70">{f.writerName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-pet-brown/50 text-xs">
                    {f.regDate && new Date(f.regDate).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setDeleteTarget(f.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-pet-gray/50">
          {feeds.map((f) => (
            <div key={f.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link to={`/feeds/${f.id}`} className="font-medium text-sm text-pet-dark-brown hover:text-pet-orange transition-colors line-clamp-1">
                    {f.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-xs text-pet-brown/50">
                    <span>{f.writerName}</span>
                    <span className="w-1 h-1 rounded-full bg-pet-brown/30" />
                    <span>{f.regDate && new Date(f.regDate).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteTarget(f.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        {feeds.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-pet-brown/40">피드가 없습니다</p>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-pet-dark-brown text-center mb-2">피드를 삭제하시겠습니까?</h3>
            <p className="text-sm text-pet-brown/60 text-center mb-6">이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 bg-pet-gray text-pet-brown rounded-xl font-medium hover:bg-pet-peach transition-colors">
                취소
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
