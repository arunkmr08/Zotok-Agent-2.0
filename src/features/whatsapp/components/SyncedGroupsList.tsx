import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GROUP_AVATARS, MAX_FREE } from "@/features/whatsapp/constants";
import type { WhatsappState } from "@/features/whatsapp/hooks/useWhatsapp";
import { motion, AnimatePresence } from "motion/react";

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
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSnackbar]);

  const handleRemove = (name: string) => {
    removeGroup(name);
    setShowSnackbar(true);
  };

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

      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-black/[0.06] dark:border-white/[0.08] overflow-hidden mb-4 flex flex-col">
        <AnimatePresence initial={false}>
          {syncedGroups.map((name, i) => {
            const group = allGroups.find((g) => g.name === name);
            const avatar = GROUP_AVATARS[i % GROUP_AVATARS.length];
            return (
              <motion.div
                key={name}
                layout
                initial={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  x: { duration: 0.25, ease: "easeOut" },
                  opacity: { duration: 0.25, ease: "easeOut" },
                  layout: { type: "spring", stiffness: 350, damping: 28 }
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1a1a1a]",
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
                    <TooltipTrigger render={<button onClick={() => handleRemove(name)} className="text-[#adadad] hover:text-red-500 transition-colors flex-shrink-0 p-1" aria-label="Remove group" />}>
                      <TrashIcon />
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6}>Remove group</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            );
          })}
        </AnimatePresence>
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

      <AnimatePresence>
        {showSnackbar && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-6 left-1/2 z-50 pointer-events-none bg-[#34322d] text-white px-4 py-2.5 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2 border border-black/[0.08]"
          >
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Group deleted successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
