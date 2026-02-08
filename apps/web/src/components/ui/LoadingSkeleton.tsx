'use client';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-28 bg-gray-200 rounded" />
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-48 bg-gray-200 rounded mb-6" />
      <div className="h-[280px] bg-gray-100 rounded-lg" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
      <div className="p-6 pb-4">
        <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
      <div className="px-6">
        <div className="h-8 bg-gray-100 rounded mb-2" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-50 rounded mb-1" />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}
