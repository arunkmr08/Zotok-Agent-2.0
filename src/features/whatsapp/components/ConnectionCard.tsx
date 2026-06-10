"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WhatsappState } from "@/features/whatsapp/hooks/useWhatsapp";

type Props = Pick<WhatsappState, "syncedGroups" | "slotsUsed" | "resyncing" | "handleResync" | "setDisconnectModal" | "setConnectModal">;

export function ConnectionCard({ syncedGroups, slotsUsed, resyncing, handleResync, setDisconnectModal, setConnectModal }: Props) {
  if (syncedGroups.length > 0) {
    return (
      <div className="flex items-center gap-4 p-5 bg-white dark:bg-[#1a1a1a] rounded-xl border border-black/[0.08] dark:border-white/[0.08] shadow-sm mb-8">
        <div className="w-[42px] h-[42px] rounded-lg bg-[#008069] dark:bg-[#005c4b] flex items-center justify-center flex-shrink-0 p-2.5">
          <Image src="/assets/avatars/wa-icon.svg" alt="WhatsApp" width={22} height={22} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#111] dark:text-[#f0efec]">
            <span className="font-normal">Connected to</span> +91 9876543210
          </p>
          <p className="text-sm text-[#858481]">Last Sync 12 minutes ago · {slotsUsed} groups</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" variant="destructive" onClick={() => setDisconnectModal(true)}>
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 7.5 7.5 10.5M8.5 4.5 10 3a4.24 4.24 0 0 1 5 5L13.5 9.5M9.5 13.5 8 15a4.24 4.24 0 0 1-5-5L4.5 8.5" />
            </svg>
            Disconnect
          </Button>
          <Button size="sm" onClick={handleResync} disabled={resyncing}>
            <svg className={cn("w-4 h-4 mr-1.5", resyncing && "animate-spin")} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1.5 6A7.5 7.5 0 0 1 15.5 8.5M16.5 12A7.5 7.5 0 0 1 2.5 9.5" />
              <polyline points="1.5 2.5 1.5 6 5 6" />
              <polyline points="16.5 15.5 16.5 12 13 12" />
            </svg>
            {resyncing ? "Syncing…" : "Re-sync now"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-[#1a1a1a] rounded-xl border border-dashed border-black/[0.12] dark:border-white/[0.08] mb-8 text-center">
      <div className="w-14 h-14 rounded-xl bg-[#ecebea] dark:bg-[#242424] flex items-center justify-center">
        <svg className="w-7 h-7 text-[#858481]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-[#34322d] dark:text-[#dadada]">No WhatsApp connected</p>
        <p className="text-sm text-[#858481] mt-1">Connect your WhatsApp to start syncing groups.</p>
      </div>
      <Button onClick={() => setConnectModal(true)}>Connect WhatsApp</Button>
    </div>
  );
}
