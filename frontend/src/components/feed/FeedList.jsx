import FeedCard from './FeedCard';

export default function FeedList({ feeds }) {
  if (!feeds || feeds.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">&#x1F43E;</div>
        <p className="text-pet-brown/60">아직 피드가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {feeds.map((feed) => (
        <FeedCard key={feed.id} feed={feed} />
      ))}
    </div>
  );
}
