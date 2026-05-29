"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { AgentCard } from "@/features/agents/components/AgentCard";
import { AgentCardSkeleton } from "@/features/agents/components/AgentCardSkeleton";
import { CategoryModal } from "@/features/agents/components/CategoryModal";
import { LeadsModal } from "@/features/agents/components/LeadsModal";
import { SheetsModal } from "@/features/agents/components/SheetsModal";
import { RemoveDialog } from "@/features/agents/components/RemoveDialog";

export default function AgentsPage() {
  const state = useAgents();

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto px-8 py-8">
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
          <div className="absolute top-[-10%] left-[20%] w-72 h-72 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 mb-8">
          <h1 className="text-3xl font-bold text-[#111] dark:text-white mb-2">Karamcharis</h1>
          <div className="w-12 h-1 bg-blue-500 rounded-full mb-3" />
          <p className="text-[#6d6c6b] dark:text-[#7f7f7f] max-w-xl">
            Deploy AI-powered workers to handle business operations like message categorization, lead collection, reporting, workflow automation, and WhatsApp data management.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.loading
            ? state.agents.map((a) => <AgentCardSkeleton key={a.key} />)
            : state.agents.map((agent) => (
                <AgentCard
                  key={agent.key}
                  agent={agent}
                  state={state.states[agent.key]}
                  onDeploy={() => state.setOpenModal(agent.key)}
                  onConfigure={() => state.setOpenModal(agent.key)}
                  onRemove={() => state.setRemoveKey(agent.key)}
                />
              ))}
        </div>
      </div>

      <CategoryModal
        open={state.openModal === "category"}
        onClose={() => state.setOpenModal(null)}
        onDeploy={() => state.deploy("category")}
      />
      <LeadsModal
        open={state.openModal === "leads"}
        onClose={() => state.setOpenModal(null)}
        onDeploy={() => state.deploy("leads")}
      />
      <SheetsModal
        open={state.openModal === "sheets"}
        onClose={() => state.setOpenModal(null)}
        onDeploy={() => state.deploy("sheets")}
      />
      <RemoveDialog
        removeKey={state.removeKey}
        setRemoveKey={state.setRemoveKey}
        removeTargetTitle={state.removeTargetTitle}
        remove={state.remove}
      />
    </AppLayout>
  );
}
