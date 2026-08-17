import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="vs-panel rounded-xl2 p-8">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="mt-3 h-4 w-80" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="vs-panel rounded-xl2 p-6 lg:col-span-2">
          <Skeleton className="h-4 w-40" />
          <div className="mt-6 flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="mt-2 h-2.5 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="vs-panel rounded-xl2 p-6">
          <Skeleton className="h-4 w-32" />
          <div className="mt-6 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      <div className="vs-panel rounded-xl2 p-6">
        <Skeleton className="h-4 w-48" />
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl2 border border-white/5">
              <Skeleton className="h-28 w-full rounded-none" />
              <div className="p-4">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="mt-2 h-2.5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
