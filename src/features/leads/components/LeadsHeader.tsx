"use client";

import { cn } from "@/lib/utils";
import type { LeadsState } from "@/features/leads/hooks/useLeads";

type Props = Pick<LeadsState, "group" | "search" | "setSearch" | "selectedDate" | "dateOpen" | "setDateOpen" | "allDates" | "selectDate" | "dropRef">;

export function LeadsHeader({ group, search, setSearch, selectedDate, dateOpen, setDateOpen, allDates, selectDate, dropRef }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08] dark:border-white/[0.06] flex-shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-[#111] dark:text-white">New Leads</h1>
        <p className="text-sm text-[#6d6c6b]">{group.leads.length} leads detected</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858481]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads…"
            className="pl-9 pr-3 h-[40px] text-sm rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-[#f4f3ef] dark:bg-[#242424] text-[#34322d] dark:text-[#dadada] placeholder:text-[#858481] outline-none focus:border-blue-400 w-48"
          />
        </div>

        <div ref={dropRef} className="relative">
          <button
            onClick={() => setDateOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1a1a] text-[#34322d] dark:text-[#adadad] hover:border-black/[0.12] transition-colors"
          >
            <svg className="w-4 h-4 text-[#858481]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="3" width="12" height="11" rx="1.5" /><path d="M5 1v2M11 1v2M2 7h12" />
            </svg>
            {selectedDate}
            <svg className="w-3 h-3 text-[#858481]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m3 4.5 3 3 3-3" />
            </svg>
          </button>
          {dateOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#1a1a1a] border border-black/[0.08] dark:border-white/[0.08] rounded-xl shadow-lg z-30 py-1 overflow-hidden">
              {allDates.map((d) => (
                <button
                  key={d}
                  onClick={() => selectDate(d)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm transition-colors",
                    d === selectedDate
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-[#34322d] dark:text-[#adadad] hover:bg-[#f4f3ef] dark:hover:bg-[#242424]"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
