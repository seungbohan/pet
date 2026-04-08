import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPlace } from '../api/places';
import { getPlaceReviews, createPlaceReview, deleteReview } from '../api/reviews';
import { toggleFavorite } from '../api/favorites';
import { uploadImages, getImageUrl } from '../api/upload';
import client from '../api/client';
import StarRating from '../components/common/StarRating';
import Pagination from '../components/common/Pagination';
import { DetailSkeleton } from '../components/common/Skeleton';
import ConfirmModal from '../components/common/ConfirmModal';
import SEOHead from '../components/common/SEOHead';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import ImageGallery from '../components/reviews/ImageGallery';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';

export default function PlaceDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [reviewDeleteTarget, setReviewDeleteTarget] = useState(null);
  const addToast = useToastStore((s) => s.addToast);

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
    try {
      await deleteReview(reviewId);
      const res = await getPlaceReviews(id, 0);
      setReviews(res.data.content || []);
      setReviewTotalPages(res.data.totalPages || 0);
      setReviewPage(0);
      const placeRes = await getPlace(id);
      setPlace(placeRes.data);
      addToast('리뷰가 삭제되었습니다.', 'success');
    } catch {
      addToast('삭제에 실패했습니다.', 'error');
    }
    setReviewDeleteTarget(null);
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
    } catch {
      addToast('이미지 업로드에 실패했습니다.', 'error');
    } finally {
      setImgUploading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    try {
      await createPlaceReview(id, { content: newReview, rating: newRating });
      setNewReview('');
      setNewRating(5);
      const res = await getPlaceReviews(id, 0);
      setReviews(res.data.content || []);
      setReviewTotalPages(res.data.totalPages || 0);
      setReviewPage(0);
    } catch {
      addToast('리뷰 작성에 실패했습니다.', 'error');
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!place) return null;

  /* Build deduplicated image list */
  const allImages = [];
  if (place.firstimage) allImages.push(place.firstimage);
  if (place.imageUrls?.length > 0) {
    place.imageUrls.forEach((url) => {
      if (!allImages.includes(url)) allImages.push(url);
    });
  }

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
      <div className="mb-6">
        <ImageGallery images={allImages} alt={place.title} variant="thumbnails" />
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

        <ReviewForm
          onSubmit={handleReviewSubmit}
          isAuthenticated={isAuthenticated}
          allowGuest={false}
          newReview={newReview}
          setNewReview={setNewReview}
          newRating={newRating}
          setNewRating={setNewRating}
          variant="full"
        />

        <ReviewList
          reviews={reviews}
          currentUserEmail={user?.email}
          onDelete={(reviewId) => setReviewDeleteTarget(reviewId)}
          variant="full"
        />

        <Pagination page={reviewPage} totalPages={reviewTotalPages} onPageChange={setReviewPage} />
      </div>

      {/* Review Delete Confirmation */}
      <ConfirmModal
        open={!!reviewDeleteTarget}
        title="리뷰 삭제"
        message="리뷰를 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={() => handleReviewDelete(reviewDeleteTarget)}
        onCancel={() => setReviewDeleteTarget(null)}
      />
    </div>
  );
}
