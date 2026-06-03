"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TablePagination } from "@/components/ui/table-pagination";
import { cn } from "@/lib/utils";
import type { LeadsState } from "@/features/leads/hooks/useLeads";

type Props = Pick<LeadsState, "filtered" | "pagedLeads" | "selected" | "toggleAll" | "toggleOne" | "setFlyoutLead" | "setCampaignLead" | "page" | "perPage" | "totalPages" | "totalLeads" | "setPage" | "setPerPage">;

export function LeadsTable({ filtered, pagedLeads, selected, toggleAll, toggleOne, setFlyoutLead, setCampaignLead, page, perPage, totalPages, totalLeads, setPage, setPerPage }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f4f3ef] dark:bg-[#141414] sticky top-0 z-10">
            <tr>
              <th className="w-10 px-4 py-3 text-left">
                <Checkbox
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onCheckedChange={toggleAll}
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
            {pagedLeads.map((lead, i) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut", delay: 0.15 + Math.min(i * 0.03, 0.24) }}
                className={cn(
                  "transition-colors",
                  selected.has(lead.id) ? "bg-blue-50 dark:bg-blue-950/40" : "hover:bg-[#f4f3ef] dark:hover:bg-[#1e1e1e]"
                )}
              >
                <td className="px-4 py-3">
                  <Checkbox checked={selected.has(lead.id)} onCheckedChange={() => toggleOne(lead.id)} />
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
              </motion.tr>
            ))}
            {pagedLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#858481]">No leads match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={page}
        perPage={perPage}
        total={totalLeads}
        totalPages={totalPages}
        setPage={setPage}
        setPerPage={setPerPage}
      />
    </div>
  );
}
