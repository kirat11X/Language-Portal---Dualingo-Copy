interface LoadingSkeletonProps {
  rows?: number;
  type?: 'cards' | 'table' | 'detail';
}

export default function LoadingSkeleton({ rows = 5, type = 'table' }: LoadingSkeletonProps) {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-6">
            <div className="skeleton w-11 h-11 rounded-2xl mb-4" />
            <div className="skeleton w-20 h-3 mb-2" />
            <div className="skeleton w-16 h-8" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="space-y-6">
        <div className="skeleton w-48 h-8" />
        <div className="skeleton w-72 h-4" />
        <div className="card p-8">
          <div className="skeleton w-64 h-20 mx-auto mb-4" />
          <div className="skeleton w-32 h-6 mx-auto mb-2" />
          <div className="skeleton w-48 h-4 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="skeleton w-full h-10 rounded-t-xl" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton w-full h-14" />
      ))}
    </div>
  );
}
