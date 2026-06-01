"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ALL_CAMPAIGNS } from "@/features/leads/constants";
import type { Lead, CampaignView } from "@/features/leads/types";

interface Props {
  lead: Lead | null;
  onClose: () => void;
}

export function CampaignModal({ lead, onClose }: Props) {
  const [view, setView] = useState<CampaignView>("connect");
  const [selected, setSelected] = useState<string | null>(null);
  const [zotokConnected, setZotokConnected] = useState(false);

  useEffect(() => {
    setZotokConnected(localStorage.getItem("zotok_atc_connected") === "true");
  }, []);

  useEffect(() => {
    if (lead) setView(zotokConnected ? "select" : "connect");
  }, [lead, zotokConnected]);

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {view === "connect" && (
          <div className="p-6 flex flex-col gap-4">
            <h3 className="text-base font-semibold text-[#111] dark:text-white">Add to Campaign</h3>
            <p className="text-sm text-[#6d6c6b]">Connect Zotok to push leads into your campaigns.</p>
            <div className="p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-[#f4f3ef] dark:bg-[#2a2a2a] flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#589981] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 11H9V9h2v4zm0-6H9V5h2v2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada]">Zotok</p>
                <p className="text-xs text-[#858481]">Not connected</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button className="flex-1" onClick={() => { localStorage.setItem("zotok_atc_connected", "true"); setView("select"); }}>Connect Zotok</Button>
            </div>
          </div>
        )}

        {view === "select" && (
          <div className="p-6 flex flex-col gap-4">
            <h3 className="text-base font-semibold text-[#111] dark:text-white">Choose Campaign</h3>
            <p className="text-sm text-[#6d6c6b]">Select where to add <span className="font-medium text-[#34322d] dark:text-[#adadad]">{lead.name}</span>.</p>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {ALL_CAMPAIGNS.map((c) => (
                <label key={c} className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                  selected === c
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.12]"
                )}>
                  <input type="radio" name="campaign" className="accent-blue-500" checked={selected === c} onChange={() => setSelected(c)} />
                  <span className="text-sm text-[#34322d] dark:text-[#dadada]">{c}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button className="flex-1" disabled={!selected} onClick={() => setView("done")}>Add to Campaign</Button>
            </div>
          </div>
        )}

        {view === "done" && (
          <div className="p-6 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <p className="text-base font-semibold text-[#34322d] dark:text-[#dadada]">Lead Added!</p>
            <p className="text-sm text-[#6d6c6b]">{lead.name} was added to <span className="font-medium text-[#34322d] dark:text-[#adadad]">{selected}</span>.</p>
            <Button className="w-full" onClick={onClose}>Done</Button>
          </div>
        )}
      </div>
    </div>
  );
}
