"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useCategoryView } from "@/features/category/hooks/useCategoryView";
import { CategorySidebar } from "@/features/category/components/CategorySidebar";
import { CategoryTable } from "@/features/category/components/CategoryTable";
import { ChatFlyout } from "@/features/category/components/ChatFlyout";

export default function CategoryViewPage() {
  const state = useCategoryView();

  return (
    <>
      <div className={cn("h-full flex overflow-hidden bg-[#f9f9f9] dark:bg-[#141414]", state.flyoutMsg && "pr-[380px]")}>
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-shrink-0"
        >
          <CategorySidebar
            categories={state.categories}
            activeCategory={state.activeCategory}
            handleSelectCategory={state.handleSelectCategory}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.07 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <CategoryTable
            cat={state.cat}
            msgs={state.msgs}
            setFlyoutMsg={state.setFlyoutMsg}
            page={state.page}
            perPage={state.perPage}
            totalPages={state.totalPages}
            totalMsgs={state.totalMsgs}
            setPage={state.setPage}
            setPerPage={state.setPerPage}
          />
        </motion.div>
      </div>

      {state.flyoutMsg && (
        <ChatFlyout msg={state.flyoutMsg} onClose={() => state.setFlyoutMsg(null)} />
      )}
    </>
  );
}
