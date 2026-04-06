export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(0, page - 4);
  const end = Math.min(totalPages, start + 10);

  for (let i = start; i < end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="px-3 py-1.5 rounded-lg text-sm bg-white text-pet-brown border border-pet-gray
          hover:bg-pet-peach disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        이전
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === page
              ? 'bg-pet-orange text-white'
              : 'bg-white text-pet-brown border border-pet-gray hover:bg-pet-peach'
          }`}
        >
          {p + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="px-3 py-1.5 rounded-lg text-sm bg-white text-pet-brown border border-pet-gray
          hover:bg-pet-peach disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        다음
      </button>
    </div>
  );
}
