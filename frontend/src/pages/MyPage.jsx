import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyProfile, updateProfile, deleteAccount, getMyFeeds, getMyReviews } from '../api/users';
import { getMyPets, deletePet } from '../api/pets';
import { getMyFavorites } from '../api/favorites';
import FeedCard from '../components/feed/FeedCard';
import StarRating from '../components/common/StarRating';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/authStore';

export default function MyPage() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();
  const [tab, setTab] = useState('pets');
  const [profile, setProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [feedPage, setFeedPage] = useState(0);
  const [feedTotalPages, setFeedTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editIntroduce, setEditIntroduce] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (tab === 'pets') loadPets();
    else if (tab === 'feeds') loadFeeds();
    else if (tab === 'favorites') loadFavorites();
  }, [tab, feedPage]);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);
      setEditName(res.data.name);
      setEditIntroduce(res.data.introduce || '');
    } finally {
      setLoading(false);
    }
  };

  const loadPets = () => getMyPets().then((res) => setPets(res.data)).catch(() => setPets([]));
  const loadFeeds = () =>
    getMyFeeds(feedPage).then((res) => {
      setFeeds(res.data.content || []);
      setFeedTotalPages(res.data.totalPages || 0);
    }).catch(() => setFeeds([]));
  const loadFavorites = () =>
    getMyFavorites().then((res) => setFavorites(res.data.content || [])).catch(() => setFavorites([]));

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ name: editName, introduce: editIntroduce });
      setProfile({ ...profile, name: editName, introduce: editIntroduce });
      setEditing(false);
      setUser({ ...user, name: editName });
    } catch {
      alert('프로필 수정에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('정말 계정을 삭제하시겠습니까? 모든 데이터가 삭제됩니다.')) return;
    try {
      await deleteAccount();
      logout();
      navigate('/');
    } catch {
      alert('계정 삭제에 실패했습니다.');
    }
  };

  const handleDeletePet = async (petId) => {
    if (!confirm('반려동물 프로필을 삭제하시겠습니까?')) return;
    try {
      await deletePet(petId);
      loadPets();
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;

  const tabs = [
    { key: 'pets', label: '🐾 내 반려동물' },
    { key: 'feeds', label: '📝 내 피드' },
    { key: 'favorites', label: '❤️ 찜 목록' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-pet-peach flex items-center justify-center text-3xl flex-shrink-0">
            {profile?.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt="" className="w-full h-full rounded-full object-cover" />
            ) : '🐾'}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-pet-gray text-sm focus:outline-none focus:border-pet-orange"
                  placeholder="이름"
                />
                <textarea
                  value={editIntroduce}
                  onChange={(e) => setEditIntroduce(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-pet-gray text-sm resize-none h-16 focus:outline-none focus:border-pet-orange"
                  placeholder="자기소개"
                />
                <div className="flex gap-2">
                  <button onClick={handleUpdateProfile} className="px-4 py-1.5 bg-pet-orange text-white rounded-lg text-sm">저장</button>
                  <button onClick={() => setEditing(false)} className="px-4 py-1.5 bg-pet-gray text-pet-brown rounded-lg text-sm">취소</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-pet-dark-brown">{profile?.name}</h2>
                <p className="text-sm text-pet-brown/60">{profile?.email}</p>
                {profile?.introduce && (
                  <p className="text-sm text-pet-brown/80 mt-1">{profile.introduce}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing(true)} className="text-sm text-pet-orange hover:underline">프로필 수정</button>
                  <button onClick={handleDeleteAccount} className="text-sm text-red-500 hover:underline">계정 삭제</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setFeedPage(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-pet-orange text-white' : 'bg-white text-pet-brown hover:bg-pet-peach'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'pets' && (
        <div>
          <div className="flex justify-end mb-4">
            <Link to="/pets/register" className="px-4 py-2 bg-pet-orange text-white rounded-xl text-sm font-medium hover:bg-pet-orange/90 transition-colors">
              + 반려동물 등록
            </Link>
          </div>
          {pets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <div className="text-4xl mb-3">🐕</div>
              <p className="text-pet-brown/60">등록된 반려동물이 없습니다</p>
              <Link to="/pets/register" className="inline-block mt-3 text-pet-orange font-medium hover:underline">
                반려동물을 등록해보세요!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full bg-pet-peach flex items-center justify-center text-2xl">
                      {pet.profileImageUrl ? (
                        <img src={pet.profileImageUrl} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : pet.species === '고양이' ? '🐱' : '🐶'}
                    </div>
                    <div>
                      <h3 className="font-bold text-pet-dark-brown">{pet.name}</h3>
                      <p className="text-xs text-pet-brown/60">{pet.species} {pet.breed && `· ${pet.breed}`}</p>
                    </div>
                  </div>
                  {pet.introduction && (
                    <p className="text-sm text-pet-brown/70 mb-3">{pet.introduction}</p>
                  )}
                  <div className="flex justify-between items-center text-xs text-pet-brown/50">
                    <div className="flex gap-3">
                      {pet.birthYear > 0 && <span>{new Date().getFullYear() - pet.birthYear}살</span>}
                      {pet.weight > 0 && <span>{pet.weight}kg</span>}
                    </div>
                    <button onClick={() => handleDeletePet(pet.id)} className="text-red-500 hover:underline">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'feeds' && (
        <div>
          {feeds.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-pet-brown/60">작성한 피드가 없습니다</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {feeds.map((feed) => (
                  <FeedCard key={feed.id} feed={feed} />
                ))}
              </div>
              <Pagination page={feedPage} totalPages={feedTotalPages} onPageChange={setFeedPage} />
            </>
          )}
        </div>
      )}

      {tab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <div className="text-4xl mb-3">❤️</div>
              <p className="text-pet-brown/60">찜한 장소가 없습니다</p>
              <Link to="/map" className="inline-block mt-3 text-pet-orange font-medium hover:underline">
                장소를 둘러보세요!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((place) => (
                <Link key={place.id} to={`/places/${place.id}`} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-3">
                    {place.imageUrls?.[0] ? (
                      <img src={place.imageUrls[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-pet-gray flex items-center justify-center text-xl">🐾</div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-pet-dark-brown">{place.title}</h3>
                      <p className="text-xs text-pet-brown/60 mt-0.5">{place.addr1}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
