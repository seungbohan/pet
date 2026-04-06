import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4">
      <SEOHead
        title="페이지를 찾을 수 없습니다 (404)"
        description="요청하신 페이지를 찾을 수 없습니다. 위드펫 홈으로 돌아가 반려동물 동반 장소를 검색해 보세요."
        noindex={true}
      />
      <div className="text-6xl mb-4">🐾</div>
      <h1 className="text-3xl font-bold text-pet-dark-brown mb-2">404</h1>
      <p className="text-pet-brown mb-6">페이지를 찾을 수 없습니다</p>
      <Link
        to="/"
        className="px-6 py-2.5 bg-pet-orange text-white rounded-xl font-medium hover:bg-pet-orange/90 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
