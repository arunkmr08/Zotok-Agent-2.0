"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { DEFAULT_CATEGORIES } from "@/features/agents/constants";
import type { Category, CatView } from "@/features/agents/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "motion/react";
import { DeployedLottie } from "@/features/agents/components/DeployedLottie";

const CATEGORY_META: Record<string, { bg: string; icon: string }> = {
  "Orders & Dispatch":           { bg: "#dbdbfa", icon: "/assets/icons/cat-orders-dispatch.svg" },
  "Payments & Outstanding":      { bg: "#e2f1f8", icon: "/assets/icons/cat-payments-outstanding.svg" },
  "Inventory & Production":      { bg: "#dceadf", icon: "/assets/icons/cat-inventory-production.svg" },
  "Logistics & Transport":       { bg: "#dce1ea", icon: "/assets/icons/cat-logistics-transport.svg" },
  "Priority & Escalations":      { bg: "#ffd1dc", icon: "/assets/icons/cat-priority-escalations.svg" },
  "Sales & Customer Follow-Ups": { bg: "#cadee8", icon: "/assets/icons/cat-sales-followups.svg" },
  "Customer Support & Service":  { bg: "#e2f8f5", icon: "/assets/icons/cat-customer-support.svg" },
};

const FALLBACK_META = { bg: "#f0f0f0", icon: null };

interface Props {
  open: boolean;
  triggerRect?: DOMRect | null;
  onClose: () => void;
  onDeploy: () => void;
}

export function CategoryModal({ open, triggerRect, onClose, onDeploy }: Props) {
  const [view, setView] = useState<CatView>("list");
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES.map((c) => ({ ...c })));
  const [newName, setNewName] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [error, setError] = useState("");
  const [windowSize, setWindowSize] = useState({ w: 1024, h: 768 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    }
  }, [open]);

  function handleDeploy() {
    if (categories.filter(c => c.checked).length === 0) return setError("Select at least 1 category.");
    setError("");
    setView("success");
  }

  function handleSaveNew() {
    if (!newName.trim()) return;
    setCategories((prev) => [...prev, { name: newName.trim(), desc: "", prompt: newPrompt.trim(), checked: true }]);
    setNewName(""); setNewPrompt("");
    setView("list");
  }

  function handleClose() { setView("list"); onClose(); }
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
              className="bg-[#f8f8f7] dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.06)] w-full max-w-[640px] flex flex-col gap-[20px] p-[21px]"
            >

        <AnimatePresence mode="wait">
          {/* ── List view ── */}
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-[20px] w-full"
            >
              {/* Header */}
              <div className="flex gap-[12px] items-center w-full">
                <h2 className="flex-1 font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-[32px]">Categories Messages</h2>
                <Tooltip>
                  <TooltipTrigger render={
                    <button onClick={handleClose} className="w-[24px] h-[24px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                      <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M4 4l10 10M14 4 4 14" />
                      </svg>
                    </button>
                  } />
                  <TooltipContent side="top" sideOffset={4}>Close</TooltipContent>
                </Tooltip>
              </div>

              {/* Description */}
              <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px] -mt-[12px]">
                Select the categories you want this worker to organize messages into. You can use the default business categories or create custom categories based on your workflow.
              </p>

              {/* Selected count + Add button + Category list */}
              <div className="flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">
                  {categories.filter(c => c.checked).length} Selected
                </span>
                <button
                  onClick={() => setView("create")}
                  className="flex items-center gap-[6px] bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.08] pl-[13px] pr-[15px] py-[9px] rounded-[8px] font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px] hover:bg-[#f4f3ef] dark:hover:bg-[#303030] transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="9" r="7.5" />
                    <path d="M6 9h6M9 6v6" />
                  </svg>
                  Add Category
                </button>
              </div>

              {/* Category list */}
              <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[12px] overflow-hidden max-h-[340px] overflow-y-auto py-[8px]">
                {categories.map((cat, i) => {
                  const meta = CATEGORY_META[cat.name] ?? FALLBACK_META;
                  return (
                    <button
                      key={i}
                      onClick={() => setCategories((prev) => prev.map((c, j) => j === i ? { ...c, checked: !c.checked } : c))}
                      className={`flex gap-[16px] items-center px-[16px] py-[12px] w-full text-left transition-colors hover:bg-[#f8f8f7] dark:hover:bg-[#2f2f2f] ${i < categories.length - 1 ? "border-b border-black/[0.06] dark:border-white/[0.06]" : ""}`}
                    >
                      {/* Checkbox */}
                      <div className="flex-shrink-0 w-[20px] h-[20px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-colors"
                        style={{
                          background: cat.checked ? "#0067ff" : "transparent",
                          borderColor: cat.checked ? "#0067ff" : "#d9d9d9",
                        }}
                      >
                        {cat.checked && (
                          <svg className="w-[12px] h-[12px]" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 6l3 3 5-5" />
                          </svg>
                        )}
                      </div>

                      {/* Icon box */}
                      <div
                        className="flex-shrink-0 w-[48px] h-[48px] rounded-[10px] flex items-center justify-center"
                        style={{ background: meta.bg }}
                      >
                        {meta.icon && (
                          <Image src={meta.icon} alt="" width={24} height={24} unoptimized />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                        <p className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px]">{cat.name}</p>
                        {cat.desc && (
                          <p className="font-normal text-[13px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[20px]">{cat.desc}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              </div>

              {error && <p className="text-[12px] text-red-500">{error}</p>}

              {/* CTA row */}
              <div className="flex gap-[12px]">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.08] rounded-[8px] h-[36px] flex items-center justify-center font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] hover:bg-[#f4f3ef] dark:hover:bg-[#303030] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeploy}
                  className="flex-1 bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] h-[36px] flex items-center justify-center font-semibold text-[14px] text-white tracking-[-0.09px] min-w-[120px]"
                >
                  Save &amp; Deploy Karamchari
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Create view ── */}
          {view === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-[20px] w-full"
            >
              {/* Header */}
              <div className="flex items-center gap-[12px] w-full">
                <Tooltip>
                  <TooltipTrigger render={
                    <button onClick={() => setView("list")} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                      <Image src="/assets/icons/icon-back.svg" alt="" width={18} height={18} className="dark:invert" unoptimized />
                    </button>
                  } />
                  <TooltipContent side="top" sideOffset={4}>Back</TooltipContent>
                </Tooltip>
                <h2 className="flex-1 font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-[32px]">Add Category</h2>
                <Tooltip>
                  <TooltipTrigger render={
                    <button onClick={handleClose} className="w-[24px] h-[24px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                      <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M4 4l10 10M14 4 4 14" />
                      </svg>
                    </button>
                  } />
                  <TooltipContent side="top" sideOffset={4}>Close</TooltipContent>
                </Tooltip>
              </div>

              {/* Form sections */}
              <div className="flex flex-col gap-[8px]">
                {/* Category Name card */}
                <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[8px] px-[16px] py-[20px]">
                  <div className="flex flex-col gap-[4px]">
                    <label className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">Category Name</label>
                    <input
                      type="text"
                      placeholder="Ex: Orders & Dispatch"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full h-[40px] bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.1] rounded-[8px] px-[12px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] outline-none focus:border-[#0067ff] transition-colors"
                    />
                  </div>
                </div>

                {/* Prompt card */}
                <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[8px] px-[16px] py-[20px] flex flex-col gap-[16px]">
                  <div className="flex flex-col gap-[2px]">
                    <p className="font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">Prompt for Data Extraction from WhatsApp Messages</p>
                    <p className="font-light text-[12px] text-[#34322d] dark:text-[#8c8c8c] tracking-[0.01px] leading-[18px]">ZoAI will use this prompt to understand the messages and extract the information for the selected sheet columns.</p>
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">
                          Prompt<span className="text-[#dd360c]">*</span>
                        </p>
                        <p className="font-light text-[12px] text-[#34322d] dark:text-[#8c8c8c] tracking-[0.01px] leading-[18px]">{newPrompt.length}/1000</p>
                      </div>
                      <textarea
                        placeholder="Enter prompt"
                        value={newPrompt}
                        onChange={(e) => setNewPrompt(e.target.value.slice(0, 1000))}
                        rows={5}
                        className="w-full bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.1] rounded-[8px] px-[12px] py-[12px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px] outline-none focus:border-[#0067ff] transition-colors resize-none"
                      />
                    </div>
                    <button className="flex items-center gap-[4px] w-fit">
                      <Image src="/assets/icons/cat-use-template.svg" alt="" width={16} height={16} unoptimized />
                      <span className="font-medium text-[14px] text-[#0067ff] tracking-[-0.09px] leading-[20px]">Use Template</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveNew}
                className="w-full bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] h-[36px] flex items-center justify-center font-semibold text-[14px] text-white tracking-[-0.09px]"
              >
                Save Category
              </button>
            </motion.div>
          )}

          {/* ── Success view ── */}
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
                <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">Category Messages is now active and organizing your WhatsApp messages.</p>
              </div>
              <button
                onClick={handleDone}
                className="w-[100px] bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] h-[34px] flex items-center justify-center font-semibold text-[14px] text-white tracking-[-0.09px]"
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
