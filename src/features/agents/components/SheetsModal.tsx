"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DEFAULT_COLUMNS, MOCK_GROUPS } from "@/features/agents/constants";
import type { SheetsView } from "@/features/agents/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { SHEET_PREVIEW_B64, SHEETS_ICON_B64 } from "@/features/agents/constants.images";
import { motion, AnimatePresence } from "motion/react";
import { DeployedLottie } from "@/features/agents/components/DeployedLottie";

interface Props {
  open: boolean;
  triggerRect?: DOMRect | null;
  onClose: () => void;
  onDeploy: () => void;
  step?: number;
  totalSteps?: number;
}

function SelectDropdown({ options, value, onChange, placeholder = "Select" }: {
  options: string[]; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full h-[40px] bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.1] rounded-[8px] px-[12px] flex items-center justify-between gap-[8px] text-left"
      >
        <span className={cn("font-normal text-[14px] tracking-[-0.09px] truncate", value ? "text-[#34322d] dark:text-[#d9d9d9]" : "text-[#8c8c8c]")}>{value || placeholder}</span>
        <svg className="w-[18px] h-[18px] text-[#8c8c8c] flex-shrink-0" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 6.75L9 11.25l4.5-4.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-[2px] bg-white dark:bg-[#262626] border border-black/[0.08] dark:border-white/[0.08] rounded-[8px] shadow-[0px_4px_16px_rgba(0,0,0,0.10)] overflow-hidden z-20">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={() => { onChange(opt); setOpen(false); }}
              className={cn("w-full text-left px-[12px] py-[9px] font-normal text-[14px] tracking-[-0.09px] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors", value === opt ? "text-[#0067ff] font-medium" : "text-[#34322d] dark:text-[#d9d9d9]")}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
                  <Image src="/assets/icons/icon-back.svg" alt="" width={18} height={18} className="dark:invert" unoptimized />
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
            <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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

export function SheetsModal({ open, triggerRect, onClose, onDeploy, step = 0, totalSteps = 3 }: Props) {
  const [view, setView] = useState<SheetsView>("connect");
  const [selectedSheet, setSelectedSheet] = useState("");
  const [columns, setColumns] = useState(DEFAULT_COLUMNS.map((c) => ({ name: c })));
  const [newCol, setNewCol] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [removedColumns, setRemovedColumns] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [keyword, setKeyword] = useState("@ZoAI");
  const [prompt, setPrompt] = useState("Extract the customer name, phone number, location, product interest, and any special requirements from the WhatsApp message. If a field is not mentioned, leave it blank.");
  const [actionColumn, setActionColumn] = useState("");
  const [actionValue, setActionValue] = useState("");
  const [actionType, setActionType] = useState("Send Message");
  const [messageBody, setMessageBody] = useState("Hi {Name} 👋, your order has been received! Our team will contact you at {Phone} shortly. Thank you for reaching out via {Group}.");
  const [messageFooter, setMessageFooter] = useState("Powered by ZoAI");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVariablePicker, setShowVariablePicker] = useState(false);
  const messageBodyRef = useRef<HTMLTextAreaElement>(null);
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  const CONFIG_STEP: Partial<Record<SheetsView, number>> = { columns: 1, keywords: 2, actions: 3, groups: 4 };
  const configStep = CONFIG_STEP[view] ?? 1;
  const dragIndex = useRef<number | null>(null);
  const newColInputRef = useRef<HTMLInputElement>(null);
  const [windowSize, setWindowSize] = useState({ w: 1024, h: 768 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    }
  }, [open]);

  const filteredGroups = MOCK_GROUPS.filter((g) => g.name.toLowerCase().includes(groupSearch.toLowerCase()));

  function applyFormat(marker: string) {
    const el = messageBodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = messageBody.slice(start, end);
    const newText = messageBody.slice(0, start) + marker + (selected || "text") + marker + messageBody.slice(end);
    setMessageBody(newText);
    setTimeout(() => { el.focus(); el.setSelectionRange(start + marker.length, (selected ? end : start + 4) + marker.length); }, 0);
  }

  function insertAtCursor(text: string) {
    const el = messageBodyRef.current;
    const start = el?.selectionStart ?? messageBody.length;
    const end = el?.selectionEnd ?? messageBody.length;
    const newText = messageBody.slice(0, start) + text + messageBody.slice(end);
    setMessageBody(newText);
    setTimeout(() => { el?.focus(); el?.setSelectionRange(start + text.length, start + text.length); }, 0);
  }

  function handleConnect() { setView("loading"); setTimeout(() => setView("picker"), 1200); }
  function handleClose() { setView("connect"); setActionColumn(""); setActionValue(""); setMessageBody(""); setMessageFooter(""); setGroupSearch(""); setSelectedGroups(new Set()); onClose(); }
  function handleDone() { onDeploy(); handleClose(); }

  const centerX = triggerRect ? triggerRect.left + triggerRect.width / 2 : windowSize.w / 2;
  const centerY = triggerRect ? triggerRect.top + triggerRect.height / 2 : windowSize.h / 2;

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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
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
                        <div className="bg-[#589981] rounded-[10px] shadow-[0px_8px_32px_rgba(0,0,0,0.06)] w-[60px] h-[60px] flex items-center justify-center overflow-hidden">
                          <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={38} height={38} className="object-contain" unoptimized />
                        </div>
                        <svg className="w-[20px] h-[20px] text-[#8c8c8c]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 7h12M13 4l3 3-3 3M16 13H4M7 16l-3-3 3-3" />
                        </svg>
                        <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.1] rounded-[10px] shadow-[0px_8px_32px_rgba(0,0,0,0.06)] w-[60px] h-[60px] flex items-center justify-center overflow-hidden">
                          <Image src="/assets/icons/icon-google-sheets-sm.png" alt="Google Sheets" width={32} height={32} className="!w-[32px] !h-[32px] object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
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
                        {view === "loading"
                          ? <span className="w-[14px] h-[14px] border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          : <Image src="/assets/icons/google-white-icon.svg" alt="" width={16} height={16} unoptimized />
                        }
                        {view === "loading" ? "Connecting…" : "Connect Google Account"}
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
                            <svg className="w-[24px] h-[24px] text-[#595959] dark:text-[#8c8c8c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
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
                    {/* Header */}
                    <div className="flex flex-col gap-[12px] w-full">
                      <div className="flex gap-[8px] h-[32px] items-center w-full">
                        <Tooltip>
                          <TooltipTrigger render={
                            <button onClick={() => setView("picker")} className="w-[24px] h-[24px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                              <Image src="/assets/icons/icon-back.svg" alt="" width={18} height={18} className="dark:invert" unoptimized />
                            </button>
                          } />
                          <TooltipContent side="top" sideOffset={4}>Back</TooltipContent>
                        </Tooltip>
                        <Image src="/assets/icons/icon-google-sheets-sm.png" alt="" width={24} height={24} className="!w-[24px] !h-[24px] object-contain flex-shrink-0" />
                        <h2 className="flex-1 min-w-0 font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal flex items-center gap-0 min-w-0">
                          <span className="flex-shrink-0">Configure &ldquo;</span>
                          <span className="truncate min-w-0 max-w-[16ch]">{SHEET_OPTIONS.find(s => s.id === selectedSheet)?.label ?? "Sheet"}</span>
                          <span className="flex-shrink-0">&rdquo; Columns</span>
                        </h2>
                        {(() => {
                          const r = 5.5;
                          const circ = 2 * Math.PI * r;
                          const offset = circ * (1 - configStep / 4);
                          return (
                            <div className="flex items-center gap-[6px] bg-white dark:bg-[#262626] border border-[#f0f0f0] dark:border-white/[0.1] px-[8px] py-[4px] rounded-full flex-shrink-0">
                              <svg className="w-4 h-4 -rotate-90" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r={r} stroke="#e5e5e5" strokeWidth="1.8" />
                                <circle cx="8" cy="8" r={r} stroke="#0067ff" strokeWidth="1.8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
                              </svg>
                              <span className="font-semibold text-[12px] text-[#595959] dark:text-[#8c8c8c] tracking-[0.01px] whitespace-nowrap">{configStep} of 4</span>
                            </div>
                          );
                        })()}
                        <Tooltip>
                          <TooltipTrigger render={
                            <button onClick={handleClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                              <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                <path d="M4 4l10 10M14 4 4 14" />
                              </svg>
                            </button>
                          } />
                          <TooltipContent side="top" sideOffset={4}>Close</TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">
                        We&apos;ve fetched the columns from your selected Google Sheet. You can add, edit, reorder or remove columns based on your requirement.
                      </p>
                    </div>

                    {/* Info banner */}
                    <div className="bg-[#e6f0ff] dark:bg-[#0f2040] border border-[#91beff] dark:border-[#1a4080] rounded-[12px] flex gap-[12px] items-center px-[12px] py-[8px]">
                      <svg className="w-[24px] h-[24px] text-[#0067ff] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9.5" />
                        <path d="M12 8h.01M12 12v4" />
                      </svg>
                      <div className="flex-1 flex flex-col min-w-0">
                        <p className="font-semibold text-[14px] text-[#002e73] dark:text-[#91beff] tracking-[-0.18px] leading-[22px]">ZoAi will add data in new rows only.</p>
                        <p className="font-normal text-[13px] text-[#003b91] dark:text-[#6aa3ff] tracking-[-0.04px] leading-[20px]">Existing data in your sheet will not be replaced or overwritten.</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-[8px]">
                      <div className="flex items-center justify-between h-[36px]">
                        <span className="font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">{columns.length} Column</span>
                        <button
                          onClick={() => {
                            setShowAddInput(true);
                            setTimeout(() => newColInputRef.current?.focus(), 0);
                          }}
                          className="flex items-center gap-[6px] bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.1] pl-[13px] pr-[15px] py-[9px] rounded-[8px] font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px] hover:bg-[#f4f3ef] dark:hover:bg-[#303030] transition-colors"
                        >
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="7.5"/><path d="M6 9h6M9 6v6"/></svg>
                          Add Column
                        </button>
                      </div>

                      <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[8px] py-[8px] overflow-visible max-h-[300px] overflow-y-auto">
                        {/* Inline add row with suggestions — shown on demand */}
                        {showAddInput && <div className="relative border-b border-black/[0.06] dark:border-white/[0.06]">
                          <div className="flex items-center gap-[10px] px-[12px] py-[12px]">
                            <svg className="w-[18px] h-[18px] text-[#c0bfbd] dark:text-[#595959] flex-shrink-0" viewBox="0 0 18 18" fill="currentColor">
                              <circle cx="6.5" cy="5" r="1.2"/><circle cx="11.5" cy="5" r="1.2"/>
                              <circle cx="6.5" cy="9" r="1.2"/><circle cx="11.5" cy="9" r="1.2"/>
                              <circle cx="6.5" cy="13" r="1.2"/><circle cx="11.5" cy="13" r="1.2"/>
                            </svg>
                            <input
                              ref={newColInputRef}
                              type="text"
                              placeholder="Enter Column Name"
                              value={newCol}
                              onChange={(e) => setNewCol(e.target.value)}
                              onFocus={() => setShowSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newCol.trim()) {
                                  setColumns((p) => [{ name: newCol.trim() }, ...p]);
                                  setNewCol("");
                                  setShowSuggestions(false);
                                  setShowAddInput(false);
                                }
                              }}
                              className="flex-1 min-w-0 bg-transparent outline-none font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] placeholder:text-[#858481] dark:placeholder:text-[#595959] tracking-[-0.09px] leading-[18px]"
                            />
                            <span className="flex items-center gap-[4px] flex-shrink-0">
                              <kbd className="flex items-center gap-[2px] bg-[#f4f3ef] dark:bg-[#2a2a2a] border border-black/[0.1] dark:border-white/[0.1] rounded-[4px] px-[5px] py-[2px] font-medium text-[11px] text-[#8c8c8c] leading-[16px] whitespace-nowrap">↵ Enter to add</kbd>
                            </span>
                          </div>
                          {showSuggestions && removedColumns.filter((c) => c.toLowerCase().includes(newCol.toLowerCase())).length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-[4px] bg-white dark:bg-[#262626] border border-black/[0.08] dark:border-white/[0.08] rounded-[8px] shadow-[0px_4px_16px_rgba(0,0,0,0.10)] overflow-hidden z-10">
                              {removedColumns.filter((c) => c.toLowerCase().includes(newCol.toLowerCase())).map((c) => (
                                <button
                                  key={c}
                                  onMouseDown={() => {
                                    setColumns((p) => [{ name: c }, ...p]);
                                    setRemovedColumns((p) => p.filter((r) => r !== c));
                                    setNewCol("");
                                    setShowSuggestions(false);
                                  }}
                                  className="w-full flex items-center gap-[8px] px-[12px] py-[9px] text-left hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
                                >
                                  <svg className="w-[14px] h-[14px] text-[#858481] flex-shrink-0" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 2v10M2 7h10" />
                                  </svg>
                                  <span className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px]">{c}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>}

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
                                  onClick={() => {
                                    setRemovedColumns((p) => p.includes(col.name) ? p : [...p, col.name]);
                                    setColumns((p) => p.filter((_, j) => j !== i));
                                  }}
                                  className="w-[18px] h-[18px] flex items-center justify-center text-[#c0bfbd] dark:text-[#595959] hover:text-red-500 transition-colors flex-shrink-0"
                                >
                                  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                    <path d="M2.25 4.5h13.5M7.5 4.5V3a.75.75 0 0 1 .75-.75h1.5A.75.75 0 0 1 10.5 3v1.5M14.25 4.5l-.75 9.75a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5L3.75 4.5"/>
                                  </svg>
                                </button>
                              } />
                              <TooltipContent side="top" sideOffset={4}>Remove</TooltipContent>
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (newCol.trim()) setColumns((p) => [{ name: newCol.trim() }, ...p]);
                          setNewCol("");
                          setShowAddInput(false);
                          setView("keywords");
                        }}
                        className="bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] min-w-[120px] px-[13px] py-[9px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px] text-center"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Keywords & Prompt ── */}
                {view === "keywords" && (
                  <motion.div
                    key="keywords"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-[20px] w-full"
                  >
                    {/* Header */}
                    <div className="flex flex-col gap-[12px] w-full">
                      <div className="flex gap-[8px] h-[32px] items-center w-full">
                        <Tooltip>
                          <TooltipTrigger render={
                            <button onClick={() => setView("columns")} className="w-[24px] h-[24px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                              <Image src="/assets/icons/icon-back.svg" alt="" width={18} height={18} className="dark:invert" unoptimized />
                            </button>
                          } />
                          <TooltipContent side="top" sideOffset={4}>Back</TooltipContent>
                        </Tooltip>
                        <h2 className="flex-1 min-w-0 font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">Keywords &amp; Prompt</h2>
                        {(() => {
                          const r = 5.5;
                          const circ = 2 * Math.PI * r;
                          const offset = circ * (1 - configStep / 4);
                          return (
                            <div className="flex items-center gap-[6px] bg-white dark:bg-[#262626] border border-[#f0f0f0] dark:border-white/[0.1] px-[8px] py-[4px] rounded-full flex-shrink-0">
                              <svg className="w-4 h-4 -rotate-90" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r={r} stroke="#e5e5e5" strokeWidth="1.8" />
                                <circle cx="8" cy="8" r={r} stroke="#0067ff" strokeWidth="1.8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
                              </svg>
                              <span className="font-semibold text-[12px] text-[#595959] dark:text-[#8c8c8c] tracking-[0.01px] whitespace-nowrap">{configStep} of 4</span>
                            </div>
                          );
                        })()}
                        <Tooltip>
                          <TooltipTrigger render={
                            <button onClick={handleClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                              <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                <path d="M4 4l10 10M14 4 4 14" />
                              </svg>
                            </button>
                          } />
                          <TooltipContent side="top" sideOffset={4}>Close</TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">
                        Automatically capture WhatsApp messages matching a keyword and define the data to extract using a prompt.
                      </p>
                    </div>

                    {/* Keyword card */}
                    <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[8px] px-[16px] py-[20px] flex flex-col gap-[16px]">
                      <div className="flex flex-col gap-[2px]">
                        <p className="font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">Keyword to trigger</p>
                        <p className="font-normal text-[13px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[18px]">ZoAI will fetch all WhatsApp messages that stating with this keyword.</p>
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">
                          Keyword<span className="text-[#dd360c]">*</span>
                        </p>
                        <input
                          type="text"
                          placeholder="Example: @ZoAI"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          className="h-[40px] w-full bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.1] rounded-[8px] px-[12px] font-normal text-[14px] text-[#34322d] dark:text-[#d9d9d9] placeholder:text-[#8c8c8c] tracking-[-0.09px] outline-none focus:border-[#0067ff] transition-colors"
                        />
                      </div>
                      <div className="bg-[#e6f0ff] dark:bg-[#0f2040] border border-[#91beff] dark:border-[#1a4080] rounded-[12px] flex gap-[12px] items-center px-[12px] py-[8px]">
                        <svg className="w-[24px] h-[24px] text-[#0067ff] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="9.5" /><path d="M12 8h.01M12 12v4" />
                        </svg>
                        <p className="flex-1 font-normal text-[13px] text-[#003b91] dark:text-[#6aa3ff] tracking-[-0.04px] leading-[18px]">
                          The keyword must be at the beginning of the message. Example: @Zoai create order or @Haiku send payment request.
                        </p>
                      </div>
                    </div>

                    {/* Prompt card */}
                    <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[8px] px-[16px] py-[20px] flex flex-col gap-[16px]">
                      <div className="flex flex-col gap-[2px]">
                        <p className="font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">Prompt for Data Extraction</p>
                        <p className="font-normal text-[13px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[18px]">ZoAI will use this prompt to understand the messages and extract the information for the selected sheet columns.</p>
                      </div>
                      <div className="flex flex-col gap-[8px]">
                        <div className="flex flex-col gap-[4px]">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">
                              Prompt<span className="text-[#dd360c]">*</span>
                            </p>
                            <p className="font-light text-[12px] text-[#8c8c8c] tracking-[0.01px] leading-[18px]">{prompt.length}/1000</p>
                          </div>
                          <textarea
                            placeholder="Enter prompt"
                            value={prompt}
                            maxLength={1000}
                            onChange={(e) => {
                              setPrompt(e.target.value);
                              e.target.style.height = "auto";
                              e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            rows={5}
                            className="w-full bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.1] rounded-[8px] px-[12px] py-[10px] font-normal text-[14px] text-[#34322d] dark:text-[#d9d9d9] placeholder:text-[#8c8c8c] tracking-[-0.09px] outline-none focus:border-[#0067ff] transition-colors resize-none overflow-y-auto max-h-[200px]"
                          />
                        </div>
                        <button className="flex items-center gap-[4px] text-[#0067ff] hover:text-[#0055d4] transition-colors">
                          <svg className="w-[16px] h-[16px] flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="1.5" width="10" height="13" rx="1.5" /><path d="M5 5h4M5 8h4M5 11h2" /><path d="M12 4.5l2 0v9a1.5 1.5 0 0 1-1.5 1.5H4" />
                          </svg>
                          <span className="font-medium text-[14px] tracking-[-0.09px] leading-[20px]">Use Template</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setView("actions")}
                        disabled={!keyword.trim() || !prompt.trim()}
                        className="bg-[#0067ff] hover:bg-[#0055d4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-[8px] min-w-[120px] px-[13px] py-[9px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px] text-center"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Actions ── */}
                {view === "actions" && (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-[20px] w-full"
                  >
                    {/* Header */}
                    <div className="flex flex-col gap-[12px] w-full">
                      <div className="flex gap-[8px] h-[32px] items-center w-full">
                        <Tooltip>
                          <TooltipTrigger render={
                            <button onClick={() => setView("keywords")} className="w-[24px] h-[24px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                              <Image src="/assets/icons/icon-back.svg" alt="" width={18} height={18} className="dark:invert" unoptimized />
                            </button>
                          } />
                          <TooltipContent side="top" sideOffset={4}>Back</TooltipContent>
                        </Tooltip>
                        <h2 className="flex-1 min-w-0 font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">Actions</h2>
                        {(() => {
                          const r = 5.5;
                          const circ = 2 * Math.PI * r;
                          const offset = circ * (1 - configStep / 4);
                          return (
                            <div className="flex items-center gap-[6px] bg-white dark:bg-[#262626] border border-[#f0f0f0] dark:border-white/[0.1] px-[8px] py-[4px] rounded-full flex-shrink-0">
                              <svg className="w-4 h-4 -rotate-90" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r={r} stroke="#e5e5e5" strokeWidth="1.8" />
                                <circle cx="8" cy="8" r={r} stroke="#0067ff" strokeWidth="1.8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
                              </svg>
                              <span className="font-semibold text-[12px] text-[#595959] dark:text-[#8c8c8c] tracking-[0.01px] whitespace-nowrap">{configStep} of 4</span>
                            </div>
                          );
                        })()}
                        <Tooltip>
                          <TooltipTrigger render={
                            <button onClick={handleClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                              <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                <path d="M4 4l10 10M14 4 4 14" />
                              </svg>
                            </button>
                          } />
                          <TooltipContent side="top" sideOffset={4}>Close</TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">
                        Select a column to configure template when there is a data change in the sheet
                      </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white dark:bg-[#262626] border border-[rgba(217,217,217,0.6)] dark:border-white/[0.06] rounded-[8px] overflow-hidden">
                      {/* Dropdowns row */}
                      <div className="border-b border-black/[0.06] dark:border-white/[0.06] px-[16px] py-[20px] flex gap-[16px] items-start">
                        <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                          <p className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px] whitespace-nowrap">Select Column</p>
                          <SelectDropdown options={columns.map((c) => c.name)} value={actionColumn} onChange={setActionColumn} />
                        </div>
                        <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                          <p className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px] whitespace-nowrap">Select Value</p>
                          <SelectDropdown options={["Completed", "Pending", "In Progress", "New"]} value={actionValue} onChange={setActionValue} />
                        </div>
                        <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                          <p className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px] whitespace-nowrap">Action</p>
                          <SelectDropdown options={["Send Message"]} value={actionType} onChange={setActionType} placeholder="Send Message" />
                        </div>
                      </div>

                      {/* Body */}
                      {!actionColumn || !actionValue ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center gap-[16px] py-[40px] px-[16px]">
                          <div className="bg-[#f5f5f5] dark:bg-[#1f1f1f] rounded-[8px] p-[16px] flex flex-col gap-[20px] w-[168px]">
                            <div className="bg-[#d9d9d9] dark:bg-[#3a3a3a] rounded-[12px] h-[53px]" />
                            <div className="flex flex-col gap-[8px]">
                              <div className="bg-[#d9d9d9] dark:bg-[#3a3a3a] rounded-[12px] h-[8px] w-full" />
                              <div className="bg-[#d9d9d9] dark:bg-[#3a3a3a] rounded-[12px] h-[8px] w-full" />
                              <div className="bg-[#d9d9d9] dark:bg-[#3a3a3a] rounded-[12px] h-[8px] w-[75px]" />
                            </div>
                          </div>
                          <p className="font-normal text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] text-center">Select Column and value to configure the template here</p>
                        </div>
                      ) : (
                        /* Configure message + preview */
                        <div className="flex items-stretch min-h-[300px]">
                          {/* Left: Configure Message */}
                          <div className="flex-1 min-w-0 border-r border-[#f0f0f0] dark:border-white/[0.06] p-[16px] flex flex-col gap-[16px]">
                            <p className="font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.33px]">Configure Message</p>

                            {/* Body section */}
                            <div className="flex flex-col gap-[8px]">
                              <div className="flex flex-col gap-[2px]">
                                <p className="font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] leading-[20px]">Body</p>
                                <p className="font-normal text-[13px] text-[#858481] dark:text-[#8c8c8c] leading-[18px]">Enter the text for your message in the language that you&apos;ve selected.</p>
                              </div>
                              {/* Formatting toolbar */}
                              <div className="flex items-center gap-[12px]">
                                <div className="flex items-center gap-[2px]">
                                  <Tooltip>
                                    <TooltipTrigger render={
                                      <button type="button" onClick={() => applyFormat("*")} className="w-[24px] h-[24px] flex items-center justify-center font-bold text-[18px] text-[#34322d] dark:text-[#d9d9d9] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-[4px]">B</button>
                                    } />
                                    <TooltipContent side="top" sideOffset={4}>Bold</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger render={
                                      <button type="button" onClick={() => applyFormat("_")} className="w-[24px] h-[24px] flex items-center justify-center italic text-[18px] text-[#34322d] dark:text-[#d9d9d9] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-[4px]">I</button>
                                    } />
                                    <TooltipContent side="top" sideOffset={4}>Italic</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger render={
                                      <button type="button" onClick={() => applyFormat("~")} className="w-[24px] h-[24px] flex items-center justify-center line-through text-[18px] text-[#34322d] dark:text-[#d9d9d9] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-[4px]">S</button>
                                    } />
                                    <TooltipContent side="top" sideOffset={4}>Strikethrough</TooltipContent>
                                  </Tooltip>
                                  {/* Emoji picker */}
                                  <div className="relative">
                                    <button type="button" onClick={() => { setShowEmojiPicker((p) => !p); setShowVariablePicker(false); }} className="w-[24px] h-[24px] flex items-center justify-center text-[16px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-[4px]">😊</button>
                                    {showEmojiPicker && (
                                      <div className="absolute top-full left-0 mt-[4px] bg-white dark:bg-[#262626] border border-black/[0.08] dark:border-white/[0.08] rounded-[8px] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] p-[8px] z-20 w-[200px]">
                                        <div className="grid grid-cols-8 gap-[2px]">
                                          {["😊","😃","😂","😍","🥰","😎","🤔","😢","😡","🙏","👍","👎","👋","💪","🎉","🔥","💯","⭐","✅","❌","📦","💰","📞","📱","🏠","🚀","✨","💡","⚠️","ℹ️","🛒","📊"].map((e) => (
                                            <button key={e} type="button" onMouseDown={() => { insertAtCursor(e); setShowEmojiPicker(false); }} className="w-[22px] h-[22px] flex items-center justify-center text-[16px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-[4px]">{e}</button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="w-px h-[24px] bg-[#d9d9d9] dark:bg-[#3a3a3a] flex-shrink-0" />
                                {/* Add Variable picker */}
                                <div className="relative">
                                  <button type="button" onClick={() => { setShowVariablePicker((p) => !p); setShowEmojiPicker(false); }} className="flex items-center gap-[4px] text-[#0067ff] hover:text-[#0055d4] transition-colors">
                                    <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="9" cy="9" r="7.5" /><path d="M6 9h6M9 6v6" />
                                    </svg>
                                    <span className="font-semibold text-[14px] leading-[20px]">Add Variable</span>
                                  </button>
                                  {showVariablePicker && columns.length > 0 && (
                                    <div className="absolute top-full left-0 mt-[4px] bg-white dark:bg-[#262626] border border-black/[0.08] dark:border-white/[0.08] rounded-[8px] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] overflow-hidden z-20 min-w-[160px]">
                                      {columns.map((col) => (
                                        <button
                                          key={col.name}
                                          type="button"
                                          onMouseDown={() => { insertAtCursor(`{${col.name}}`); setShowVariablePicker(false); }}
                                          className="w-full text-left px-[12px] py-[8px] font-normal text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors flex items-center gap-[8px]"
                                        >
                                          <span className="text-[#0067ff] font-mono text-[12px]">{`{}`}</span>
                                          {col.name}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Body textarea */}
                              <div className="flex flex-col gap-[2px]">
                                <div className="relative w-full bg-white dark:bg-[#1a1a1a] border border-[#d9d9d9] dark:border-white/[0.1] rounded-[6px] focus-within:border-[#0067ff] transition-colors">
                                  {/* Highlight layer */}
                                  <div aria-hidden className="absolute inset-0 px-[12px] py-[10px] font-normal text-[14px] leading-[22px] whitespace-pre-wrap break-words pointer-events-none overflow-hidden rounded-[6px]">
                                    {messageBody.split(/(\{[^}]+\})/g).map((part, i) =>
                                      /^\{[^}]+\}$/.test(part)
                                        ? <span key={i} className="text-[#0067ff] font-semibold bg-[#0067ff]/[0.08] rounded-[2px]">{part}</span>
                                        : <span key={i} className="text-[#34322d] dark:text-[#d9d9d9]">{part}</span>
                                    )}
                                  </div>
                                  <textarea
                                    ref={messageBodyRef}
                                    placeholder="Enter text in english"
                                    value={messageBody}
                                    maxLength={1024}
                                    onChange={(e) => setMessageBody(e.target.value)}
                                    onFocus={() => { setShowEmojiPicker(false); setShowVariablePicker(false); }}
                                    rows={4}
                                    className="relative w-full bg-transparent px-[12px] py-[10px] font-normal text-[14px] leading-[22px] placeholder:text-[#8c8c8c] outline-none resize-none"
                                    style={{ color: 'transparent', caretColor: '#34322d' }}
                                  />
                                </div>
                                <p className="text-right font-normal text-[12px] text-[#8c8c8c] leading-[20px]">{messageBody.length}/1024</p>
                              </div>
                            </div>

                            {/* Footer section */}
                            <div className="flex flex-col gap-[8px]">
                              <div className="flex flex-col gap-[2px]">
                                <p className="font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] leading-[20px]">Footer</p>
                                <p className="font-normal text-[13px] text-[#858481] dark:text-[#8c8c8c] leading-[18px]">Add a short line of text</p>
                              </div>
                              <div className="flex items-center bg-white dark:bg-[#1a1a1a] border border-[#d9d9d9] dark:border-white/[0.1] rounded-[6px] px-[12px] py-[10px] gap-[8px]">
                                <input
                                  type="text"
                                  placeholder="Enter text in english"
                                  value={messageFooter}
                                  maxLength={60}
                                  onChange={(e) => setMessageFooter(e.target.value)}
                                  className="flex-1 min-w-0 bg-transparent outline-none font-normal text-[14px] text-[#34322d] dark:text-[#d9d9d9] placeholder:text-[#8c8c8c]"
                                />
                                <span className="font-normal text-[12px] text-[#8c8c8c] flex-shrink-0">{messageFooter.length}/60</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: WhatsApp preview */}
                          <div className="w-[280px] flex-shrink-0 bg-[#f5f2eb] dark:bg-[#1a1a1a] p-[12px] flex items-start justify-center">
                            <div className="bg-white dark:bg-[#262626] rounded-[8px] p-[12px] w-full flex flex-col gap-[8px]">
                              <p className="font-semibold text-[12px] text-[#9d2609] leading-[16px]">Pankaj Kumar</p>
                              <div className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] leading-[20px] whitespace-pre-wrap">
                                {(() => {
                                  const PREVIEW_VALUES: Record<string, string> = {
                                    Name: "Pankaj Kumar", Phone: "+91 98765 43210", Message: "I need 2 boxes of product",
                                    Group: "South Zone Sales", Date: "11 Jun 2026", Status: "Pending", keyword: "@ZoAI",
                                  };
                                  if (!messageBody) return <span className="text-[#8c8c8c] font-normal">Message preview will appear here…</span>;
                                  return messageBody.split(/(\{[^}]+\})/g).map((part, i) => {
                                    const match = part.match(/^\{([^}]+)\}$/);
                                    if (match) {
                                      const val = PREVIEW_VALUES[match[1]] ?? match[1];
                                      return <span key={i} className="text-[#34322d] dark:text-[#d9d9d9] font-semibold">{val}</span>;
                                    }
                                    return <span key={i}>{part}</span>;
                                  });
                                })()}
                              </div>
                              {messageFooter && <p className="font-normal text-[13px] text-[#8c8c8c] leading-[18px] border-t border-black/[0.06] dark:border-white/[0.06] pt-[8px]">{messageFooter}</p>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setView("groups")}
                        className="bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] min-w-[120px] px-[13px] py-[9px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px] text-center"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Groups ── */}
                {view === "groups" && (
                  <motion.div
                    key="groups"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-[20px] w-full"
                  >
                    {/* Custom header with stepper */}
                    <div className="flex items-center gap-[12px]">
                      <Tooltip>
                        <TooltipTrigger render={
                          <button type="button" onClick={() => setView("actions")} className="w-[24px] h-[24px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                            <Image src="/assets/icons/icon-back.svg" alt="" width={18} height={18} className="dark:invert" unoptimized />
                          </button>
                        } />
                        <TooltipContent side="top" sideOffset={4}>Back</TooltipContent>
                      </Tooltip>
                      <h2 className="flex-1 min-w-0 font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">Select WhatsApp Groups</h2>
                      {(() => {
                        const r = 5.5;
                        const circ = 2 * Math.PI * r;
                        const offset = circ * (1 - configStep / 4);
                        return (
                          <div className="flex items-center gap-[6px] bg-white dark:bg-[#262626] border border-[#f0f0f0] dark:border-white/[0.1] px-[8px] py-[4px] rounded-full flex-shrink-0">
                            <svg className="w-4 h-4 -rotate-90" viewBox="0 0 16 16" fill="none">
                              <circle cx="8" cy="8" r={r} stroke="#e5e5e5" strokeWidth="1.8" />
                              <circle cx="8" cy="8" r={r} stroke="#0067ff" strokeWidth="1.8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
                            </svg>
                            <span className="font-semibold text-[12px] text-[#595959] dark:text-[#8c8c8c] tracking-[0.01px] whitespace-nowrap">{configStep} of 4</span>
                          </div>
                        );
                      })()}
                      <button type="button" onClick={handleClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                        <svg className="w-[18px] h-[18px] text-[#595959] dark:text-[#8c8c8c]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" />
                        </svg>
                      </button>
                    </div>
                    <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px] -mt-[12px]">Select groups to sync WhatsApp messages into your Google Sheet.</p>

                    <div className="flex items-center gap-[8px] bg-white dark:bg-[#262626] border border-black/[0.08] dark:border-white/[0.08] rounded-[8px] px-[12px] py-[10px]">
                      <Image src="/assets/icons/icon-search.svg" alt="" width={14} height={14} className="opacity-50 dark:brightness-0 dark:invert dark:opacity-40" />
                      <input type="text" placeholder="Search groups" value={groupSearch} onChange={(e) => setGroupSearch(e.target.value)} className="flex-1 bg-transparent outline-none text-[14px] text-[#34322d] dark:text-[#d9d9d9] placeholder:text-[#858481]" />
                    </div>

                    <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[12px] overflow-hidden max-h-[380px] overflow-y-auto">
                      {filteredGroups.map((g, i) => (
                        <button
                          key={g.name}
                          onClick={() => setSelectedGroups((p) => { const n = new Set(p); n.has(g.name) ? n.delete(g.name) : n.add(g.name); return n; })}
                          className={`flex items-center gap-[12px] px-[16px] py-[12px] w-full text-left transition-colors hover:bg-[#f8f8f7] dark:hover:bg-[#2f2f2f] ${i < filteredGroups.length - 1 ? "border-b border-black/[0.06] dark:border-white/[0.06]" : ""}`}
                        >
                          <Image src={`/assets/icons/${g.avatar}`} alt="" width={28} height={28} className="rounded-full flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] truncate">{g.name}</p>
                            <p className="font-normal text-[12px] text-[#858481] tracking-[0.01px]">{g.members}</p>
                          </div>
                          <Checkbox checked={selectedGroups.has(g.name)} onCheckedChange={() => setSelectedGroups((p) => { const n = new Set(p); n.has(g.name) ? n.delete(g.name) : n.add(g.name); return n; })} className="flex-shrink-0" />
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setView("success")}
                      disabled={selectedGroups.size === 0}
                      className="w-full bg-[#0067ff] hover:bg-[#0055d4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-[8px] h-[34px] flex items-center justify-center font-semibold text-[14px] text-white tracking-[-0.09px]"
                    >
                      Save &amp; Deploy
                    </button>
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
                    <DeployedLottie />
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-semibold text-[18px] text-[#34322d] dark:text-white tracking-[-0.33px]">Karamchari Deployed!</p>
                      <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">Groups to Sheets is now active and syncing your WhatsApp messages.</p>
                    </div>
                    <button
                      onClick={handleDone}
                      className="w-[100px] bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] py-[10px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px] text-center"
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
