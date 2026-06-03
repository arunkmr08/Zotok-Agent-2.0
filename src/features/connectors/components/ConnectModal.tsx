"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ModalView } from "@/features/connectors/types";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  open: boolean;
  triggerRect?: DOMRect | null;
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
  open, triggerRect, onClose, onDone,
  title, desc, leftIcon, rightIcon, ctaLabel,
  successTitle, successDesc,
}: Props) {
  const [view, setView] = useState<ModalView>("connect");
  const [windowSize, setWindowSize] = useState({ w: 1024, h: 768 });

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    }
  }, [open]);

  const centerX = triggerRect ? triggerRect.left + triggerRect.width / 2 : windowSize.w / 2;
  const centerY = triggerRect ? triggerRect.top + triggerRect.height / 2 : windowSize.h / 2;
  const startX = centerX - windowSize.w / 2;
  const startY = centerY - windowSize.h / 2;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: startX * 0.15, y: startY * 0.15 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, x: startX * 0.15, y: startY * 0.15 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="bg-[#f8f8f7] dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.06)] w-full max-w-[448px] flex flex-col gap-[20px] p-[21px]"
          >
            <AnimatePresence mode="wait">
              {(view === "connect" || view === "loading") && (
                <motion.div
                  key="connect-loading"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-[20px] w-full"
                >
                  <div className="flex gap-[12px] items-start w-full">
                    <div className="flex flex-1 flex-col gap-[4px] min-w-0">
                      <h2 className="font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">{title}</h2>
                      <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">{desc}</p>
                    </div>
                    <button onClick={handleClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                      <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                        <path d="M4 4l10 10M14 4 4 14" />
                      </svg>
                    </button>
                  </div>

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
                </motion.div>
              )}

              {view === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-3 py-6 text-center w-full"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                    <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-[#34322d] dark:text-[#dadada]">{successTitle}</p>
                  <p className="text-sm text-[#6d6c6b]">{successDesc}</p>
                  <Button className="mt-2 w-full" onClick={handleDone}>Done</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
