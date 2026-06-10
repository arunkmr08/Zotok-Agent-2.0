import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import { HISTORY_OPTIONS } from "@/features/auth/constants";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState,
  "selectedHistory" | "setSelectedHistory" |
  "historyFrom" | "setHistoryFrom" | "historyTo" | "setHistoryTo" |
  "selectedGroups" | "setSyncText" | "setStep"
>;

export function WaHistoryStep({ selectedHistory, setSelectedHistory, historyFrom, setHistoryFrom, historyTo, setHistoryTo, selectedGroups, setSyncText, setStep }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-[22px] font-semibold text-[#111] dark:text-white"
        >
          Fetch WhatsApp Chat History
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-sm text-[#6d6c6b] mb-4"
        >
          Import past messages so Zotok can start with context.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        >
          <p className="text-sm font-semibold text-[#34322d] dark:text-[#dadada] tracking-[-0.09px] leading-5">How far back should we fetch?</p>
          <p className="text-[12px] text-[#858481] tracking-[-0.09px] leading-4 mt-0.5 mb-3">Messages older than 90 days may not be available depending on your WhatsApp backup settings.</p>
          <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.06] dark:border-white/[0.06] rounded-lg overflow-hidden py-2 mb-4">
            {HISTORY_OPTIONS.map((opt, idx) => (
              <div
                key={opt.days}
                className={cn(
                  "flex items-center gap-[10px] px-3 py-3 cursor-pointer transition-colors",
                  idx < HISTORY_OPTIONS.length - 1 ? "border-b border-black/[0.06] dark:border-white/[0.06]" : "",
                  selectedHistory === opt.days ? "bg-[#37352f0a] dark:bg-white/[0.04]" : "hover:bg-[#37352f0a] dark:hover:bg-white/[0.04]"
                )}
                onClick={() => setSelectedHistory(opt.days as number | "custom")}
              >
                <span className="flex-1 text-sm font-medium text-[#34322d] dark:text-[#dadada] tracking-[-0.09px] leading-[18px]">{opt.label}</span>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 transition-colors flex-shrink-0 flex items-center justify-center",
                  selectedHistory === opt.days ? "border-[#0067ff] bg-[#0067ff]" : "border-black/[0.12] dark:border-white/[0.2]"
                )}>
                  {selectedHistory === opt.days && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 5.5l2 2 4-4" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
          {selectedHistory === "custom" && (
            <div className="flex gap-4 mb-4">
              <FormField label="From" className="flex-1"><Input type="date" value={historyFrom} onChange={(e) => setHistoryFrom(e.target.value)} /></FormField>
              <FormField label="To" className="flex-1"><Input type="date" value={historyTo} onChange={(e) => setHistoryTo(e.target.value)} /></FormField>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.16 }}
        className="pt-1"
      >
        <PrimaryBtn onClick={() => {
          setSyncText(`We are syncing messages from last ${selectedHistory === "custom" ? "custom range" : `${selectedHistory} Days`} from ${selectedGroups.length || 0} groups. You can continue exploring the app while your messages sync in the background.`);
          setStep("wa-groups");
        }}>
          Fetch History
        </PrimaryBtn>
      </motion.div>
    </div>
  );
}
