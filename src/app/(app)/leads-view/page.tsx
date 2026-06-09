"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { LeadsHeader } from "@/features/leads/components/LeadsHeader";
import { BulkBar } from "@/features/leads/components/BulkBar";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { ChatFlyout } from "@/features/leads/components/ChatFlyout";
import { CampaignModal } from "@/features/leads/components/CampaignModal";

export default function LeadsViewPage() {
  const state = useLeads();

  return (
    <>
      <div className={cn("h-full flex flex-col overflow-hidden", state.flyoutLead && "pr-[380px]")}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          className="flex-shrink-0"
        >
          <LeadsHeader
            group={state.group}
            search={state.search}
            setSearch={state.setSearch}
            selectedDate={state.selectedDate}
            dateOpen={state.dateOpen}
            setDateOpen={state.setDateOpen}
            allDates={state.allDates}
            selectDate={state.selectDate}
            dropRef={state.dropRef}
          />
        </motion.div>
        <BulkBar selected={state.selected} setSelected={state.setSelected} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <LeadsTable
            filtered={state.filtered}
            pagedLeads={state.pagedLeads}
            selected={state.selected}
            toggleAll={state.toggleAll}
            toggleOne={state.toggleOne}
            setFlyoutLead={state.setFlyoutLead}
            setCampaignLead={state.setCampaignLead}
            page={state.page}
            perPage={state.perPage}
            totalPages={state.totalPages}
            totalLeads={state.totalLeads}
            setPage={state.setPage}
            setPerPage={state.setPerPage}
          />
        </motion.div>
      </div>

      {state.flyoutLead && <ChatFlyout lead={state.flyoutLead} onClose={() => state.setFlyoutLead(null)} />}
      <CampaignModal lead={state.campaignLead} onClose={() => state.setCampaignLead(null)} />
    </>
  );
}
