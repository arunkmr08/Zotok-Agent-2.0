"use client";

import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { LeadsState } from "@/features/leads/hooks/useLeads";

type Props = Pick<LeadsState, "selected" | "setSelected">;

export function BulkBar({ selected, setSelected }: Props) {
  return (
    <AnimatePresence initial={false}>
      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="overflow-hidden flex-shrink-0"
        >
          <div className="flex items-center justify-between px-6 py-2 bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{selected.size} selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-100">Add to Campaign</Button>
              <Button size="sm" variant="ghost" className="text-[#6d6c6b]" onClick={() => setSelected(new Set())}>Clear</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
