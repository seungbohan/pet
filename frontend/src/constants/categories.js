/* ------------------------------------------------------------------ */
/*  Category constants                                                 */
/*  Shared across MapPage, CategoryFilter, PlaceCard, etc.             */
/* ------------------------------------------------------------------ */

/** Category filter pills (includes "all" option with empty key) */
export const categories = [
  { key: '', label: '전체', icon: '📍' },
  { key: 'CAFE', label: '카페', icon: '☕' },
  { key: 'RESTAURANT', label: '식당', icon: '🍽️' },
  { key: 'ACCOMMODATION', label: '숙소', icon: '🏨' },
  { key: 'PARK', label: '공원', icon: '🌿' },
  { key: 'HOSPITAL', label: '동물병원', icon: '🏥' },
  { key: 'TOURIST', label: '관광', icon: '🏖️' },
  { key: 'LEISURE', label: '레저', icon: '🎯' },
  { key: 'CULTURE', label: '문화', icon: '🎭' },
  { key: 'SHOPPING', label: '쇼핑', icon: '🛍️' },
];

/** Tailwind color classes per category (for badges/tags) */
export const categoryColors = {
  CAFE: 'bg-amber-100 text-amber-800',
  RESTAURANT: 'bg-red-100 text-red-800',
  ACCOMMODATION: 'bg-blue-100 text-blue-800',
  PARK: 'bg-green-100 text-green-800',
  HOSPITAL: 'bg-pink-100 text-pink-800',
  TOURIST: 'bg-cyan-100 text-cyan-800',
  LEISURE: 'bg-purple-100 text-purple-800',
  CULTURE: 'bg-indigo-100 text-indigo-800',
  SHOPPING: 'bg-orange-100 text-orange-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

/** Icon + label string per category (for compact display) */
export const categoryLabels = {
  CAFE: '☕ 카페',
  RESTAURANT: '🍽️ 식당',
  ACCOMMODATION: '🏨 숙소',
  PARK: '🌿 공원',
  HOSPITAL: '🏥 동물병원',
  TOURIST: '🏖️ 관광',
  LEISURE: '🎯 레저',
  CULTURE: '🎭 문화',
  SHOPPING: '🛍️ 쇼핑',
  OTHER: '📍 기타',
};

/** Category options for the place submit form dropdown */
export const submitCategories = [
  { key: 'CAFE', label: '카페' },
  { key: 'RESTAURANT', label: '식당' },
  { key: 'ACCOMMODATION', label: '숙소' },
  { key: 'PARK', label: '공원' },
  { key: 'HOSPITAL', label: '동물병원' },
  { key: 'TOURIST', label: '관광' },
  { key: 'LEISURE', label: '레저' },
  { key: 'CULTURE', label: '문화' },
  { key: 'SHOPPING', label: '쇼핑' },
  { key: 'OTHER', label: '기타' },
];
