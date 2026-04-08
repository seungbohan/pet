import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser, changeUserRole } from '../../api/admin';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useToastStore from '../../store/toastStore';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadUsers(); }, [page]);

  const loadUsers = () => {
    setLoading(true);
    getUsers(page)
      .then((res) => {
        setUsers(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget);
      loadUsers();
    } catch {
      useToastStore.getState().addToast('삭제에 실패했습니다.', 'error');
    }
    setDeleteTarget(null);
  };

  const handleRoleChange = async (id, role) => {
    try { await changeUserRole(id, role); loadUsers(); } catch { useToastStore.getState().addToast('권한 변경에 실패했습니다.', 'error'); }
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
            <span className="text-sm text-pet-dark-brown font-medium">사용자 관리</span>
          </div>
          <h1 className="text-2xl font-bold text-pet-dark-brown font-heading">사용자 관리</h1>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 rounded-lg text-sm font-medium text-blue-600">
          총 {users.length}명
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
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">사용자</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">이메일</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">권한</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-pet-brown/70 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pet-gray/50">
              {users.map((u, idx) => (
                <tr
                  key={u.id}
                  className={`transition-colors hover:bg-pet-cream/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-pet-gray/20'}`}
                >
                  <td className="px-5 py-3.5 text-pet-brown/50 font-mono text-xs">{u.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pet-sky to-pet-mint flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name?.charAt(0) || '?'}
                      </div>
                      <span className="font-medium text-pet-dark-brown">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-pet-brown/60">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={u.roles?.[0] || 'USER'}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pet-orange/20 transition-all cursor-pointer ${
                        (u.roles?.[0] || 'USER') === 'ADMIN'
                          ? 'bg-pet-orange/10 border-pet-orange/30 text-pet-orange'
                          : 'bg-pet-gray border-pet-gray text-pet-brown/70'
                      }`}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setDeleteTarget(u.id)}
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
          {users.map((u) => (
            <div key={u.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pet-sky to-pet-mint flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {u.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm text-pet-dark-brown">{u.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      (u.roles?.[0] || 'USER') === 'ADMIN'
                        ? 'bg-pet-orange/10 text-pet-orange'
                        : 'bg-pet-gray text-pet-brown/60'
                    }`}>
                      {u.roles?.[0] || 'USER'}
                    </span>
                  </div>
                  <p className="text-xs text-pet-brown/50 mt-0.5 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={u.roles?.[0] || 'USER'}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="px-2 py-1 rounded-lg border border-pet-gray text-xs focus:outline-none"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button
                    onClick={() => setDeleteTarget(u.id)}
                    className="p-1.5 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-pet-brown/40">등록된 사용자가 없습니다</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-pet-dark-brown text-center mb-2">사용자를 삭제하시겠습니까?</h3>
            <p className="text-sm text-pet-brown/60 text-center mb-6">해당 사용자의 모든 데이터가 삭제됩니다.</p>
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
