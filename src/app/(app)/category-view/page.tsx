"use client";

import { cn } from "@/lib/utils";
import { useCategoryView } from "@/features/category/hooks/useCategoryView";
import { CategorySidebar } from "@/features/category/components/CategorySidebar";
import { CategoryTable } from "@/features/category/components/CategoryTable";
import { ChatFlyout } from "@/features/category/components/ChatFlyout";

export default function CategoryViewPage() {
  const state = useCategoryView();

  return (
    <>
      <div className={cn("h-full flex overflow-hidden", state.flyoutMsg && "pr-[380px]")}>
        <CategorySidebar
          categories={state.categories}
          activeCategory={state.activeCategory}
          handleSelectCategory={state.handleSelectCategory}
        />
        <CategoryTable
          cat={state.cat}
          msgs={state.msgs}
          setFlyoutMsg={state.setFlyoutMsg}
        />
      </div>

      {state.flyoutMsg && (
        <ChatFlyout msg={state.flyoutMsg} onClose={() => state.setFlyoutMsg(null)} />
      )}
    </>
  );
}
