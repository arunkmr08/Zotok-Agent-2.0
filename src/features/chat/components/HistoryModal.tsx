"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { HISTORY_OPTIONS } from "@/features/chat/constants";
import type { ChatState } from "@/features/chat/hooks/useChat";

type Props = Pick<
  ChatState,
  "historyModal" | "setHistoryModal" | "selectedHistory" | "setSelectedHistory" |
  "historyFrom" | "setHistoryFrom" | "historyTo" | "setHistoryTo" | "setGroupsModal"
>;

export function HistoryModal({
  historyModal, setHistoryModal,
  selectedHistory, setSelectedHistory,
  historyFrom, setHistoryFrom,
  historyTo, setHistoryTo,
  setGroupsModal,
}: Props) {
  return (
    <Dialog open={historyModal} onOpenChange={setHistoryModal}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Fetch WhatsApp Chat History</DialogTitle>
          <p className="text-sm text-[#6d6c6b]">Import past messages so Zotok can start with context.</p>
        </DialogHeader>
        <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5.5 9.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          WhatsApp Connected Successfully!
        </div>
        <p className="text-sm font-medium text-[#34322d] dark:text-[#adadad] mb-1">How far back should we fetch?</p>
        <p className="text-xs text-[#858481] mb-3">Messages older than 90 days may not be available depending on your WhatsApp backup settings.</p>
        <div className="space-y-2 mb-3">
          {HISTORY_OPTIONS.map((opt) => (
            <div
              key={opt.days}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition-colors",
                selectedHistory === opt.days
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.12]"
              )}
              onClick={() => setSelectedHistory(opt.days as number | "custom")}
            >
              <span className="text-sm text-[#34322d] dark:text-[#dadada]">{opt.label}</span>
              <div className={cn(
                "w-4 h-4 rounded-full border-2 transition-colors",
                selectedHistory === opt.days ? "border-blue-500 bg-blue-500" : "border-black/[0.12]"
              )} />
            </div>
          ))}
        </div>
        {selectedHistory === "custom" && (
          <div className="flex gap-3 mb-3">
            <div className="flex-1"><Label className="mb-1 block text-xs">From</Label><Input type="date" value={historyFrom} onChange={(e) => setHistoryFrom(e.target.value)} /></div>
            <div className="flex-1"><Label className="mb-1 block text-xs">To</Label><Input type="date" value={historyTo} onChange={(e) => setHistoryTo(e.target.value)} /></div>
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <Button variant="outline" className="flex-1" onClick={() => setHistoryModal(false)}>Maybe Later</Button>
          <Button className="flex-1" onClick={() => { setHistoryModal(false); setGroupsModal(true); }}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
