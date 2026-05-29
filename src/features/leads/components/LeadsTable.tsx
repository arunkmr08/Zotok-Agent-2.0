"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LeadsState } from "@/features/leads/hooks/useLeads";

type Props = Pick<LeadsState, "filtered" | "selected" | "toggleAll" | "toggleOne" | "setFlyoutLead" | "setCampaignLead">;

export function LeadsTable({ filtered, selected, toggleAll, toggleOne, setFlyoutLead, setCampaignLead }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#f4f3ef] dark:bg-[#242424] sticky top-0 z-10">
          <tr>
            <th className="w-10 px-4 py-3 text-left">
              <input
                type="checkbox"
                className="accent-blue-500"
                checked={filtered.length > 0 && selected.size === filtered.length}
                onChange={toggleAll}
              />
            </th>
            <th className="px-4 py-3 text-left font-medium text-[#6d6c6b] whitespace-nowrap">Customer Name</th>
            <th className="px-4 py-3 text-left font-medium text-[#6d6c6b] whitespace-nowrap">Mobile Number</th>
            <th className="px-4 py-3 text-left font-medium text-[#6d6c6b] whitespace-nowrap">Location</th>
            <th className="px-4 py-3 text-left font-medium text-[#6d6c6b]">Summary</th>
            <th className="px-4 py-3 text-right font-medium text-[#6d6c6b] whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
          {filtered.map((lead) => (
            <tr
              key={lead.id}
              className={cn(
                "transition-colors",
                selected.has(lead.id) ? "bg-blue-50 dark:bg-blue-950/40" : "bg-white dark:bg-[#1a1a1a] hover:bg-[#f4f3ef] dark:hover:bg-[#2a2a2a]"
              )}
            >
              <td className="px-4 py-3">
                <input type="checkbox" className="accent-blue-500" checked={selected.has(lead.id)} onChange={() => toggleOne(lead.id)} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: lead.color }}>
                    {lead.avatar}
                  </div>
                  <span className="font-medium text-[#34322d] dark:text-[#dadada] whitespace-nowrap">{lead.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-[#6d6c6b] dark:text-[#7f7f7f] whitespace-nowrap">{lead.mobile}</td>
              <td className="px-4 py-3 text-[#6d6c6b] dark:text-[#7f7f7f] whitespace-nowrap">{lead.location}</td>
              <td className="px-4 py-3 text-[#6d6c6b] dark:text-[#7f7f7f] max-w-xs truncate">{lead.summary}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setFlyoutLead(lead)}>View</Button>
                  <Button size="sm" onClick={() => setCampaignLead(lead)}>+ Campaign</Button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#858481]">No leads match your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
