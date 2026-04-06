export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl animate-bounce">🐾</div>
        <p className="text-pet-brown text-sm font-medium">로딩 중...</p>
      </div>
    </div>
  );
}
