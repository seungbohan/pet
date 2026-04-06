import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createFeed, updateFeed, getFeed } from '../api/feed';
import ImageUploader from '../components/common/ImageUploader';

export default function FeedWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-pet-dark-brown mb-6">
        {editId ? '&#x270F;&#xFE0F; 피드 수정' : '&#x270F;&#xFE0F; 새 피드 작성'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-pet-brown mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/50 focus:outline-none focus:border-pet-orange transition-colors"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pet-brown mb-1">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/50 focus:outline-none focus:border-pet-orange transition-colors resize-none h-48"
            placeholder="반려동물과의 일상을 공유해보세요..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pet-brown mb-2">사진</label>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-pet-orange text-white rounded-xl font-semibold hover:bg-pet-orange/90 transition-colors disabled:opacity-50"
          >
            {loading ? '저장 중...' : editId ? '수정하기' : '작성하기'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-pet-gray text-pet-brown rounded-xl font-medium hover:bg-pet-peach transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
