"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { WhatsappState } from "@/features/whatsapp/hooks/useWhatsapp";

type Props = Pick<
  WhatsappState,
  | "groupsModal" | "setGroupsModal"
  | "groupSearch" | "setGroupSearch"
  | "pendingGroups" | "setPendingGroups"
  | "filteredAvailable"
  | "togglePending"
  | "handleSyncGroups"
>;

export function GroupsModal({
  groupsModal, setGroupsModal,
  groupSearch, setGroupSearch,
  pendingGroups, setPendingGroups,
  filteredAvailable,
  togglePending,
  handleSyncGroups,
}: Props) {
  return (
    <Dialog
      open={groupsModal}
      onOpenChange={(open) => {
        if (!open) {
          setGroupsModal(false);
          setPendingGroups(new Set());
        }
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Choose Groups to Sync</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 h-[40px] bg-[#f4f3ef] dark:bg-[#242424] border border-black/[0.08] dark:border-white/[0.08] rounded-lg px-3 mb-2">
          <Image src="/assets/icons/icon-search.svg" alt="" width={14} height={14} />
          <input
            type="text"
            placeholder="Search Group"
            value={groupSearch}
            onChange={(e) => setGroupSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-[#34322d] dark:text-[#dadada]"
          />
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto mb-3">
          {filteredAvailable.length === 0 ? (
            <p className="text-sm text-[#858481] text-center py-4">All groups already synced or no results.</p>
          ) : filteredAvailable.map((g) => {
            const isSel = pendingGroups.has(g.name);
            return (
              <div
                key={g.name}
                onClick={() => togglePending(g.name)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors",
                  isSel
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.12]"
                )}
              >
                <Image
                  src={`/assets/icons/${g.avatar}`}
                  alt="" width={28} height={28}
                  className="rounded-full flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada] truncate">{g.name}</p>
                  <p className="text-xs text-[#858481]">{g.members}</p>
                </div>
                <Checkbox
                  checked={isSel}
                  onClick={(e) => e.stopPropagation()}
                  readOnly
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => { setGroupsModal(false); setPendingGroups(new Set()); }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={pendingGroups.size === 0}
            onClick={handleSyncGroups}
          >
            Add selected
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
