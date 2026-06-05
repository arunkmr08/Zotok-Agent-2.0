import { motion } from "motion/react";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState, "syncText" | "selectedHistory" | "selectedGroups" | "router">;

export function WaSyncingStep({ syncText, selectedHistory, selectedGroups, router }: Props) {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-full animate-spin mb-1"
          style={{ width: 44, height: 44, border: "3px solid rgba(0,103,255,0.15)", borderTopColor: "#0067ff" }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-[22px] font-semibold text-[#111] dark:text-white mt-1"
        >
          Syncing Messages ...
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
          className="text-sm text-[#6d6c6b] max-w-xs"
        >
          {syncText || `We are syncing messages from last ${selectedHistory === "custom" ? "custom range" : `${selectedHistory} Days`} from ${selectedGroups.length} groups. You can continue exploring the app while your messages sync in the background.`}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        className="w-full pt-1"
      >
        <PrimaryBtn onClick={() => router.push("/chat")}>Start Exploring</PrimaryBtn>
      </motion.div>
    </div>
  );
}
