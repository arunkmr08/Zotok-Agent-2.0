"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { WhatsappState } from "@/features/whatsapp/hooks/useWhatsapp";

type Props = Pick<
  WhatsappState,
  | "groupsModal" | "setGroupsModal"
  | "syncing" | "setSyncing"
  | "groupSearch" | "setGroupSearch"
  | "pendingGroups"
  | "slotsLeft"
  | "filteredAvailable"
  | "togglePending"
  | "handleSyncGroups"
  | "setPendingGroups"
>;

export function GroupsModal({
  groupsModal, setGroupsModal,
  syncing, setSyncing,
  groupSearch, setGroupSearch,
  pendingGroups,
  slotsLeft,
  filteredAvailable,
  togglePending,
  handleSyncGroups,
  setPendingGroups,
}: Props) {
  return (
    <Dialog
      open={groupsModal}
      onOpenChange={() => {
        if (!syncing) {
          setGroupsModal(false);
          setSyncing(false);
          setPendingGroups(new Set());
        }
      }}
    >
      <DialogContent className="max-w-sm">
        {!syncing ? (
          <>
            <DialogHeader>
              <DialogTitle>Choose Groups to Sync</DialogTitle>
              <p className="text-xs text-[#6d6c6b]">
                {slotsLeft > 0
                  ? `${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} remaining on free plan.`
                  : "Free plan limit reached. Upgrade to add more."}
              </p>
            </DialogHeader>
            <div className="flex items-center gap-2 bg-[#f4f3ef] dark:bg-[#242424] border border-black/[0.08] dark:border-white/[0.08] rounded-lg px-3 py-2 mb-2">
              <Image src="/assets/icons/icon-search.svg" alt="" width={14} height={14} />
              <input
                type="text" placeholder="Search Group" value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-[#34322d] dark:text-[#dadada]"
              />
            </div>
            <p className="text-xs font-semibold text-[#6d6c6b] mb-2">Selected {pendingGroups.size} · {slotsLeft} slots left</p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto mb-3">
              {filteredAvailable.length === 0 ? (
                <p className="text-sm text-[#858481] text-center py-4">All groups already synced or no results.</p>
              ) : filteredAvailable.map((g) => {
                const isSel = pendingGroups.has(g.name);
                const isDisabled = !isSel && slotsLeft <= pendingGroups.size;
                return (
                  <div
                    key={g.name}
                    onClick={() => !isDisabled && togglePending(g.name)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors",
                      isSel ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.12]",
                      isDisabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <Image src={`/assets/icons/${g.avatar}`} alt="" width={28} height={28} className="rounded-full flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada] truncate">{g.name}</p>
                      <p className="text-xs text-[#858481]">{g.members}</p>
                    </div>
                    <div className={cn("w-4 h-4 rounded border-2 flex-shrink-0", isSel ? "border-blue-500 bg-blue-500" : "border-black/[0.12]")} />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setGroupsModal(false); setPendingGroups(new Set()); }}>Cancel</Button>
              <Button className="flex-1" disabled={pendingGroups.size === 0} onClick={handleSyncGroups}>Sync Messages</Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <p className="font-semibold text-[#34322d] dark:text-[#dadada]">Message Sync in Progress</p>
            <p className="text-sm text-[#6d6c6b] text-center">You can close the popup to explore Zotok. This process will run in the background.</p>
            <Button className="w-full" onClick={() => { setGroupsModal(false); setSyncing(false); }}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
