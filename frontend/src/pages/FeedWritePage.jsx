import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createFeed, updateFeed, getFeed } from '../api/feed';
import ImageUploader from '../components/common/ImageUploader';

const TITLE_MAX = 100;
const CONTENT_MAX = 2000;

export default function FeedWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (editId) {
      getFeed(editId).then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
      });
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const data = { title, content, images };
      if (editId) {
        await updateFeed(editId, data);
        navigate(`/feeds/${editId}`);
      } else {
        const res = await createFeed(data);
        navigate(`/feeds/${res.data.id}`);
      }
    } catch {
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const titleProgress = (title.length / TITLE_MAX) * 100;
  const contentProgress = (content.length / CONTENT_MAX) * 100;
  const isValid = title.trim().length > 0 && content.trim().length > 0;

  /* Completion steps indicator */
  const steps = [
    { label: '제목', done: title.trim().length > 0, active: focusedField === 'title' },
    { label: '내용', done: content.trim().length > 0, active: focusedField === 'content' },
    { label: '사진', done: images.length > 0, active: focusedField === 'images', optional: true },
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 pb-8">
      {/* Header with step indicator */}
      <div className="mb-6 animate-slide-up">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-pet-brown/60 hover:text-pet-brown mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          돌아가기
        </button>

        <h1 className="text-2xl font-bold text-pet-dark-brown font-heading">
          {editId ? '피드 수정' : '새 피드 작성'}
        </h1>
        <p className="text-sm text-pet-brown/50 mt-1">반려동물과의 소중한 일상을 공유해보세요</p>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-2 mt-5">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              {i > 0 && <div className={`w-8 h-0.5 rounded-full transition-colors duration-300 ${step.done || steps[i-1].done ? 'bg-pet-orange/40' : 'bg-pet-gray'}`} />}
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step.done
                    ? 'bg-pet-orange text-white scale-100'
                    : step.active
                      ? 'bg-pet-orange/20 text-pet-orange ring-2 ring-pet-orange/30 scale-110'
                      : 'bg-pet-gray text-pet-brown/40'
                }`}>
                  {step.done ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (i + 1)}
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  step.done ? 'text-pet-orange' : step.active ? 'text-pet-dark-brown' : 'text-pet-brown/40'
                }`}>
                  {step.label}
                  {step.optional && <span className="text-pet-brown/30 ml-0.5">(선택)</span>}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Input */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-slide-up transition-shadow hover:shadow-md"
             style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-pet-dark-brown flex items-center gap-1.5">
              <svg className="w-4 h-4 text-pet-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              제목
            </label>
            <span className={`text-xs font-medium transition-colors ${
              title.length > TITLE_MAX * 0.9 ? 'text-red-500' : 'text-pet-brown/40'
            }`}>
              {title.length}/{TITLE_MAX}
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => e.target.value.length <= TITLE_MAX && setTitle(e.target.value)}
            onFocus={() => setFocusedField('title')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 rounded-xl border border-pet-gray/60 bg-pet-cream/30 focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/10 focus:bg-white transition-all text-pet-dark-brown font-medium placeholder:text-pet-brown/30"
            placeholder="어떤 이야기를 들려줄까요?"
          />
          {/* Progress bar */}
          <div className="h-0.5 bg-pet-gray/30 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                titleProgress > 90 ? 'bg-red-400' : titleProgress > 70 ? 'bg-pet-yellow' : 'bg-pet-orange'
              }`}
              style={{ width: `${Math.min(titleProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Content Textarea */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-slide-up transition-shadow hover:shadow-md"
             style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-pet-dark-brown flex items-center gap-1.5">
              <svg className="w-4 h-4 text-pet-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              내용
            </label>
            <span className={`text-xs font-medium transition-colors ${
              content.length > CONTENT_MAX * 0.9 ? 'text-red-500' : 'text-pet-brown/40'
            }`}>
              {content.length}/{CONTENT_MAX}
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => e.target.value.length <= CONTENT_MAX && setContent(e.target.value)}
            onFocus={() => setFocusedField('content')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 rounded-xl border border-pet-gray/60 bg-pet-cream/30 focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/10 focus:bg-white transition-all resize-none h-52 text-[15px] leading-relaxed text-pet-brown placeholder:text-pet-brown/30"
            placeholder="반려동물과의 일상, 꿀팁, 재미있는 에피소드 등을 자유롭게 적어주세요..."
          />
          <div className="h-0.5 bg-pet-gray/30 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                contentProgress > 90 ? 'bg-red-400' : contentProgress > 70 ? 'bg-pet-yellow' : 'bg-pet-orange'
              }`}
              style={{ width: `${Math.min(contentProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div
          className="bg-white rounded-2xl p-5 shadow-sm animate-slide-up transition-shadow hover:shadow-md"
          style={{ animationDelay: '150ms' }}
          onFocus={() => setFocusedField('images')}
          onBlur={() => setFocusedField(null)}
        >
          <label className="text-sm font-semibold text-pet-dark-brown flex items-center gap-1.5 mb-3">
            <svg className="w-4 h-4 text-pet-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            사진
            <span className="text-pet-brown/30 font-normal text-xs ml-1">(선택)</span>
            {images.length > 0 && (
              <span className="ml-auto text-xs font-medium text-pet-orange bg-pet-orange/10 px-2 py-0.5 rounded-full">
                {images.length}장
              </span>
            )}
          </label>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Submit Actions */}
        <div className="flex gap-3 pt-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <button
            type="submit"
            disabled={loading || !isValid}
            className="flex-1 py-3.5 bg-gradient-to-r from-pet-orange to-pet-pink text-white rounded-xl font-semibold shadow-md shadow-pet-orange/20 hover:shadow-lg hover:shadow-pet-orange/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 transition-all text-[15px] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {editId ? '수정 완료' : '작성 완료'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3.5 bg-pet-gray text-pet-brown rounded-xl font-medium hover:bg-pet-peach transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
