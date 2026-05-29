"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState,
  "selectedHistory" | "selectedGroups" | "groupSearch" | "setGroupSearch" |
  "filteredGroups" | "toggleGroup" | "setStep" | "router"
>;

export function WaGroupsStep({ selectedHistory, selectedGroups, groupSearch, setGroupSearch, filteredGroups, toggleGroup, setStep, router }: Props) {
  return (
    <div key="wa-groups" style={{ animation: "fadeStep 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <h2 className="text-[20px] font-semibold text-[#111] dark:text-white mb-1">
        Choose Groups to Sync from Last {selectedHistory === "custom" ? "Custom Range" : `${selectedHistory} days`}
      </h2>
      <p className="text-[13px] text-[#6d6c6b] mb-4">On the Free plan you can sync up to 10 groups. Locked groups unlock with Pro.</p>
      <div className="flex items-center gap-2 bg-[#f4f3ef] dark:bg-[#242424] border border-black/[0.08] dark:border-white/[0.08] rounded-lg px-3 py-2 mb-3">
        <Image src="/assets/icons/icon-search.svg" alt="" width={16} height={16} />
        <input
          type="text" placeholder="Search Group" value={groupSearch}
          onChange={(e) => setGroupSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-[#34322d] dark:text-[#dadada]"
        />
      </div>
      <p className="text-[13px] font-semibold text-[#6d6c6b] mb-2">Selected {selectedGroups.length}/10 on free plan</p>
      <div className="flex flex-col gap-[6px] mb-5 max-h-60 overflow-y-auto">
        {filteredGroups.map((g) => (
          <div
            key={g.id}
            className={cn(
              "flex items-center gap-3 px-[14px] py-[10px] rounded-xl border cursor-pointer transition-colors bg-white dark:bg-[#1a1a1a]",
              selectedGroups.includes(g.id)
                ? "border-[#111] dark:border-white bg-[#f4f3ef] dark:bg-[#242424]"
                : "border-black/[0.08] dark:border-white/[0.08] hover:border-[#6d6c6b]"
            )}
            onClick={() => toggleGroup(g.id)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {g.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada] truncate">{g.name}</p>
              <p className="text-[12px] text-[#6d6c6b]">{g.members} members</p>
            </div>
            <div className={cn(
              "w-4 h-4 rounded border-2 transition-colors flex-shrink-0",
              selectedGroups.includes(g.id) ? "border-[#111] dark:border-white bg-[#111] dark:bg-white" : "border-black/[0.12] dark:border-white/[0.2]"
            )} />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          className="flex-1 py-[9px] px-4 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-[#34322d] dark:text-[#dadada] font-medium hover:bg-[#f4f3ef] dark:hover:bg-[#242424] transition-colors"
          onClick={() => router.push("/chat")}
        >Maybe Later</button>
        <button
          className="flex-1 py-[9px] px-4 rounded-lg bg-[#0067ff] hover:bg-[#0055d4] text-white font-medium transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
          disabled={selectedGroups.length === 0}
          onClick={() => setStep("wa-syncing")}
        >Sync Messages</button>
      </div>
    </div>
  );
}
