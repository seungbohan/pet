import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPlace } from '../api/places';
import { getPlaceReviews, createPlaceReview, deleteReview } from '../api/reviews';
import { toggleFavorite } from '../api/favorites';
import { uploadImages, getImageUrl } from '../api/upload';
import client from '../api/client';
import StarRating from '../components/common/StarRating';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHead from '../components/common/SEOHead';
import useAuthStore from '../store/authStore';

export default function PlaceDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [imgUploading, setImgUploading] = useState(false);

  useEffect(() => {
    getPlace(id)
      .then((res) => {
        setPlace(res.data);
        setFavorited(res.data.favorited);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getPlaceReviews(id, reviewPage)
      .then((res) => {
        setReviews(res.data.content || []);
        setReviewTotalPages(res.data.totalPages || 0);
      })
      .catch(() => {});
  }, [id, reviewPage]);

  const handleFavorite = async () => {
    try {
      const res = await toggleFavorite(id);
      setFavorited(res.data.favorited);
    } catch {}
  };

  const handleReviewDelete = async (reviewId) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;
    try {
      await deleteReview(reviewId);
      const res = await getPlaceReviews(id, 0);
      setReviews(res.data.content || []);
      setReviewTotalPages(res.data.totalPages || 0);
      setReviewPage(0);
      const placeRes = await getPlace(id);
      setPlace(placeRes.data);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const uploadRes = await uploadImages([file]);
      const uploaded = uploadRes.data[0];
      const url = getImageUrl(uploaded.imageURL || uploaded.fileName);
      await client.post(`/places/${id}/images`, { imageUrl: url });
      const placeRes = await getPlace(id);
      setPlace(placeRes.data);
      setCurrentImg(0);
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setImgUploading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    try {
      await createPlaceReview(id, { content: newReview, rating: newRating, guestName: !isAuthenticated ? (guestName || '비회원') : undefined });
      setNewReview('');
      setNewRating(5);
      // Reload reviews
      const res = await getPlaceReviews(id, 0);
      setReviews(res.data.content || []);
      setReviewTotalPages(res.data.totalPages || 0);
      setReviewPage(0);
    } catch {
      alert('리뷰 작성에 실패했습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!place) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <SEOHead
        title={`${place.title} - 반려동물 동반 장소`}
        description={place.description?.substring(0, 155) || `${place.title} - 반려동물 동반 가능한 장소 정보, 리뷰, 위치를 확인하세요.`}
        path={`/places/${id}`}
        image={place.imageUrls?.[0] || undefined}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: place.title,
            description: place.description,
            address: place.addr1 ? { '@type': 'PostalAddress', streetAddress: place.addr1 } : undefined,
            geo: place.mapx && place.mapy ? { '@type': 'GeoCoordinates', latitude: place.mapy, longitude: place.mapx } : undefined,
            image: place.firstimage || place.imageUrls?.[0],
            url: `https://withpet.shop/places/${id}`,
            aggregateRating: place.avgRating ? { '@type': 'AggregateRating', ratingValue: place.avgRating, reviewCount: place.reviewCount || 1 } : undefined,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '홈', item: 'https://withpet.shop/' },
              { '@type': 'ListItem', position: 2, name: '장소 찾기', item: 'https://withpet.shop/map' },
              { '@type': 'ListItem', position: 3, name: place.title },
            ],
          },
        ]}
      />
      {/* Image Gallery */}
      {(() => {
        const allImages = [];
        if (place.firstimage) allImages.push(place.firstimage);
        if (place.imageUrls?.length > 0) {
          place.imageUrls.forEach((url) => { if (!allImages.includes(url)) allImages.push(url); });
        }
        return (
          <div className="rounded-2xl overflow-hidden mb-6">
            {allImages.length > 0 ? (
              <>
                <img
                  key={currentImg}
                  src={allImages[currentImg] || allImages[0]}
                  alt={place.title}
                  className="w-full h-[350px] object-cover"
                />
                {allImages.length > 1 && (
                  <div className="flex gap-2 mt-2">
                    {allImages.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImg(i)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          i === currentImg ? 'border-pet-orange' : 'border-transparent'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-[200px] bg-gradient-to-br from-pet-peach to-pet-cream flex items-center justify-center rounded-2xl">
                <span className="text-5xl">🐾</span>
              </div>
            )}
            {isAuthenticated && (
              <div className="mt-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-pet-orange text-white rounded-xl text-sm font-semibold cursor-pointer hover:bg-pet-orange/90 transition-colors">
                  {imgUploading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 업로드 중...</>
                  ) : (
                    <>📷 사진 추가</>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={imgUploading} />
                </label>
              </div>
            )}
          </div>
        );
      })()}

      {/* Place Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-pet-dark-brown">{place.title}</h1>
            <p className="text-pet-brown/60 text-sm mt-1">📍 {place.addr1}</p>
            {place.tel && <p className="text-pet-brown/60 text-sm">📞 {place.tel}</p>}
          </div>
          {isAuthenticated && (
            <button
              onClick={handleFavorite}
              className={`text-2xl transition-transform hover:scale-110 ${
                favorited ? 'text-pet-pink' : 'text-gray-300'
              }`}
            >
              {favorited ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {place.avgRating > 0 && (
            <div className="flex items-center gap-1">
              <StarRating rating={Math.round(place.avgRating)} readOnly size="text-lg" />
              <span className="text-sm text-pet-brown font-medium">
                {place.avgRating.toFixed(1)}
              </span>
            </div>
          )}
          <span className="text-sm text-pet-brown/50">리뷰 {place.reviewCount}개</span>
          <span className="px-2 py-0.5 bg-pet-mint text-pet-dark-brown rounded-full text-xs font-medium">
            {place.category}
          </span>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-pet-dark-brown mb-4">리뷰</h2>

        <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-pet-cream rounded-xl">
            {!isAuthenticated && (
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="닉네임 (선택)"
                maxLength={20}
                className="w-full p-3 mb-2 rounded-xl border border-pet-gray bg-white text-sm focus:outline-none focus:border-pet-orange"
              />
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-pet-brown">별점</span>
              <StarRating rating={newRating} onChange={setNewRating} size="text-lg" />
            </div>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="방문 후기를 남겨주세요..."
              className="w-full p-3 rounded-xl border border-pet-gray bg-white text-sm resize-none h-20 focus:outline-none focus:border-pet-orange"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-pet-orange text-white rounded-xl text-sm font-medium hover:bg-pet-orange/90 transition-colors"
            >
              리뷰 작성
            </button>
          </form>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border border-pet-gray rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm text-pet-brown">{review.writerName}</span>
                <StarRating rating={review.rating} readOnly size="text-sm" />
                <span className="text-xs text-pet-brown/40 ml-auto">
                  {new Date(review.regDate).toLocaleDateString('ko-KR')}
                </span>
                {user?.email === review.writerEmail && (
                  <button
                    onClick={() => handleReviewDelete(review.id)}
                    className="text-xs text-pet-brown/40 hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="text-sm text-pet-brown/80">{review.content}</p>
              {review.tags?.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {review.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-pet-mint text-pet-dark-brown rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Pagination page={reviewPage} totalPages={reviewTotalPages} onPageChange={setReviewPage} />
      </div>
    </div>
  );
}
