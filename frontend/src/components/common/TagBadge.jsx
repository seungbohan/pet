export default function TagBadge({ name, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
        selected
          ? 'bg-pet-mint text-pet-dark-brown'
          : 'bg-pet-gray text-pet-brown hover:bg-pet-peach'
      }`}
    >
      {name}
    </button>
  );
}
