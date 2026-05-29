"use client";

import { cn } from "@/lib/utils";
import { BADGE_STYLES } from "@/features/groups-to-sheets/constants";
import type { SheetRow } from "@/features/groups-to-sheets/types";

export function ColValue({ col, row }: { col: keyof SheetRow; row: SheetRow }) {
  if (col === "group") {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
          style={{ backgroundColor: row.groupColor }}
        >
          {row.groupAvatar}
        </div>
        <span className="whitespace-nowrap font-medium text-[#34322d] dark:text-[#dadada]">{row.group}</span>
      </div>
    );
  }
  if (col === "category") {
    return (
      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", BADGE_STYLES[row.category])}>
        {row.category}
      </span>
    );
  }
  const val = row[col] as string;
  if (col === "message") return <span className="text-[#6d6c6b] dark:text-[#7f7f7f] truncate max-w-xs block">{val}</span>;
  return <span className="text-[#6d6c6b] dark:text-[#7f7f7f] whitespace-nowrap">{val}</span>;
}
