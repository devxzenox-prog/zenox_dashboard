export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-accent-primary/20 rounded ${className}`} />
);

export const CardSkeleton = () => (
  <div className="glass-card p-6">
    <Skeleton className="h-4 w-24 mb-4" />
    <Skeleton className="h-8 w-32" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="glass-card overflow-hidden">
    <div className="p-4 border-b border-accent-primary/20">
      <Skeleton className="h-6 w-48" />
    </div>
    <div className="divide-y divide-accent-primary/10">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-20 ml-auto" />
        </div>
      ))}
    </div>
  </div>
);
