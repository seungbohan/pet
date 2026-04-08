import { useState, useEffect } from 'react';
import { getPlace, votePlace } from '../api/places';
import { getPlaceReviews, createPlaceReview, deleteReview } from '../api/reviews';
import { toggleFavorite } from '../api/favorites';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';

/**
 * usePlaceDetail - Place detail state and handlers
 *
 * Manages: place detail data, reviews (paginated), favorites, votes,
 * image carousel index, and review form state.
 *
 * @param {number|string|null} selectedId - Currently selected place ID
 * @returns detail state + handlers
 */
export default function usePlaceDetail(selectedId) {
  const { isAuthenticated } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);

  /* Detail data */
  const [placeDetail, setPlaceDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  /* Reviews */
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);
  const [reviewDeleteTarget, setReviewDeleteTarget] = useState(null);

  /* Favorites */
  const [favorited, setFavorited] = useState(false);

  /* Image carousel */
  const [currentImg, setCurrentImg] = useState(0);

  /* Review form */
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [guestName, setGuestName] = useState('');

  /* Votes */
  const [voteData, setVoteData] = useState({ upvotes: 0, downvotes: 0, userVote: null });
  const [voteLoading, setVoteLoading] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Fetch detail when selectedId changes                             */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (!selectedId) {
      setPlaceDetail(null);
      setDetailOpen(false);
      setReviews([]);
      setReviewPage(0);
      setVoteData({ upvotes: 0, downvotes: 0, userVote: null });
      return;
    }
    setDetailLoading(true);
    setDetailOpen(true);
    setCurrentImg(0);
    getPlace(selectedId)
      .then((res) => {
        setPlaceDetail(res.data);
        setFavorited(res.data.favorited || false);
        setVoteData({
          upvotes: res.data.upvotes || 0,
          downvotes: res.data.downvotes || 0,
          userVote: res.data.userVote ?? null,
        });
      })
      .catch(() => setPlaceDetail(null))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  /* Fetch reviews for selected place */
  useEffect(() => {
    if (!selectedId) return;
    getPlaceReviews(selectedId, reviewPage)
      .then((res) => {
        setReviews(res.data.content || []);
        setReviewTotalPages(res.data.totalPages || 0);
      })
      .catch(() => {
        setReviews([]);
        setReviewTotalPages(0);
      });
  }, [selectedId, reviewPage]);

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */
  const handleCloseDetail = () => {
    setDetailOpen(false);
    setPlaceDetail(null);
  };

  const handleFavorite = async () => {
    if (!selectedId) return;
    try {
      const res = await toggleFavorite(selectedId);
      setFavorited(res.data.favorited);
    } catch {}
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim() || !selectedId) return;
    try {
      await createPlaceReview(selectedId, {
        content: newReview,
        rating: newRating,
        guestName: !isAuthenticated ? (guestName || '비회원') : undefined,
      });
      setNewReview('');
      setNewRating(5);
      setGuestName('');
      const res = await getPlaceReviews(selectedId, 0);
      setReviews(res.data.content || []);
      setReviewTotalPages(res.data.totalPages || 0);
      setReviewPage(0);
      // Refresh place detail for updated rating
      const placeRes = await getPlace(selectedId);
      setPlaceDetail(placeRes.data);
    } catch {
      addToast('리뷰 작성에 실패했습니다.', 'error');
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      const res = await getPlaceReviews(selectedId, 0);
      setReviews(res.data.content || []);
      setReviewTotalPages(res.data.totalPages || 0);
      setReviewPage(0);
      const placeRes = await getPlace(selectedId);
      setPlaceDetail(placeRes.data);
      addToast('리뷰가 삭제되었습니다.', 'success');
    } catch {
      addToast('삭제에 실패했습니다.', 'error');
    }
    setReviewDeleteTarget(null);
  };

  const handleVote = async (isUpvote) => {
    if (!isAuthenticated) {
      addToast('로그인이 필요합니다', 'warning');
      return;
    }
    if (!selectedId || voteLoading) return;

    setVoteLoading(true);
    try {
      const res = await votePlace(selectedId, isUpvote);
      setVoteData({
        upvotes: res.data.upvotes ?? voteData.upvotes,
        downvotes: res.data.downvotes ?? voteData.downvotes,
        userVote: res.data.userVote ?? null,
      });
    } catch {
      /* Optimistic fallback: toggle locally */
      setVoteData((prev) => {
        const wasUp = prev.userVote === 'up';
        const wasDown = prev.userVote === 'down';

        if (isUpvote) {
          if (wasUp) return { ...prev, upvotes: prev.upvotes - 1, userVote: null };
          return {
            upvotes: prev.upvotes + 1,
            downvotes: wasDown ? prev.downvotes - 1 : prev.downvotes,
            userVote: 'up',
          };
        } else {
          if (wasDown) return { ...prev, downvotes: prev.downvotes - 1, userVote: null };
          return {
            upvotes: wasUp ? prev.upvotes - 1 : prev.upvotes,
            downvotes: prev.downvotes + 1,
            userVote: 'down',
          };
        }
      });
    } finally {
      setVoteLoading(false);
    }
  };

  return {
    /* State */
    placeDetail,
    detailLoading,
    detailOpen,
    setDetailOpen,
    reviews,
    reviewPage,
    setReviewPage,
    reviewTotalPages,
    reviewDeleteTarget,
    setReviewDeleteTarget,
    favorited,
    currentImg,
    setCurrentImg,
    newReview,
    setNewReview,
    newRating,
    setNewRating,
    guestName,
    setGuestName,
    voteData,
    voteLoading,
    /* Handlers */
    handleCloseDetail,
    handleFavorite,
    handleReviewSubmit,
    handleReviewDelete,
    handleVote,
  };
}
