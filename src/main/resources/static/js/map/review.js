// 리뷰 관련 변수들
let reviews = [];
let currentReviewPage = 1;
let reviewsPerPage = 5;
let selectedRating = 0;
const token = localStorage.getItem('token');

// 별점 초기화 (Font Awesome 사용)
function initStarRating() {
    // 평점 입력용
    $('#ratingInput').starrr({
        rating: 0,
        max: 5,
        emptyClass: 'fa fa-star-o',
        fullClass: 'fa fa-star',
        change: function(e, value) {
            selectedRating = value;
        }
    });

    // 평균 별점 표시용 (읽기 전용)
    $('#averageStars').starrr({
        rating: 0,
        max: 5,
        emptyClass: 'fa fa-star-o',
        fullClass: 'fa fa-star',
        readOnly: true
    });
}

// 서버에서 리뷰 목록 가져오기
async function loadReviews() {
    if (!selectedPlace) {
        console.error('선택된 장소가 없습니다.');
        return;
    }

    try {
        const response = await fetch(`/api/review/petPlace/${selectedPlace.id}`);
        if (response.ok) {
            const data = await response.json();
            reviews = data.dtoList || [];
            currentReviewPage = 1;
            displayReviews();
            updateReviewSummary();
        } else {
            console.error('리뷰 로드 실패:', response.status);
            reviews = [];
            displayReviews();
            updateReviewSummary();
        }
    } catch (error) {
        console.error('리뷰 로드 에러:', error);
        reviews = [];
        displayReviews();
        updateReviewSummary();
    }
}

// 리뷰 제출
async function submitReview() {
    const content = $('#reviewContent').val().trim();
    if (!token) {
        if (confirm("로그인이 필요합니다, 로그인 하시겠습니까?")) {
            window.location.href = '/join/login';
        }
        return;
    }

    if (selectedRating === 0) {
        alert('평점을 선택해주세요.');
        return;
    }

    if (!content) {
        alert('리뷰 내용을 입력해주세요.');
        return;
    }

    const reviewData = {
        petPlaceId: selectedPlace.id,
        rating: selectedRating,
        content: content
    };

    try {
        const response = await fetch(`/api/review/petPlace/${selectedPlace.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(reviewData)
        });

        console.log('Response status:', response.status);
        console.log('전송할 데이터:', reviewData); // 이 줄을 추가해서 데이터 확인
        console.log('선택된 장소:', selectedPlace); // 장소 정보 확인
        if (response.ok) {
            // 폼 초기화
            $('#reviewContent').val('');
            selectedRating = 0;
            $('#ratingInput').starrr('setRating', 0);
            $('#contentCount').text('0');

            // 리뷰 목록 새로고침
            await loadReviews(selectedPlace.id);
            alert('리뷰가 등록되었습니다!');
        } else {
            alert('리뷰 등록에 실패했습니다.');
        }
    } catch (error) {
        console.error('리뷰 등록 에러:', error);
        alert('리뷰 등록 중 오류가 발생했습니다.');
    }
}

// 리뷰 수정
async function editReview(reviewId) {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;
    if (!token) {
        if (confirm("로그인이 필요합니다, 로그인 하시겠습니까?")) {
            window.location.href = '/join/login';
        }
        return;
    }

    const newContent = prompt('새로운 리뷰 내용:', review.content);
    if (!newContent || !newContent.trim()) return;

    const updateData = {
        content: newContent.trim(),
        rating: review.rating
    };

    try {
        const response = await fetch(`/api/review/petPlace/${selectedPlace.id}/${reviewId}`, {
            method: 'PUT',
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            await loadReviews(selectedPlace.id);
            alert('리뷰가 수정되었습니다.');
        } else {
            alert('리뷰 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('리뷰 수정 에러:', error);
        alert('리뷰 수정 중 오류가 발생했습니다.');
    }
}

// 리뷰 삭제
async function deleteReview(reviewId) {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;
    if (!token) {
        if (confirm("로그인이 필요합니다, 로그인 하시겠습니까?")) {
            window.location.href = '/join/login';
        }
        return;
    }

    try {
        const response = await fetch(`/api/review/petPlace/${selectedPlace.id}/${reviewId}`, {
            method: 'DELETE',
            headers: {
                Authorization: "Bearer " + token,
            }
        });

        if (response.ok) {
            await loadReviews(selectedPlace.id);
            alert('리뷰가 삭제되었습니다.');
        } else {
            alert('리뷰 삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('리뷰 삭제 에러:', error);
        alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
}

// 리뷰 목록 표시
function displayReviews() {
    const reviewList = $('#reviewList');
    const startIndex = (currentReviewPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const pageReviews = reviews.slice(startIndex, endIndex);

    reviewList.empty();

    if (pageReviews.length === 0) {
        reviewList.html('<div style="text-align: center; color: #6c757d; padding: 20px;">등록된 리뷰가 없습니다.</div>');
        $('#reviewPagination').hide();
        return;
    }

    pageReviews.forEach(review => {
        const reviewHtml = `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.writer || '익명'}</span>
                    <span class="review-date">${review.createdAt || review.date}</span>
                </div>
                <div class="review-rating">
                    <div class="starrr-readonly" data-rating="${review.rating}"></div>
                </div>
                <div class="review-content">${review.content}</div>
                <div class="review-actions">
                    <button class="review-action-btn" onclick="editReview(${review.id})">수정</button>
                    <button class="review-action-btn danger" onclick="deleteReview(${review.id})">삭제</button>
                </div>
            </div>
        `;
        reviewList.append(reviewHtml);
    });

    // 각 리뷰의 별점 초기화 (읽기 전용)
    reviewList.find('.starrr-readonly').each(function() {
        const rating = $(this).data('rating');
        $(this).starrr({
            rating: rating,
            max: 5,
            emptyClass: 'fa fa-star-o',
            fullClass: 'fa fa-star',
            readOnly: true
        });
    });

    updateReviewPagination();
}

// 리뷰 요약 정보 업데이트
function updateReviewSummary() {
    const reviewCount = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : '0.0';

    $('#reviewCount').text(reviewCount);
    $('#reviewAverage').text(averageRating);
    $('#reviewCountText').text(`리뷰 ${reviewCount}개`);

    // 평균 별점 업데이트
    $('#averageStars').starrr('setRating', Math.round(parseFloat(averageRating)));
}

// 페이지네이션 업데이트
function updateReviewPagination() {
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const pagination = $('#reviewPagination');

    pagination.empty();

    if (totalPages <= 1) {
        pagination.hide();
        return;
    }

    pagination.show();

    // 이전 버튼
    const prevBtn = $('<button class="pagination-btn">‹</button>');
    if (currentReviewPage === 1) {
        prevBtn.prop('disabled', true);
    } else {
        prevBtn.click(() => goToReviewPage(currentReviewPage - 1));
    }
    pagination.append(prevBtn);

    // 페이지 번호들
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = $(`<button class="pagination-btn">${i}</button>`);
        if (i === currentReviewPage) {
            pageBtn.addClass('active');
        } else {
            pageBtn.click(() => goToReviewPage(i));
        }
        pagination.append(pageBtn);
    }

    // 다음 버튼
    const nextBtn = $('<button class="pagination-btn">›</button>');
    if (currentReviewPage === totalPages) {
        nextBtn.prop('disabled', true);
    } else {
        nextBtn.click(() => goToReviewPage(currentReviewPage + 1));
    }
    pagination.append(nextBtn);
}

// 페이지 이동
function goToReviewPage(page) {
    currentReviewPage = page;
    displayReviews();
}

// 초기화
$(document).ready(function() {
    initStarRating();

    // 글자 수 카운터
    $('#reviewContent').on('input', function() {
        $('#contentCount').text($(this).val().length);
    });
});