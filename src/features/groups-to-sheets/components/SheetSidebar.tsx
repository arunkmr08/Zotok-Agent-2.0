"use client";

import { cn } from "@/lib/utils";
import type { GroupsToSheetsState } from "@/features/groups-to-sheets/hooks/useGroupsToSheets";

type Props = Pick<GroupsToSheetsState, "sheets" | "activeSheet" | "setActiveSheet">;

export function SheetSidebar({ sheets, activeSheet, setActiveSheet }: Props) {
  return (
    <div className="w-[260px] h-full flex-shrink-0 border-r border-black/[0.08] dark:border-white/[0.06] bg-white dark:bg-[#1a1a1a] overflow-y-auto">
      <div className="px-4 py-4">
        <h2 className="text-xs font-semibold text-[#858481]">Sheets</h2>
      </div>
      <nav className="px-2 py-2 space-y-0.5">
        {sheets.map((s, i) => (
          <div key={s.id}>
            <button
              onClick={() => setActiveSheet(s.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 h-[36px] rounded-lg text-sm font-medium transition-colors text-left",
                activeSheet === s.id
                  ? "bg-[#e7f1ff] dark:bg-[#0049b5] text-[#111] dark:text-white"
                  : "text-[#6d6c6b] dark:text-[#7f7f7f] hover:bg-[#f4f3ef] dark:hover:bg-[#242424]"
              )}
            >
              <span className="text-base">{s.icon}</span>
              <span className="truncate">{s.name}</span>
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
}
