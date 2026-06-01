"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ChatState } from "@/features/chat/hooks/useChat";

type Props = Pick<
  ChatState,
  "groupsModal" | "setGroupsModal" | "syncing" | "setSyncing" |
  "groupSearch" | "setGroupSearch" | "selectedGroups" | "toggleGroup" | "filteredGroups"
>;

export function GroupsModal({
  groupsModal, setGroupsModal,
  syncing, setSyncing,
  groupSearch, setGroupSearch,
  selectedGroups, toggleGroup, filteredGroups,
}: Props) {
  return (
    <Dialog open={groupsModal} onOpenChange={setGroupsModal}>
      <DialogContent className="max-w-sm">
        {!syncing ? (
          <>
            <DialogHeader>
              <DialogTitle>Choose Groups to Sync</DialogTitle>
              <p className="text-xs text-[#6d6c6b]">On the Free plan you can sync up to 10 groups. Locked groups unlock with Pro.</p>
            </DialogHeader>
            <div className="flex items-center gap-2 h-[40px] bg-[#f4f3ef] dark:bg-[#242424] border border-black/[0.08] dark:border-white/[0.08] rounded-lg px-3 mb-2">
              <Image src="/assets/icons/icon-search.svg" alt="" width={14} height={14} />
              <input
                type="text" placeholder="Search Group" value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-[#34322d] dark:text-[#dadada]"
              />
            </div>
            <p className="text-xs font-semibold text-[#6d6c6b] mb-2">Selected {selectedGroups.size}/10 on free plan</p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto mb-3">
              {filteredGroups.map((g) => {
                const isSel = selectedGroups.has(g.name);
                const isDisabled = !isSel && selectedGroups.size >= 10;
                return (
                  <div
                    key={g.name}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors",
                      isSel ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.12]",
                      isDisabled && "opacity-40 cursor-not-allowed"
                    )}
                    onClick={() => !isDisabled && toggleGroup(g.name)}
                  >
                    <Image src={`/assets/icons/${g.avatar}`} alt="" width={32} height={32} className="rounded-full flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada] truncate">{g.name}</p>
                      <p className="text-xs text-[#858481]">{g.members}</p>
                    </div>
                    <div className={cn(
                      "w-4 h-4 rounded border-2 flex-shrink-0",
                      isSel ? "border-blue-500 bg-blue-500" : "border-black/[0.12]"
                    )} />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setGroupsModal(false)}>Maybe Later</Button>
              <Button className="flex-1" disabled={selectedGroups.size === 0} onClick={() => setSyncing(true)}>Sync Messages</Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <p className="font-semibold text-[#34322d] dark:text-[#dadada]">Message Sync in Progress</p>
            <p className="text-sm text-[#6d6c6b] text-center">You can close the popup to explore Group Sense. This process will run in the background.</p>
            <Button className="w-full" onClick={() => { setSyncing(false); setGroupsModal(false); }}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
