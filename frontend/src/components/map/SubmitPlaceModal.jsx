import { useState } from 'react';
import { submitPlace, getSubmittedPlaces } from '../../api/places';
import { uploadImages, getImageUrl } from '../../api/upload';
import { submitCategories } from '../../constants/categories';
import useToastStore from '../../store/toastStore';

/**
 * SubmitPlaceModal - Self-contained place submission modal
 *
 * @param {boolean}  open             - Whether the modal is visible
 * @param {function} onClose          - Close handler
 * @param {object}   mapInstanceRef   - Ref to the Naver Map instance (for "use map center")
 * @param {object}   mapCenter        - Fallback { lat, lng } center
 * @param {function} onSubmitSuccess  - Called after successful submit (to refresh lists)
 */
export default function SubmitPlaceModal({ open, onClose, mapInstanceRef, mapCenter, onSubmitSuccess }) {
  const addToast = useToastStore((s) => s.addToast);

  const emptyForm = {
    title: '',
    addr1: '',
    tel: '',
    category: '',
    description: '',
    latitude: '',
    longitude: '',
    imageUrls: [],
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  const handleClose = () => {
    onClose();
    setSuccess(false);
    setForm(emptyForm);
  };

  const handleUseMapCenter = () => {
    const map = mapInstanceRef?.current;
    if (map) {
      const center = map.getCenter();
      setForm((f) => ({
        ...f,
        latitude: center.lat().toFixed(6),
        longitude: center.lng().toFixed(6),
      }));
    } else if (mapCenter) {
      setForm((f) => ({
        ...f,
        latitude: mapCenter.lat.toFixed(6),
        longitude: mapCenter.lng.toFixed(6),
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setImgUploading(true);
    try {
      const res = await uploadImages([file]);
      const uploaded = res.data?.[0];
      if (!uploaded) {
        addToast('이미지 업로드에 실패했습니다.', 'error');
        return;
      }
      setForm((f) => ({
        ...f,
        imageUrls: [...f.imageUrls, getImageUrl(uploaded.imageURL || uploaded.fileName)],
      }));
    } catch {
      addToast('이미지 업로드에 실패했습니다.', 'error');
    } finally {
      setImgUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.addr1.trim()) {
      addToast('장소명과 주소는 필수 입력입니다.', 'warning');
      return;
    }
    setLoading(true);
    try {
      await submitPlace({
        title: form.title,
        addr1: form.addr1,
        tel: form.tel || undefined,
        category: form.category || undefined,
        description: form.description || undefined,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        imageUrls: form.imageUrls?.length > 0 ? form.imageUrls : undefined,
      });
      setSuccess(true);
      setForm(emptyForm);
      onSubmitSuccess?.();
    } catch {
      addToast('장소 제보에 실패했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal panel */}
      <div
        className="fixed z-50 bg-white shadow-xl overflow-y-auto inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl md:inset-y-0 md:right-0 md:left-auto md:bottom-auto md:w-[420px] md:max-h-full md:rounded-t-none md:rounded-l-2xl"
        style={{ animation: 'slideIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-pet-gray/40 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-base font-bold text-pet-dark-brown flex items-center gap-2">
            <span className="text-lg">🐾</span> 장소 제보
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pet-gray transition-colors"
            aria-label="닫기"
          >
            <svg className="w-5 h-5 text-pet-brown/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {success ? (
            /* Success message */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-pet-dark-brown mb-2">제보 완료!</h3>
              <p className="text-sm text-pet-brown/60 leading-relaxed">
                제보해주셔서 감사합니다!<br />
                관리자 검토 후 등록됩니다.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 bg-pet-orange text-white rounded-xl text-sm font-bold hover:bg-pet-orange/90 transition-colors"
              >
                확인
              </button>
            </div>
          ) : (
            /* Submit form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 장소명 */}
              <div>
                <label className="block text-xs font-semibold text-pet-brown mb-1.5">
                  장소명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="예: 멍멍카페 서울점"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pet-gray/80 bg-white text-sm text-pet-dark-brown placeholder:text-pet-brown/30 focus:outline-none focus:border-pet-orange focus:ring-1 focus:ring-pet-orange/30 transition-all"
                  required
                />
              </div>

              {/* 주소 */}
              <div>
                <label className="block text-xs font-semibold text-pet-brown mb-1.5">
                  주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.addr1}
                  onChange={(e) => setForm((f) => ({ ...f, addr1: e.target.value }))}
                  placeholder="예: 서울특별시 강남구 역삼동 123-45"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pet-gray/80 bg-white text-sm text-pet-dark-brown placeholder:text-pet-brown/30 focus:outline-none focus:border-pet-orange focus:ring-1 focus:ring-pet-orange/30 transition-all"
                  required
                />
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-xs font-semibold text-pet-brown mb-1.5">전화번호</label>
                <input
                  type="tel"
                  value={form.tel}
                  onChange={(e) => setForm((f) => ({ ...f, tel: e.target.value }))}
                  placeholder="예: 02-1234-5678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pet-gray/80 bg-white text-sm text-pet-dark-brown placeholder:text-pet-brown/30 focus:outline-none focus:border-pet-orange focus:ring-1 focus:ring-pet-orange/30 transition-all"
                />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-xs font-semibold text-pet-brown mb-1.5">카테고리</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pet-gray/80 bg-white text-sm text-pet-dark-brown focus:outline-none focus:border-pet-orange focus:ring-1 focus:ring-pet-orange/30 transition-all"
                >
                  <option value="">카테고리 선택</option>
                  {submitCategories.map((cat) => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-xs font-semibold text-pet-brown mb-1.5">설명</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="장소에 대한 설명을 입력해주세요 (반려동물 관련 정보 등)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pet-gray/80 bg-white text-sm text-pet-dark-brown placeholder:text-pet-brown/30 focus:outline-none focus:border-pet-orange focus:ring-1 focus:ring-pet-orange/30 transition-all resize-none h-24"
                />
              </div>

              {/* 이미지 */}
              <div>
                <label className="block text-xs font-semibold text-pet-brown mb-1.5">이미지</label>
                {form.imageUrls.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {form.imageUrls.map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, idx) => idx !== i) }))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-pet-cream text-pet-brown rounded-xl text-xs font-semibold cursor-pointer hover:bg-pet-peach transition-colors">
                  {imgUploading ? '업로드 중...' : '📷 사진 추가'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={imgUploading}
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-pet-orange text-white rounded-xl text-sm font-bold hover:bg-pet-orange/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    제보 중...
                  </>
                ) : (
                  '장소 제보하기'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Inline keyframe animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0.5; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 768px) {
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0.5; }
            to { transform: translateX(0); opacity: 1; }
          }
        }
      `}</style>
    </>
  );
}
