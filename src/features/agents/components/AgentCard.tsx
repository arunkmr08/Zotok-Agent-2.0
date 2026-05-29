"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AGENT_COLORS, AGENT_ICONS } from "@/features/agents/constants";
import type { Agent, AgentState } from "@/features/agents/types";

interface Props {
  agent: Agent;
  state: AgentState;
  onDeploy: () => void;
  onConfigure: () => void;
  onRemove: () => void;
}

export function AgentCard({ agent, state, onDeploy, onConfigure, onRemove }: Props) {
  return (
    <article className="flex flex-col bg-white dark:bg-[#1a1a1a] rounded-2xl border border-black/[0.08] dark:border-white/[0.06] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={cn("aspect-[1595/700] bg-gradient-to-br flex items-center justify-center", AGENT_COLORS[agent.key])}>
        <Image
          src={`/assets/icons/${AGENT_ICONS[agent.key]}`}
          alt={agent.title} width={64} height={64}
          className="opacity-60"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#111] dark:text-white">{agent.title}</h3>
          {state === "active" && (
            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 flex-shrink-0">Active</Badge>
          )}
        </div>
        <p className="text-sm text-[#6d6c6b] dark:text-[#7f7f7f] mb-1 flex-1">{agent.desc}</p>
        <p className="text-xs text-[#858481] mb-4">Runs: {agent.schedule}</p>
        <div className="flex items-center justify-between gap-2 mt-auto">
          {state === "active" ? (
            <>
              <Button size="sm" variant="outline" onClick={onConfigure}>
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Configure
              </Button>
              <Button size="sm" variant="destructive" onClick={onRemove}>Remove</Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={onConfigure}>Know More</Button>
              <Button size="sm" onClick={onDeploy}>
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12.75V2.25" /><path d="M4.5 8.25 9 12.75l4.5-4.5" /><path d="M14.25 15.75H3.75" />
                </svg>
                Deploy
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
