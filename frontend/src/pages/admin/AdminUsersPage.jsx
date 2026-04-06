import { useState, useEffect } from 'react';
import { getUsers, deleteUser, changeUserRole } from '../../api/admin';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (!confirm('이 사용자를 삭제하시겠습니까?')) return;
    try { await deleteUser(id); loadUsers(); } catch { alert('삭제 실패'); }
  };

  const handleRoleChange = async (id, role) => {
    try { await changeUserRole(id, role); loadUsers(); } catch { alert('권한 변경 실패'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-pet-dark-brown mb-6">👥 사용자 관리</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-pet-gray">
            <tr>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">ID</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">이름</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">이메일</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">권한</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-pet-gray">
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-pet-brown/70">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.roles?.[0] || 'USER'}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="px-2 py-1 rounded-lg border border-pet-gray text-xs"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:underline text-xs">삭제</button>
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
