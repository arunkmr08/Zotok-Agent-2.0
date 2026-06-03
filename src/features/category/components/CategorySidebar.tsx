"use client";

import { cn } from "@/lib/utils";
import type { CategoryViewState } from "@/features/category/hooks/useCategoryView";

type Props = Pick<CategoryViewState, "categories" | "activeCategory" | "handleSelectCategory">;

export function CategorySidebar({ categories, activeCategory, handleSelectCategory }: Props) {
  return (
    <div className="w-56 flex-shrink-0 border-r border-black/[0.08] dark:border-white/[0.06] bg-white dark:bg-[#1a1a1a] overflow-y-auto">
      <div className="px-4 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
        <h2 className="text-xs font-semibold text-[#858481] uppercase tracking-wider">Categories</h2>
      </div>
      <nav className="px-2 py-2 space-y-0.5">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => handleSelectCategory(c.key)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeCategory === c.key
                ? "bg-[#ecebea] dark:bg-[#242424] text-[#111] dark:text-white"
                : "text-[#6d6c6b] dark:text-[#7f7f7f] hover:bg-[#f4f3ef] dark:hover:bg-[#242424]"
            )}
          >
            <span>{c.label}</span>
            <span className={cn("text-xs font-semibold px-1.5 py-0.5 rounded-md", c.bg, c.color)}>{c.count}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
