"use client";

import { useState } from "react";
import { DEFAULT_CATEGORIES } from "@/features/agents/constants";
import type { Category, CatView } from "@/features/agents/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  open: boolean;
  onClose: () => void;
  onDeploy: () => void;
}


export function CategoryModal({ open, onClose, onDeploy }: Props) {
  const [view, setView] = useState<CatView>("list");
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES.map((c) => ({ ...c })));
  const [newName, setNewName] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [error, setError] = useState("");

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <TooltipProvider delay={300}>
      <div className="bg-[#f8f8f7] dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.06)] w-full max-w-[520px] flex flex-col gap-[20px] p-[21px]">

        {/* ── List view ── */}
        {view === "list" && (
          <>
            {/* Header */}
            <div className="flex gap-[12px] items-start w-full">
              <div className="flex flex-1 flex-col gap-[4px] min-w-0">
                <div className="flex items-center gap-[8px]">
                  <h2 className="font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">Configure Category Messages</h2>
                </div>
                <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">
                  Select the categories you want this worker to organize messages into. You can use the default business categories or create custom categories based on your workflow.
                </p>
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

            {/* Selected count + Add button */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">
                {categories.filter(c => c.checked).length} Selected
              </span>
              <button
                onClick={() => setView("create")}
                className="flex items-center gap-[6px] bg-white dark:bg-[#262626] border border-[#e8e6e0] dark:border-white/[0.1] pl-[13px] pr-[15px] py-[9px] rounded-[8px] font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px] hover:bg-[#f4f3ef] dark:hover:bg-[#303030] transition-colors"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="9" r="7.5" />
                  <path d="M6 9h6M9 6v6" />
                </svg>
                Add Category
              </button>
            </div>

            {/* Category list */}
            <div className="bg-white dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[12px] overflow-hidden max-h-[320px] overflow-y-auto">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setCategories((prev) => prev.map((c, j) => j === i ? { ...c, checked: !c.checked } : c))}
                  className={`flex gap-[10px] items-center px-[16px] py-[12px] w-full text-left transition-colors hover:bg-[#f8f8f7] dark:hover:bg-[#2f2f2f] ${i < categories.length - 1 ? "border-b border-black/[0.06] dark:border-white/[0.06]" : ""}`}
                >
                  <Checkbox checked={!!cat.checked} onCheckedChange={() => setCategories((prev) => prev.map((c, j) => j === i ? { ...c, checked: !c.checked } : c))} className="flex-shrink-0" />
                  <span className="flex-1 min-w-0 font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px]">{cat.name}</span>
                </button>
              ))}
            </div>

            {error && <p className="text-[12px] text-red-500">{error}</p>}

            {/* CTA */}
            <button
              onClick={handleDeploy}
              className="w-full bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] py-[10px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px] text-center"
            >
              Save &amp; Deploy Karamchari
            </button>
          </>
        )}

        {/* ── Create view ── */}
        {view === "create" && (
          <>
            {/* Header */}
            <div className="flex gap-[12px] items-start w-full">
              <div className="flex flex-1 flex-col gap-[4px] min-w-0">
                <div className="flex items-center gap-[8px]">
                  <Tooltip>
                    <TooltipTrigger render={
                      <button onClick={() => setView("list")} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex-shrink-0">
                        <svg className="w-[18px] h-[18px] text-[#34322d] dark:text-[#d9d9d9]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11.25 4.5 6.75 9l4.5 4.5" />
                        </svg>
                      </button>
                    } />
                    <TooltipContent side="top" sideOffset={4}>Back</TooltipContent>
                  </Tooltip>
                  <h2 className="font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">Add Category</h2>
                </div>
                <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">
                  Create a custom category to help the AI organize your messages.
                </p>
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

            <div className="flex flex-col gap-[12px]">
              <div className="flex flex-col gap-[6px]">
                <label className="font-medium text-[13px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px]">Category Name</label>
                <input
                  type="text"
                  placeholder="Ex: Orders & Dispatch"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white dark:bg-[#262626] border border-black/[0.08] dark:border-white/[0.08] rounded-[8px] px-[12px] py-[10px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] placeholder:text-[#858481] outline-none focus:border-[#0067ff] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="font-medium text-[13px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px]">AI Classification Instructions</label>
                <textarea
                  placeholder="Enter prompt to filter messages relevant to this category"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-white dark:bg-[#262626] border border-black/[0.08] dark:border-white/[0.08] rounded-[8px] px-[12px] py-[10px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] placeholder:text-[#858481] outline-none focus:border-[#0067ff] transition-colors resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSaveNew}
              className="w-full bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] py-[10px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px] text-center"
            >
              Save Category
            </button>
          </>
        )}

        {/* ── Success view ── */}
        {view === "success" && (
          <div className="flex flex-col items-center gap-[16px] py-[24px] text-center">
            <div className="w-[72px] h-[72px] rounded-full bg-[#e6f0ff] dark:bg-[#0f2040] flex items-center justify-center">
              <svg className="w-[36px] h-[36px] text-[#0067ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="flex flex-col gap-[4px]">
              <p className="font-semibold text-[18px] text-[#34322d] dark:text-white tracking-[-0.33px]">Karamchari Deployed!</p>
              <p className="font-normal text-[14px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">Category Messages is now active and organizing your WhatsApp messages.</p>
            </div>
            <button
              onClick={handleDone}
              className="w-full bg-[#0067ff] hover:bg-[#0055d4] transition-colors rounded-[8px] py-[10px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px] text-center"
            >
              Done
            </button>
          </div>
        )}

      </div>
      </TooltipProvider>
    </div>
  );
}
