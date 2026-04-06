export default function Footer() {
  return (
    <footer className="bg-pet-dark-brown text-white/70 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="text-pet-peach font-bold">WithPet</span>
          </div>
          <div className="text-sm text-center md:text-right">
            <p>반려동물과 함께하는 모든 순간</p>
            <p className="mt-1">&copy; 2025 WithPet. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
