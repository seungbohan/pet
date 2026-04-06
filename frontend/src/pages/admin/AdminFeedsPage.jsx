import { useState, useEffect } from 'react';
import { getAdminFeeds, deleteAdminFeed } from '../../api/admin';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminFeedsPage() {
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (!confirm('이 피드를 삭제하시겠습니까?')) return;
    try { await deleteAdminFeed(id); loadFeeds(); } catch { alert('삭제 실패'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-pet-dark-brown mb-6">📝 피드 관리</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-pet-gray">
            <tr>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">ID</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">제목</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">작성자</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">작성일</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {feeds.map((f) => (
              <tr key={f.id} className="border-t border-pet-gray">
                <td className="px-4 py-3">{f.id}</td>
                <td className="px-4 py-3 font-medium">{f.title}</td>
                <td className="px-4 py-3 text-pet-brown/70">{f.writerName}</td>
                <td className="px-4 py-3 text-pet-brown/70">{f.regDate && new Date(f.regDate).toLocaleDateString('ko-KR')}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:underline text-xs">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
