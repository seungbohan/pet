import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="장소명 또는 주소로 검색..."
        className="w-full px-4 py-3 pr-12 rounded-xl border border-pet-gray bg-white focus:outline-none focus:border-pet-orange transition-colors text-sm"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-pet-brown hover:text-pet-orange"
      >
        🔍
      </button>
    </form>
  );
}
