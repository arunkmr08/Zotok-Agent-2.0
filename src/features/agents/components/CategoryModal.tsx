"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEFAULT_CATEGORIES } from "@/features/agents/constants";
import type { Category, CatView } from "@/features/agents/types";

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
    const names = categories.map((c) => c.name.trim().toLowerCase());
    if (names.some((n) => !n)) return setError("All categories must have a name.");
    if (new Set(names).size !== names.length) return setError("Category names must be unique.");
    if (categories.length === 0) return setError("At least 1 category is required.");
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        {view === "list" && (
          <>
            <DialogHeader>
              <DialogTitle>Configure Category Messages</DialogTitle>
              <p className="text-sm text-[#6d6c6b]">Select the categories you want this worker to organize messages into.</p>
            </DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#6d6c6b] dark:text-[#7f7f7f]">{categories.filter(c => c.checked).length} Selected</span>
              <Button size="sm" variant="outline" onClick={() => setView("create")}>
                <svg className="w-4 h-4 mr-1" viewBox="0 0 18 18" fill="none">
                  <path d="M9 16.5A7.5 7.5 0 1 0 9 1.5a7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9h6M9 6v6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add Category
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {categories.map((cat, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1a1a]">
                  <input
                    type="checkbox" checked={!!cat.checked}
                    onChange={() => setCategories((prev) => prev.map((c, j) => j === i ? { ...c, checked: !c.checked } : c))}
                    className="mt-0.5 h-4 w-4 rounded accent-blue-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada]">{cat.name}</p>
                    {cat.prompt && <p className="text-xs text-[#858481] mt-0.5 line-clamp-2">{cat.prompt}</p>}
                  </div>
                  <button
                    onClick={() => setCategories((prev) => prev.length > 1 ? prev.filter((_, j) => j !== i) : (setError("At least 1 category is required."), prev))}
                    className="text-[#858481] hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            <Button className="w-full mt-2" onClick={handleDeploy}>Save &amp; Deploy</Button>
          </>
        )}

        {view === "create" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <button onClick={() => setView("list")} className="p-1 rounded hover:bg-[#ecebea] dark:hover:bg-[#242424]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <DialogTitle>Create Category</DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label className="mb-1.5 block">Category Name</Label><Input placeholder="Ex: Orders & Dispatch" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
              <div>
                <Label className="mb-1.5 block">AI Classification Instructions (Prompt)</Label>
                <textarea
                  className="w-full min-h-24 rounded-md border border-black/[0.08] dark:border-white/[0.08] bg-transparent px-3 py-2 text-sm outline-none resize-vertical focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter prompt to filter the messages relevant to this category"
                  value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="flex-1" onClick={() => setView("list")}>Cancel</Button>
              <Button className="flex-1" onClick={handleSaveNew}>Save</Button>
            </div>
          </>
        )}

        {view === "success" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <p className="text-lg font-semibold text-[#34322d] dark:text-[#dadada]">Karamchari deployed successfully!</p>
            <p className="text-sm text-[#6d6c6b]">Category Messages is now active and organizing your WhatsApp messages.</p>
            <Button className="mt-2 w-full" onClick={handleDone}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
