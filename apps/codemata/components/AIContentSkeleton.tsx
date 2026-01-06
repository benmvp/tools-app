/**
 * Loading skeleton for AI-generated content sections
 * Provides visual feedback while content is being fetched/generated
 */
export function AIContentSkeleton() {
  return (
    <div className="mt-12 space-y-8 animate-pulse">
      {/* Tip skeleton */}
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20 p-4">
        <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-3/4"></div>
      </div>

      {/* Content section skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
        </div>
      </div>

      {/* Another tip skeleton */}
      <div className="rounded-lg border border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20 p-4">
        <div className="h-4 bg-purple-200 dark:bg-purple-800 rounded w-2/3"></div>
      </div>

      {/* Content section skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-11/12"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>

      {/* Content section skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-10/12"></div>
        </div>
      </div>
    </div>
  );
}
