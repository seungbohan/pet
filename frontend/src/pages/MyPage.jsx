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
import { uploadImages, getImageUrl } from '../api/upload';

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
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showDeletePetModal, setShowDeletePetModal] = useState(null);
  const [editProfileImage, setEditProfileImage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

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
      setEditProfileImage(res.data.profileImageUrl || '');
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
      await updateProfile({ name: editName, introduce: editIntroduce, profileImageUrl: editProfileImage || null });
      setProfile({ ...profile, name: editName, introduce: editIntroduce, profileImageUrl: editProfileImage || null });
      setEditing(false);
      setUser({ ...user, name: editName });
    } catch {
      alert('프로필 수정에 실패했습니다.');
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const res = await uploadImages([file]);
      const uploaded = res.data?.[0];
      if (!uploaded) { alert('이미지 업로드에 실패했습니다.'); return; }
      const url = getImageUrl(uploaded.imageURL || uploaded.fileName);
      setEditProfileImage(url);
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      logout();
      navigate('/');
    } catch {
      alert('계정 삭제에 실패했습니다.');
    }
    setShowDeleteAccountModal(false);
  };

  const handleDeletePet = async (petId) => {
    try {
      await deletePet(petId);
      loadPets();
    } catch {
      alert('삭제에 실패했습니다.');
    }
    setShowDeletePetModal(null);
  };

  if (loading) return <LoadingSpinner />;

  const tabs = [
    {
      key: 'pets',
      label: '반려동물',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
    },
    {
      key: 'feeds',
      label: '피드',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      key: 'favorites',
      label: '찜 목록',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 pb-8">
      {/* Profile Card with Gradient Header */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 animate-slide-up">
        {/* Gradient Header Background */}
        <div className="relative h-28 bg-gradient-to-r from-pet-orange via-pet-pink to-pet-peach">
          {/* Decorative paw patterns */}
          <div className="absolute inset-0 opacity-20">
            <svg className="absolute top-3 left-6 w-8 h-8 text-white rotate-12" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="16" r="4"/><circle cx="6" cy="10" r="2.5"/><circle cx="18" cy="10" r="2.5"/><circle cx="8.5" cy="5" r="2"/><circle cx="15.5" cy="5" r="2"/>
            </svg>
            <svg className="absolute top-8 right-12 w-6 h-6 text-white -rotate-12" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="16" r="4"/><circle cx="6" cy="10" r="2.5"/><circle cx="18" cy="10" r="2.5"/><circle cx="8.5" cy="5" r="2"/><circle cx="15.5" cy="5" r="2"/>
            </svg>
            <svg className="absolute bottom-2 left-1/3 w-5 h-5 text-white rotate-45" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="16" r="4"/><circle cx="6" cy="10" r="2.5"/><circle cx="18" cy="10" r="2.5"/><circle cx="8.5" cy="5" r="2"/><circle cx="15.5" cy="5" r="2"/>
            </svg>
          </div>
        </div>

        {/* Profile Content */}
        <div className="relative px-5 pb-5">
          {/* Avatar - overlapping the gradient */}
          <div className="absolute -top-10 left-5">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
              {profile?.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="" className="w-full h-full rounded-xl object-cover" />
              ) : (
                <div className="w-full h-full rounded-xl bg-pet-gray flex flex-col items-center justify-center">
                  <svg className="w-7 h-7 text-pet-brown/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                  <span className="text-[8px] text-pet-brown/30 mt-0.5">이미지 없음</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-14">
            {editing ? (
              <div className="space-y-3 animate-scale-in">
                {/* Profile image upload */}
                <div>
                  <label className="text-xs font-medium text-pet-brown/60 mb-1 block">프로필 이미지</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-pet-gray flex-shrink-0">
                      {editProfileImage ? (
                        <img src={editProfileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-pet-brown/30 text-xs">없음</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label className="px-3 py-1.5 bg-pet-orange text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-pet-orange/90 transition-colors">
                        {imageUploading ? '업로드 중...' : '사진 선택'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} disabled={imageUploading} />
                      </label>
                      {editProfileImage && (
                        <button
                          type="button"
                          onClick={() => setEditProfileImage('')}
                          className="px-3 py-1.5 bg-pet-gray text-pet-brown rounded-lg text-xs font-medium hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-pet-brown/60 mb-1 block">이름</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-pet-gray/60 text-sm focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/10 transition-all"
                    placeholder="이름"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-pet-brown/60 mb-1 block">자기소개</label>
                  <textarea
                    value={editIntroduce}
                    onChange={(e) => setEditIntroduce(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-pet-gray/60 text-sm resize-none h-20 focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/10 transition-all"
                    placeholder="자기소개를 입력해주세요"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    className="px-5 py-2 bg-pet-orange text-white rounded-xl text-sm font-semibold hover:bg-pet-orange/90 transition-colors"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-5 py-2 bg-pet-gray text-pet-brown rounded-xl text-sm font-medium hover:bg-pet-peach transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-pet-dark-brown font-heading">{profile?.name}</h2>
                    <p className="text-sm text-pet-brown/50 mt-0.5">{profile?.email}</p>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-3 py-1.5 text-xs font-medium text-pet-orange bg-pet-orange/10 rounded-lg hover:bg-pet-orange/20 transition-colors"
                  >
                    프로필 수정
                  </button>
                </div>
                {profile?.introduce && (
                  <p className="text-sm text-pet-brown/70 mt-3 leading-relaxed">{profile.introduce}</p>
                )}

                {/* Activity Stats Row */}
                <div className="flex gap-3 mt-5">
                  <div className="flex-1 bg-gradient-to-br from-pet-cream to-pet-peach/30 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-pet-orange">{pets.length || 0}</p>
                    <p className="text-xs text-pet-brown/60 mt-0.5">반려동물</p>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-pet-cream to-pet-sky/30 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-blue-500">{feeds.length || 0}</p>
                    <p className="text-xs text-pet-brown/60 mt-0.5">피드</p>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-pet-cream to-pet-pink/30 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-pink-500">{favorites.length || 0}</p>
                    <p className="text-xs text-pet-brown/60 mt-0.5">찜 목록</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDeleteAccountModal(true)}
                  className="mt-4 text-xs text-pet-brown/30 hover:text-red-500 transition-colors"
                >
                  계정 삭제
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6 bg-white rounded-xl p-1.5 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setFeedPage(0); }}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t.key
                ? 'bg-pet-orange text-white shadow-sm'
                : 'text-pet-brown/60 hover:text-pet-brown hover:bg-pet-cream'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content-enter">
        {tab === 'pets' && (
          <div>
            <div className="flex justify-end mb-4">
              <Link
                to="/pets/register"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-pet-orange to-pet-pink text-white rounded-xl text-sm font-semibold shadow-md shadow-pet-orange/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                반려동물 등록
              </Link>
            </div>
            {pets.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-pet-peach/30 flex items-center justify-center animate-float">
                  <svg className="w-10 h-10 text-pet-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <p className="text-pet-brown/60 font-medium">등록된 반려동물이 없습니다</p>
                <p className="text-sm text-pet-brown/40 mt-1">소중한 반려동물을 등록해보세요</p>
                <Link to="/pets/register" className="inline-flex items-center gap-1 mt-4 text-pet-orange font-semibold text-sm hover:underline">
                  지금 등록하기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
                {pets.map((pet) => (
                  <div key={pet.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all group animate-slide-up paw-pattern">
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pet-peach to-pet-orange/60 flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                          {pet.profileImageUrl ? (
                            <img src={pet.profileImageUrl} alt="" className="w-full h-full rounded-xl object-cover" />
                          ) : pet.species === '고양이' ? (
                            <span>&#x1F431;</span>
                          ) : pet.species === '강아지' ? (
                            <span>&#x1F436;</span>
                          ) : (
                            <span>&#x1F43E;</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-pet-dark-brown font-heading">{pet.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs px-2 py-0.5 bg-pet-orange/10 text-pet-orange rounded-full font-medium">{pet.species}</span>
                            {pet.breed && <span className="text-xs text-pet-brown/50">{pet.breed}</span>}
                          </div>
                        </div>
                      </div>
                      {pet.introduction && (
                        <p className="text-sm text-pet-brown/70 mb-3 leading-relaxed line-clamp-2">{pet.introduction}</p>
                      )}
                      <div className="flex justify-between items-center pt-3 border-t border-pet-gray/50">
                        <div className="flex gap-3 text-xs text-pet-brown/50">
                          {pet.birthYear > 0 && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.75 1.75 0 003 15.546" />
                              </svg>
                              {new Date().getFullYear() - pet.birthYear}살
                            </span>
                          )}
                          {pet.weight > 0 && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                              </svg>
                              {pet.weight}kg
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setShowDeletePetModal(pet.id)}
                          className="text-xs text-pet-brown/30 hover:text-red-500 px-2 py-1 rounded-md hover:bg-red-50 transition-all"
                        >
                          삭제
                        </button>
                      </div>
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
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-pet-sky/20 flex items-center justify-center animate-float">
                  <svg className="w-10 h-10 text-pet-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-pet-brown/60 font-medium">작성한 피드가 없습니다</p>
                <p className="text-sm text-pet-brown/40 mt-1">반려동물과의 일상을 공유해보세요</p>
                <Link to="/feeds/write" className="inline-flex items-center gap-1 mt-4 text-pet-orange font-semibold text-sm hover:underline">
                  첫 피드 작성하기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
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
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-pet-pink/20 flex items-center justify-center animate-float">
                  <svg className="w-10 h-10 text-pet-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-pet-brown/60 font-medium">찜한 장소가 없습니다</p>
                <p className="text-sm text-pet-brown/40 mt-1">마음에 드는 장소를 찜해보세요</p>
                <Link to="/map" className="inline-flex items-center gap-1 mt-4 text-pet-orange font-semibold text-sm hover:underline">
                  장소 둘러보기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {favorites.map((place) => (
                  <Link
                    key={place.id}
                    to={`/places/${place.id}`}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group animate-slide-up"
                  >
                    {/* Place Image or Placeholder */}
                    <div className="h-32 bg-gradient-to-br from-pet-mint/30 to-pet-sky/30 overflow-hidden">
                      {place.imageUrls?.[0] ? (
                        <img src={place.imageUrls[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-pet-brown/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-pet-dark-brown group-hover:text-pet-orange transition-colors line-clamp-1">{place.title}</h3>
                      <p className="text-xs text-pet-brown/50 mt-1 line-clamp-1">{place.addr1}</p>
                      {/* Heart icon */}
                      <div className="flex justify-end mt-2">
                        <span className="text-pet-pink">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={() => setShowDeleteAccountModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-pet-dark-brown text-center mb-2">정말 계정을 삭제하시겠습니까?</h3>
            <p className="text-sm text-pet-brown/60 text-center mb-6">모든 데이터가 영구적으로 삭제되며,<br />복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                className="flex-1 py-2.5 bg-pet-gray text-pet-brown rounded-xl font-medium hover:bg-pet-peach transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Pet Modal */}
      {showDeletePetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={() => setShowDeletePetModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-pet-dark-brown text-center mb-2">반려동물 프로필을 삭제하시겠습니까?</h3>
            <p className="text-sm text-pet-brown/60 text-center mb-6">삭제된 프로필은 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeletePetModal(null)}
                className="flex-1 py-2.5 bg-pet-gray text-pet-brown rounded-xl font-medium hover:bg-pet-peach transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDeletePet(showDeletePetModal)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
