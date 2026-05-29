"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function AgentCardSkeleton() {
  return (
    <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.06] overflow-hidden bg-white dark:bg-[#1a1a1a]">
      <Skeleton className="aspect-[1595/700] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}
