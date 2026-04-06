const categories = [
  { key: '', label: '전체', icon: '📍' },
  { key: 'RESTAURANT', label: '식당', icon: '🍽️' },
  { key: 'CAFE', label: '카페', icon: '☕' },
  { key: 'ACCOMMODATION', label: '숙소', icon: '🏨' },
  { key: 'TOURIST', label: '관광', icon: '🏖️' },
  { key: 'LEISURE', label: '레저', icon: '🎯' },
  { key: 'SHOPPING', label: '쇼핑', icon: '🛍️' },
];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            selected === cat.key
              ? 'bg-pet-orange text-white'
              : 'bg-white text-pet-brown hover:bg-pet-peach'
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
