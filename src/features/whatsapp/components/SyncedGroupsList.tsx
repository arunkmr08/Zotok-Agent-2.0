"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GROUP_AVATARS, MAX_FREE } from "@/features/whatsapp/constants";
import type { WhatsappState } from "@/features/whatsapp/hooks/useWhatsapp";

type Props = Pick<WhatsappState, "syncedGroups" | "slotsUsed" | "slotsLeft" | "allGroups" | "openAddGroups" | "removeGroup">;

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  );
}

export function SyncedGroupsList({ syncedGroups, slotsUsed, slotsLeft, allGroups, openAddGroups, removeGroup }: Props) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-[#34322d] dark:text-[#dadada]">Sync Groups</h2>
          <p className="text-sm text-[#858481]">{slotsUsed} of {MAX_FREE} slots used on free plan</p>
        </div>
        <Button size="sm" variant="outline" onClick={openAddGroups} disabled={slotsLeft === 0}>
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
          </svg>
          Add Groups
        </Button>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-black/[0.06] dark:border-white/[0.08] overflow-hidden mb-4">
        {syncedGroups.map((name, i) => {
          const group = allGroups.find((g) => g.name === name);
          const avatar = GROUP_AVATARS[i % GROUP_AVATARS.length];
          return (
            <div
              key={name}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                i < syncedGroups.length - 1 && "border-b border-black/[0.06] dark:border-white/[0.06]"
              )}
            >
              <Image
                src={`/assets/avatars/${avatar}`}
                alt="" width={36} height={36}
                className="rounded-full flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada] truncate">{name}</p>
                <p className="text-xs text-[#858481]">{group?.members ?? ""}</p>
              </div>
              <TooltipProvider delay={300}>
                <Tooltip>
                  <TooltipTrigger render={<button onClick={() => removeGroup(name)} className="text-[#adadad] hover:text-red-500 transition-colors flex-shrink-0 p-1" aria-label="Remove group" />}>
                    <TrashIcon />
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6}>Remove group</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-5 p-5 bg-white dark:bg-[#1a1a1a] rounded-xl border border-black/[0.08] dark:border-white/[0.08]">
        <div className="min-w-0">
          <p className="font-semibold text-[#34322d] dark:text-[#dadada]">Add more groups beyond 10</p>
          <p className="text-sm text-[#858481] mt-0.5">Pro removes the cap and unlocks all groups.</p>
        </div>
        <Button size="sm" className="flex-shrink-0">
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="9" width="12" height="9" rx="2" />
            <path d="M6 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          Upgrade to Pro
        </Button>
      </div>
    </>
  );
}
