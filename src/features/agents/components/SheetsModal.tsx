"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DEFAULT_COLUMNS } from "@/features/agents/constants";
import type { SheetsView } from "@/features/agents/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SHEET_PREVIEW_B64, SHEETS_ICON_B64 } from "@/features/agents/constants.images";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  open: boolean;
  triggerRect?: DOMRect | null;
  onClose: () => void;
  onDeploy: () => void;
}

function ModalHeader({ title, desc, onClose, onBack }: { title: string; desc?: string; onClose: () => void; onBack?: () => void }) {
  return (
    <div className="flex gap-[12px] items-start w-full">
      <div className="flex flex-1 flex-col gap-[4px] min-w-0">
        <div className="flex items-center gap-[8px]">
          {onBack && (
            <Tooltip>
              <TooltipTrigger render={
                <button onClick={onBack} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                  <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.25 4.5 6.75 9l4.5 4.5" />
                  </svg>
                </button>
              } />
              <TooltipContent side="top" sideOffset={4}>Back</TooltipContent>
            </Tooltip>
          )}
          <h2 className="font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">{title}</h2>
        </div>
        {desc && <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">{desc}</p>}
      </div>
      <Tooltip>
        <TooltipTrigger render={
          <button onClick={onClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
            <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M4 4l10 10M14 4 4 14" />
            </svg>
          </button>
        } />
        <TooltipContent side="top" sideOffset={4}>Close</TooltipContent>
      </Tooltip>
    </div>
  );
}

const SHEET_OPTIONS = [
  { id: "blank",    label: "Start from blank sheet" },
  { id: "feb",      label: "Groups data February 2026.xlsx" },
  { id: "mar",      label: "Groups data March 2026.xlsx" },
  { id: "apr",      label: "Groups data April 2026.xlsx" },
  { id: "q1",       label: "Q1 Groups Report 2026.xlsx" },
  { id: "whatsapp", label: "WhatsApp Groups Master.xlsx" },
  { id: "crm",      label: "Operations Sync 2026.xlsx" },
  { id: "jun",      label: "June Groups Pipeline.xlsx" },
];

export function SheetsModal({ open, triggerRect, onClose, onDeploy }: Props) {
  const [view, setView] = useState<SheetsView>("connect");
  const [selectedSheet, setSelectedSheet] = useState("");
  const [columns, setColumns] = useState(DEFAULT_COLUMNS.map((c) => ({ name: c })));
  const [newCol, setNewCol] = useState("");
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragIndex = useRef<number | null>(null);
  const [windowSize, setWindowSize] = useState({ w: 1024, h: 768 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    }
  }, [open]);

  function handleConnect() { setView("loading"); setTimeout(() => setView("picker"), 1200); }
  function handleClose() { setView("connect"); onClose(); }
  function handleDone() { onDeploy(); handleClose(); }

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
          <TooltipProvider delay={300}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98, x: startX * 0.08, y: startY * 0.08 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: startX * 0.08, y: startY * 0.08 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#f8f8f7] dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.06)] w-full max-w-[720px] flex flex-col gap-[20px] p-[21px]"
            >
              <AnimatePresence mode="wait">

                {/* ── Connect / Loading ── */}
                {(view === "connect" || view === "loading") && (
                  <motion.div
                    key="connect"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-[20px] w-full"
                  >
                    <ModalHeader
                      title="Configure Groups to Sheets"
                      desc="Stream structured fields from WhatsApp messages into a Google Sheet you control."
                      onClose={handleClose}
                    />

                    <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[18px] flex flex-col items-center justify-center gap-[20px] py-[48px] px-[80px]">
                      <div className="flex items-center gap-[22px]">
                        <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.1] rounded-[10px] shadow-[0px_8px_32px_rgba(0,0,0,0.06)] w-[60px] h-[60px] flex items-center justify-center overflow-hidden">
                          <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={38} height={38} />
                        </div>
                        <svg className="w-[20px] h-[20px] text-[#8c8c8c]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 7h12M13 4l3 3-3 3M16 13H4M7 16l-3-3 3-3" />
                        </svg>
                        <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.1] rounded-[10px] shadow-[0px_8px_32px_rgba(0,0,0,0.06)] w-[60px] h-[60px] flex items-center justify-center overflow-hidden">
                          <Image src="/assets/icons/icon-google-sheets-sm.png" alt="Google Sheets" width={36} height={36} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-[2px] text-center">
                        <p className="font-semibold text-[16px] text-[#34322d] dark:text-white tracking-[-0.18px] leading-[20px]">Continue to Setup Google Sheets</p>
                        <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">Approve this connection in Google</p>
                      </div>
                    </div>

                    <div className="flex gap-[12px]">
                      <button
                        onClick={handleClose}
                        className="flex-1 bg-white dark:bg-[#262626] border border-[#e8e6e0] dark:border-white/[0.1] rounded-[8px] py-[9px] font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px] text-center hover:bg-[#f4f3ef] dark:hover:bg-[#303030] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConnect}
                        disabled={view === "loading"}
                        className="flex-1 bg-[#0067ff] hover:bg-[#0055d4] disabled:opacity-70 transition-colors rounded-[8px] py-[9px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px] text-center flex items-center justify-center gap-[8px]"
                      >
                        {view === "loading" && <span className="w-[14px] h-[14px] border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />}
                        {view === "loading" ? "Connecting…" : "Continue in Google"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Picker ── */}
                {view === "picker" && (
                  <motion.div
                    key="picker"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-[20px] w-full"
                  >
                    <ModalHeader
                      title="Configure Groups to Sheets"
                      desc="Stream structured fields from WhatsApp messages into a Google Sheet you control."
                      onClose={handleClose}
                    />

                    <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[12px] flex flex-col gap-[24px] px-[20px] py-[16px]">
                      <div className="flex items-center justify-between gap-[12px]">
                        <p className="font-semibold text-[14px] text-[#34322d] dark:text-white tracking-[-0.09px] leading-[20px] whitespace-nowrap">Select Your Preferred Sheet to Sync the Data</p>
                        <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px] whitespace-nowrap">Connected to: jktraders223@gmail.com</p>
                      </div>

                      <div className="grid grid-cols-3 gap-[16px] max-h-[420px] overflow-y-auto pr-1">
                        {/* Blank */}
                        <button
                          onClick={() => setSelectedSheet("blank")}
                          className={cn(
                            "flex flex-col items-center justify-center gap-[8px] rounded-[8px] border-dashed border-2 py-[40px] transition-colors",
                            selectedSheet === "blank"
                              ? "border-[#0067ff] bg-[#e6f0ff] dark:bg-[#0f2040]"
                              : "border-black/[0.12] dark:border-white/[0.12] bg-[#f8f8f7] dark:bg-[#1f1f1f] hover:border-black/[0.2]"
                          )}
                        >
                          <div className="bg-white dark:bg-[#262626] border border-black/[0.12] dark:border-white/[0.1] rounded-[10px] w-[60px] h-[60px] flex items-center justify-center shadow-[0px_8px_32px_rgba(0,0,0,0.06)]">
                            <svg className="w-[24px] h-[24px] text-[#595959] dark:text-[#8c8c8c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                          </div>
                          <span className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px] whitespace-nowrap">Start from blank sheet</span>
                        </button>

                        {SHEET_OPTIONS.filter((s) => s.id !== "blank").map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSheet(s.id)}
                            className={cn(
                              "flex flex-col items-start rounded-[8px] border overflow-hidden transition-all",
                              selectedSheet === s.id
                                ? "border-[#0067ff] shadow-[0px_8px_32px_rgba(0,103,255,0.15)]"
                                : "border-black/[0.12] dark:border-white/[0.1] shadow-[0px_8px_32px_rgba(0,0,0,0.06)] hover:border-black/[0.2]"
                            )}
                          >
                            <div className="w-full border-b border-black/[0.06] dark:border-white/[0.06] bg-[#f8f8f7] dark:bg-[#1f1f1f]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={SHEET_PREVIEW_B64} alt="Sheet preview" className="w-full aspect-[640/360] object-cover pointer-events-none" />
                            </div>
                            <div className="flex items-center gap-[8px] p-[12px] bg-white dark:bg-[#262626] w-full">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={SHEETS_ICON_B64} alt="" className="w-[24px] h-[24px] flex-shrink-0" />
                              <span className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px] truncate">{s.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setView("columns")}
                      disabled={!selectedSheet}
                      className="w-full bg-[#0067ff] hover:bg-[#0055d4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-[8px] py-[10px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px] text-center"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {/* ── Columns ── */}
                {view === "columns" && (
                  <motion.div
                    key="columns"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-[20px] w-full"
                  >
                    <ModalHeader
                      title="Configure the Sheet Columns"
                      desc="Existing columns have been automatically fetched from the selected sheet. You can add, edit, reorder, or remove columns based on your requirement."
                      onClose={handleClose}
                      onBack={() => setView("picker")}
                    />

                    <div className="flex items-center justify-between h-[36px]">
                      <span className="font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">{columns.length} Columns</span>
                      <button
                        onClick={() => setNewCol("")}
                        className="flex items-center gap-[6px] bg-white dark:bg-[#262626] border border-[#e8e6e0] dark:border-white/[0.1] pl-[13px] pr-[15px] py-[9px] rounded-[8px] font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px] hover:bg-[#f4f3ef] dark:hover:bg-[#303030] transition-colors"
                      >
                        <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="7.5"/><path d="M6 9h6M9 6v6"/></svg>
                        Add Column
                      </button>
                    </div>

                    <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[8px] py-[8px] overflow-hidden max-h-[300px] overflow-y-auto">
                      {columns.map((col, i) => (
                        <div
                          key={i}
                          draggable
                          onDragStart={() => { dragIndex.current = i; }}
                          onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                          onDragLeave={() => setDragOver(null)}
                          onDrop={() => {
                            if (dragIndex.current === null || dragIndex.current === i) { setDragOver(null); return; }
                            const next = [...columns];
                            const [moved] = next.splice(dragIndex.current, 1);
                            next.splice(i, 0, moved);
                            setColumns(next);
                            dragIndex.current = null;
                            setDragOver(null);
                          }}
                          onDragEnd={() => { dragIndex.current = null; setDragOver(null); }}
                          className={cn(
                            "flex items-center gap-[10px] px-[12px] py-[12px] border-b border-black/[0.06] dark:border-white/[0.06] transition-colors",
                            dragOver === i ? "bg-[#e6f0ff] dark:bg-[#0f2040]" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                          )}
                        >
                          <svg className="w-[18px] h-[18px] text-[#c0bfbd] dark:text-[#595959] flex-shrink-0 cursor-grab active:cursor-grabbing" viewBox="0 0 18 18" fill="currentColor">
                            <circle cx="6.5" cy="5" r="1.2"/><circle cx="11.5" cy="5" r="1.2"/>
                            <circle cx="6.5" cy="9" r="1.2"/><circle cx="11.5" cy="9" r="1.2"/>
                            <circle cx="6.5" cy="13" r="1.2"/><circle cx="11.5" cy="13" r="1.2"/>
                          </svg>
                          <span className="flex-1 min-w-0 font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px]">{col.name}</span>
                          <Tooltip>
                            <TooltipTrigger render={
                              <button
                                onClick={() => setColumns((p) => p.filter((_, j) => j !== i))}
                                className="w-[18px] h-[18px] flex items-center justify-center text-[#c0bfbd] dark:text-[#595959] hover:text-red-500 transition-colors flex-shrink-0"
                              >
                                <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                  <path d="M2.25 4.5h13.5M7.5 4.5V3a.75.75 0 0 1 .75-.75h1.5A.75.75 0 0 1 10.5 3v1.5M14.25 4.5l-.75 9.75a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5L3.75 4.5"/>
                                </svg>
                              </button>
                            } />
                            <TooltipContent side="top" sideOffset={4}>Remove</TooltipContent>
                          </Tooltip>
                        </div>
                      ))}

                      {/* Inline add row */}
                      <div className="flex items-center gap-[10px] px-[12px] py-[12px]">
                        <svg className="w-[18px] h-[18px] text-[#c0bfbd] dark:text-[#595959] flex-shrink-0" viewBox="0 0 18 18" fill="currentColor">
                          <circle cx="6.5" cy="5" r="1.2"/><circle cx="11.5" cy="5" r="1.2"/>
                          <circle cx="6.5" cy="9" r="1.2"/><circle cx="11.5" cy="9" r="1.2"/>
                          <circle cx="6.5" cy="13" r="1.2"/><circle cx="11.5" cy="13" r="1.2"/>
                        </svg>
                        <input
                          type="text"
                          placeholder="Enter Column Name"
                          value={newCol}
                          onChange={(e) => setNewCol(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newCol.trim()) {
                              setColumns((p) => [...p, { name: newCol.trim() }]);
                              setNewCol("");
                            }
                          }}
                          className="flex-1 min-w-0 bg-transparent outline-none font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] placeholder:text-[#858481] dark:placeholder:text-[#595959] tracking-[-0.09px] leading-[18px]"
                        />
                        <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-[#e0dedd] dark:text-[#3a3a3a] flex-shrink-0">
                          <path d="M2.25 4.5h13.5M7.5 4.5V3a.75.75 0 0 1 .75-.75h1.5A.75.75 0 0 1 10.5 3v1.5M14.25 4.5l-.75 9.75a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5L3.75 4.5"/>
                        </svg>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (newCol.trim()) setColumns((p) => [...p, { name: newCol.trim() }]);
                          setNewCol("");
                          setView("success");
                        }}
                        className="bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] px-[20px] py-[9px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px]"
                      >
                        Save &amp; Deploy
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Success ── */}
                {view === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-[16px] py-[24px] text-center w-full"
                  >
                    <div className="w-[72px] h-[72px] rounded-full bg-[#e6f0ff] dark:bg-[#0f2040] flex items-center justify-center">
                      <svg className="w-[36px] h-[36px] text-[#0067ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-semibold text-[18px] text-[#34322d] dark:text-white tracking-[-0.33px]">Karamchari Deployed!</p>
                      <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">Groups to Sheets is now active and syncing your WhatsApp messages.</p>
                    </div>
                    <button
                      onClick={handleDone}
                      className="w-full bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] py-[10px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px] text-center"
                    >
                      Done
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          </TooltipProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
