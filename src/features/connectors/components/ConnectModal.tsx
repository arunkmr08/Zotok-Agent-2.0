"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ModalView } from "@/features/connectors/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  title: string;
  desc: string;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  ctaLabel: string;
  successTitle: string;
  successDesc: string;
}

export function ConnectModal({
  open, onClose, onDone,
  title, desc, leftIcon, rightIcon, ctaLabel,
  successTitle, successDesc,
}: Props) {
  const [view, setView] = useState<ModalView>("connect");

  function handleConnect() {
    setView("loading");
    setTimeout(() => setView("success"), 2000);
  }

  function handleClose() {
    setTimeout(() => setView("connect"), 300);
    onClose();
  }

  function handleDone() {
    onDone();
    handleClose();
  }

  useEffect(() => {
    if (open) setView("connect");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {(view === "connect" || view === "loading") && (
          <>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <p className="text-sm text-[#6d6c6b]">{desc}</p>
            </DialogHeader>

            <div className="flex items-center gap-4 p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-[#f4f3ef] dark:bg-[#2a2a2a] my-2">
              <div className="flex items-center gap-3 flex-1">
                {leftIcon}
                <svg className="w-5 h-5 text-[#adadad] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                {rightIcon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada] truncate">
                  {view === "loading" ? (title.includes("Zotok") ? "Connecting to Zotok…" : "Continue to Setup Google Sheets") : ctaLabel}
                </p>
                <p className="text-xs text-[#858481] truncate">
                  {view === "loading"
                    ? (title.includes("Zotok") ? "Verifying your account and permissions" : "Approve this connection in Google")
                    : "Approve this connection"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
              <Button className="flex-1" onClick={handleConnect} disabled={view === "loading"}>
                {view === "loading"
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Connecting…</span>
                  : ctaLabel}
              </Button>
            </div>
          </>
        )}

        {view === "success" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-[#34322d] dark:text-[#dadada]">{successTitle}</p>
            <p className="text-sm text-[#6d6c6b]">{successDesc}</p>
            <Button className="mt-2 w-full" onClick={handleDone}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
