"use client";

import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/layout/app-layout";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { LeadsHeader } from "@/features/leads/components/LeadsHeader";
import { BulkBar } from "@/features/leads/components/BulkBar";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { ChatFlyout } from "@/features/leads/components/ChatFlyout";
import { CampaignModal } from "@/features/leads/components/CampaignModal";

export default function LeadsViewPage() {
  const state = useLeads();

  return (
    <AppLayout>
      <div className={cn("h-full flex flex-col overflow-hidden", state.flyoutLead && "pr-[380px]")}>
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
        <BulkBar selected={state.selected} setSelected={state.setSelected} />
        <LeadsTable
          filtered={state.filtered}
          selected={state.selected}
          toggleAll={state.toggleAll}
          toggleOne={state.toggleOne}
          setFlyoutLead={state.setFlyoutLead}
          setCampaignLead={state.setCampaignLead}
        />
      </div>

      {state.flyoutLead && <ChatFlyout lead={state.flyoutLead} onClose={() => state.setFlyoutLead(null)} />}
      <CampaignModal lead={state.campaignLead} onClose={() => state.setCampaignLead(null)} />
    </AppLayout>
  );
}
