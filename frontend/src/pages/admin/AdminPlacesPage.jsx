import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlaces } from '../../api/places';
import client from '../../api/client';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import useToastStore from '../../store/toastStore';

export default function AdminPlacesPage() {
  const [tab, setTab] = useState('submissions'); // 'places' | 'submissions'
  const [places, setPlaces] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [confirmAction, setConfirmAction] = useState(null); // { id, status, message }
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => { setPage(0); }, [tab, statusFilter]);
  useEffect(() => { tab === 'places' ? loadPlaces() : loadSubmissions(); }, [page, tab, statusFilter]);

  const loadPlaces = () => {
    setLoading(true);
    getPlaces({ page, size: 20 })
      .then((res) => {
        setPlaces(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .finally(() => setLoading(false));
  };

  const loadSubmissions = () => {
    setLoading(true);
    client.get('/admin/submissions', { params: { page, size: 20, status: statusFilter } })
      .then((res) => {
        setSubmissions(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .finally(() => setLoading(false));
  };

  const handleStatusChange = (id, status) => {
    const msg = status === 'APPROVED' ? '승인하시겠습니까? 지도에 바로 반영됩니다.' : '거절하시겠습니까?';
    setConfirmAction({ id, status, message: msg });
  };

  const executeStatusChange = async () => {
    if (!confirmAction) return;
    try {
      await client.put(`/admin/places/${confirmAction.id}/status`, { status: confirmAction.status });
      loadSubmissions();
      addToast(confirmAction.status === 'APPROVED' ? '승인되었습니다.' : '거절되었습니다.', 'success');
    } catch {
      addToast('처리에 실패했습니다.', 'error');
    }
    setConfirmAction(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-slide-up">
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
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setTab('submissions')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'submissions' ? 'bg-pet-orange text-white' : 'text-pet-brown/60 hover:text-pet-orange'}`}
        >
          제보 관리
        </button>
        <button
          onClick={() => setTab('places')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'places' ? 'bg-pet-orange text-white' : 'text-pet-brown/60 hover:text-pet-orange'}`}
        >
          등록 장소
        </button>
      </div>

      {tab === 'submissions' ? (
        <>
          {/* Status filter */}
          <div className="flex gap-2 mb-4">
            {[
              { key: 'PENDING', label: '대기중', color: 'bg-yellow-100 text-yellow-700' },
              { key: 'APPROVED', label: '승인됨', color: 'bg-green-100 text-green-700' },
              { key: 'REJECTED', label: '거절됨', color: 'bg-red-100 text-red-700' },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s.key ? s.color : 'bg-pet-gray text-pet-brown/50'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Submissions list */}
          <div className="space-y-3">
            {submissions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <p className="text-pet-brown/40">제보 내역이 없습니다</p>
              </div>
            ) : submissions.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl p-5 shadow-sm animate-slide-up">
                <div className="flex gap-4">
                  {s.imageUrl && (
                    <img src={s.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-pet-dark-brown">{s.title}</h3>
                        <p className="text-xs text-pet-brown/60 mt-0.5">{s.addr1}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                        s.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        s.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {s.status === 'PENDING' ? '대기' : s.status === 'APPROVED' ? '승인' : '거절'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-pet-brown/50">
                      {s.category && <span className="px-1.5 py-0.5 bg-pet-mint/30 rounded text-pet-brown">{s.category}</span>}
                      {s.tel && <span>📞 {s.tel}</span>}
                      <span>제보자: {s.submitterName}</span>
                      <span>{new Date(s.regDate).toLocaleDateString('ko-KR')}</span>
                    </div>
                    {s.description && (
                      <p className="text-xs text-pet-brown/70 mt-2 line-clamp-2">{s.description}</p>
                    )}
                    {s.status === 'PENDING' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleStatusChange(s.id, 'APPROVED')}
                          className="px-4 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleStatusChange(s.id, 'REJECTED')}
                          className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
                        >
                          거절
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Places table (existing) */
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
                  <tr key={p.id} className={`transition-colors hover:bg-pet-cream/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-pet-gray/20'}`}>
                    <td className="px-5 py-3.5 text-pet-brown/50 font-mono text-xs">{p.id}</td>
                    <td className="px-5 py-3.5 font-medium text-pet-dark-brown">{p.title}</td>
                    <td className="px-5 py-3.5 text-pet-brown/60 max-w-[250px] truncate">{p.addr1}</td>
                    <td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-pet-mint/30 text-pet-brown rounded-full text-xs font-medium">{p.category}</span></td>
                    <td className="px-5 py-3.5 text-pet-brown/50">{p.tel || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden divide-y divide-pet-gray/50">
            {places.map((p) => (
              <div key={p.id} className="p-4">
                <h3 className="font-medium text-sm text-pet-dark-brown">{p.title}</h3>
                <p className="text-xs text-pet-brown/50 mt-0.5">{p.addr1}</p>
                <span className="inline-flex px-2 py-0.5 bg-pet-mint/30 text-pet-brown rounded-full text-xs mt-1">{p.category}</span>
              </div>
            ))}
          </div>
          {places.length === 0 && (
            <div className="py-16 text-center"><p className="text-pet-brown/40">등록된 장소가 없습니다</p></div>
          )}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Status Change Confirmation */}
      <ConfirmModal
        open={!!confirmAction}
        title="장소 상태 변경"
        message={confirmAction?.message || ''}
        confirmText={confirmAction?.status === 'APPROVED' ? '승인' : '거절'}
        variant={confirmAction?.status === 'APPROVED' ? 'default' : 'danger'}
        onConfirm={executeStatusChange}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
