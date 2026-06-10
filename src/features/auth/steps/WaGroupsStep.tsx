import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState,
  "selectedHistory" | "selectedGroups" | "groupSearch" | "setGroupSearch" |
  "filteredGroups" | "toggleGroup" | "setStep" | "router"
>;

export function WaGroupsStep({ selectedHistory, selectedGroups, groupSearch, setGroupSearch, filteredGroups, toggleGroup, setStep, router }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-[20px] font-semibold text-[#111] dark:text-white"
        >
          Choose Groups to Sync from Last {selectedHistory === "custom" ? "Custom Range" : `${selectedHistory} days`}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-[13px] text-[#6d6c6b] mb-4"
        >
          On the Free plan you can sync up to 10 groups. Locked groups unlock with Pro.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
        >
          <div className="flex items-center gap-2 h-[40px] bg-[#f4f3ef] dark:bg-[#242424] border border-black/[0.08] dark:border-white/[0.08] rounded-lg px-3 mb-3">
            <Image src="/assets/icons/icon-search.svg" alt="" width={16} height={16} />
            <input
              type="text" placeholder="Search Group" value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-[#34322d] dark:text-[#dadada]"
            />
          </div>
          <p className="text-[13px] font-semibold text-[#6d6c6b] mb-2">Selected {selectedGroups.length}/10 on free plan</p>
          <div className="flex flex-col gap-[6px] mb-2 max-h-52 overflow-y-auto">
            {filteredGroups.map((g) => (
              <div
                key={g.id}
                className={cn(
                  "flex items-center gap-3 px-[14px] py-[10px] rounded-xl border border-black/[0.08] dark:border-white/[0.08] cursor-pointer transition-colors",
                  selectedGroups.includes(g.id)
                    ? "bg-[#37352f0a] dark:bg-white/[0.04]"
                    : "bg-white dark:bg-[#1a1a1a] hover:bg-[#37352f0a] dark:hover:bg-white/[0.04]"
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
                  "w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0",
                  selectedGroups.includes(g.id) ? "border-[#0067ff] bg-[#0067ff]" : "border-black/[0.12] dark:border-white/[0.2]"
                )}>
                  {selectedGroups.includes(g.id) && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        className="pt-1 flex gap-3"
      >
        <button
          className="flex-1 py-[9px] px-4 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-[#34322d] dark:text-[#dadada] font-medium hover:bg-[#f4f3ef] dark:hover:bg-[#242424] transition-colors flex items-center justify-center gap-2"
          onClick={() => setStep("wa-history")}
        >
          <Image src="/assets/icons/icon-back.svg" alt="" width={16} height={16} className="dark:invert" unoptimized />
          Back
        </button>
        <button
          className="flex-1 py-[9px] px-4 rounded-lg bg-[#0067ff] hover:bg-[#0055d4] text-white font-medium transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
          disabled={selectedGroups.length === 0}
          onClick={() => setStep("wa-syncing")}
        >Sync Messages</button>
      </motion.div>
    </div>
  );
}
