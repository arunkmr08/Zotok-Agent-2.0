"use client";

import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState, "syncText" | "selectedHistory" | "selectedGroups" | "router">;

export function WaSyncingStep({ syncText, selectedHistory, selectedGroups, router }: Props) {
  return (
    <div key="wa-syncing" className="flex flex-col items-center gap-5 py-8" style={{ animation: "fadeStep 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <div
        className="rounded-full animate-spin mb-1"
        style={{ width: 44, height: 44, border: "3px solid rgba(0,103,255,0.15)", borderTopColor: "#0067ff" }}
      />
      <h1 className="text-[22px] font-semibold text-[#111] dark:text-white mt-3">Syncing Messages ...</h1>
      <p className="text-sm text-[#6d6c6b] text-center max-w-xs">
        {syncText || `We are syncing messages from last ${selectedHistory === "custom" ? "custom range" : `${selectedHistory} Days`} from ${selectedGroups.length} groups. You can continue exploring the app while your messages sync in the background.`}
      </p>
      <PrimaryBtn className="mt-2" onClick={() => router.push("/chat")}>Start Exploring</PrimaryBtn>
    </div>
  );
}
