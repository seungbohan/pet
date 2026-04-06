import { useState, useEffect } from 'react';
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
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-pet-dark-brown mb-6">📍 장소 관리</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-pet-gray">
            <tr>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">ID</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">장소명</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">주소</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">카테고리</th>
              <th className="px-4 py-3 text-left text-pet-brown font-medium">전화</th>
            </tr>
          </thead>
          <tbody>
            {places.map((p) => (
              <tr key={p.id} className="border-t border-pet-gray">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-pet-brown/70 truncate max-w-[200px]">{p.addr1}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-pet-mint rounded-full text-xs">{p.category}</span>
                </td>
                <td className="px-4 py-3 text-pet-brown/70">{p.tel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
