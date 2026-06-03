"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DEFAULT_COLUMNS, SHEET_OPTIONS_SHEETS } from "@/features/agents/constants";
import type { SheetsView } from "@/features/agents/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  open: boolean;
  triggerRect?: DOMRect | null;
  onClose: () => void;
  onDeploy: () => void;
}

export function SheetsModal({ open, triggerRect, onClose, onDeploy }: Props) {
  const [view, setView] = useState<SheetsView>("connect");
  const [selectedSheet, setSelectedSheet] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [columns, setColumns] = useState(DEFAULT_COLUMNS.map((c) => ({ name: c })));
  const [newCol, setNewCol] = useState("");
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
              initial={{ opacity: 0, scale: 0.94, x: startX * 0.15, y: startY * 0.15 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, x: startX * 0.15, y: startY * 0.15 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="bg-[#f8f8f7] dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.06)] w-full max-w-[520px] flex flex-col gap-[20px] p-[21px]"
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
                        <h2 className="font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">Groups to Sheets</h2>
                        <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">Stream structured fields from WhatsApp messages into a Google Sheet you control.</p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger render={
                          <button onClick={handleClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                            <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                              <path d="M4 4l10 10M14 4 4 14" />
                            </svg>
                          </button>
                        } />
                        <TooltipContent side="top" sideOffset={4}>Close</TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-[#f4f3ef] dark:bg-[#242424] my-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={24} height={24} />
                      </div>
                      <Image src="/assets/icons/icon-arrow-right.svg" alt="" width={20} height={20} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                        <Image src="/assets/icons/icon-google-sheets-sm.png" alt="Sheets" width={24} height={24} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada]">Continue to Setup Google Sheets</p>
                        <p className="text-xs text-[#858481]">Approve this connection in Google</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
                      <Button className="flex-1" onClick={handleConnect} disabled={view === "loading"}>
                        {view === "loading"
                          ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Connecting…</span>
                          : "Continue In Google"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {view === "picker" && (
                  <motion.div
                    key="picker"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-[20px] w-full"
                  >
                    <div className="flex gap-[12px] items-start w-full">
                      <div className="flex flex-1 flex-col gap-[4px] min-w-0">
                        <h2 className="font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">Groups to Sheets</h2>
                      </div>
                      <Tooltip>
                        <TooltipTrigger render={
                          <button onClick={handleClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                            <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                              <path d="M4 4l10 10M14 4 4 14" />
                            </svg>
                          </button>
                        } />
                        <TooltipContent side="top" sideOffset={4}>Close</TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-[#34322d] dark:text-[#adadad] mb-0.5">Select Your Preferred Sheet</p>
                      <p className="text-xs text-[#858481]">Connected to: jktraders223@gmail.com</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {SHEET_OPTIONS_SHEETS.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => setSelectedSheet(s.id)}
                          className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors text-center", selectedSheet === s.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.12]")}
                        >
                          <div className="w-10 h-10 rounded bg-[#ecebea] dark:bg-[#242424] flex items-center justify-center">
                            {s.id === "blank"
                              ? <svg className="w-5 h-5 text-[#858481]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                              : <Image src="/assets/icons/icon-google-sheets-sm.png" alt="" width={20} height={20} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                          </div>
                          <p className="text-xs text-[#34322d] dark:text-[#adadad] line-clamp-2">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-2" disabled={!selectedSheet} onClick={() => setView("columns")}>Continue</Button>
                  </motion.div>
                )}

                {view === "columns" && (
                  <motion.div
                    key="columns"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-[20px] w-full"
                  >
                    <div className="flex gap-[12px] items-start w-full">
                      <div className="flex flex-1 flex-col gap-[4px] min-w-0">
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger render={
                              <button onClick={() => setView("picker")} className="p-1 rounded hover:bg-[#ecebea] dark:hover:bg-[#242424]">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                              </button>
                            } />
                            <TooltipContent side="top" sideOffset={6}>Back</TooltipContent>
                          </Tooltip>
                          <h2 className="font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">Configure Sheet</h2>
                        </div>
                        <p className="text-sm text-[#6d6c6b]">Configure the columns to extract from your WhatsApp group messages.</p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger render={
                          <button onClick={handleClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                            <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                              <path d="M4 4l10 10M14 4 4 14" />
                            </svg>
                          </button>
                        } />
                        <TooltipContent side="top" sideOffset={4}>Close</TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="mb-3"><Label className="mb-1.5 block">Sheet Name</Label><Input placeholder="Ex: Group Messages 2026" value={sheetName} onChange={(e) => setSheetName(e.target.value)} /></div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#6d6c6b] dark:text-[#7f7f7f]">{columns.length} Columns</span>
                      <Button size="sm" variant="outline" onClick={() => { if (newCol.trim()) { setColumns((p) => [...p, { name: newCol.trim() }]); setNewCol(""); } }}>+ Add</Button>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Input placeholder="New column name" value={newCol} onChange={(e) => setNewCol(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newCol.trim()) { setColumns((p) => [...p, { name: newCol.trim() }]); setNewCol(""); }}} />
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                      {columns.map((col, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08]">
                          <span className="flex-1 text-sm text-[#34322d] dark:text-[#adadad]">{col.name}</span>
                          <Tooltip>
                            <TooltipTrigger render={<button onClick={() => setColumns((p) => p.filter((_, j) => j !== i))} className="text-[#858481] hover:text-red-500" />}>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </TooltipTrigger>
                            <TooltipContent side="top" sideOffset={6}>Remove column</TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" onClick={() => setView("success")}>Save &amp; Deploy</Button>
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
                    <div className="w-24 h-24 rounded-full bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                      <svg className="w-12 h-12 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-[#34322d] dark:text-[#dadada]">Karamchari deployed successfully!</p>
                    <p className="text-sm text-[#6d6c6b]">Groups to Sheets is now active and syncing your WhatsApp messages.</p>
                    <Button className="mt-2 w-full" onClick={handleDone}>Done</Button>
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
