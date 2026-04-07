import { useEffect } from 'react';

/**
 * SEOHead - React SPA용 동적 메타태그 관리 컴포넌트
 *
 * react-helmet-async 없이 순수 DOM 조작으로 메타태그를 업데이트합니다.
 * 각 페이지에서 이 컴포넌트를 사용하여 페이지별 고유한 메타 정보를 설정하세요.
 *
 * 사용 예시:
 * <SEOHead
 *   title="피드 목록"
 *   description="반려동물과 함께한 순간을 공유하세요."
 *   path="/feeds"
 * />
 */

const SITE_NAME = '위드펫';
const SITE_URL = 'https://withpet.shop';
const DEFAULT_TITLE = '위드펫 - 반려동물 동반 가능 장소 찾기 | 펫프렌들리 카페, 식당, 공원';
const DEFAULT_DESCRIPTION =
  '반려동물과 함께 갈 수 있는 카페, 식당, 공원, 숙소를 지도에서 쉽게 찾아보세요. 전국 펫프렌들리 장소 정보와 반려인 커뮤니티 피드를 제공합니다.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`;
const THEME_COLOR = '#863bff';

function setMetaTag(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export default function SEOHead({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const fullDescription = description || DEFAULT_DESCRIPTION;
  const fullUrl = `${SITE_URL}${path}`;
  const fullImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    // Page title
    document.title = fullTitle;

    // Basic meta
    setMetaTag('name', 'description', fullDescription);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Canonical
    setCanonical(fullUrl);

    // Open Graph
    setMetaTag('property', 'og:title', title || '위드펫 - 반려동물 동반 가능 장소 찾기');
    setMetaTag('property', 'og:description', fullDescription);
    setMetaTag('property', 'og:url', fullUrl);
    setMetaTag('property', 'og:image', fullImage);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'ko_KR');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title || '위드펫 - 반려동물 동반 가능 장소 찾기');
    setMetaTag('name', 'twitter:description', fullDescription);
    setMetaTag('name', 'twitter:image', fullImage);
    setMetaTag('name', 'twitter:url', fullUrl);

    // Dynamic JSON-LD
    if (jsonLd) {
      // Remove old dynamic JSON-LD scripts
      document.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());

      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      const scripts = items.map((ld) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-seo-jsonld', 'true');
        script.textContent = JSON.stringify(ld);
        document.head.appendChild(script);
        return script;
      });

      return () => {
        scripts.forEach((s) => s.remove());
      };
    }
  }, [fullTitle, fullDescription, fullUrl, fullImage, type, noindex, jsonLd, title]);

  return null;
}
