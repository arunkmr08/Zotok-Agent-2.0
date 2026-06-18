"use client";

import Image from "next/image";
import type { Agent, AgentState } from "@/features/agents/types";

interface Props {
  agent: Agent;
  state: AgentState;
  onDeploy: (e: React.MouseEvent) => void;
  onConfigure: (e: React.MouseEvent) => void;
  onRemove: (e: React.MouseEvent) => void;
}

function CheckIcon() {
  return (
    <svg className="w-[14px] h-[14px] flex-shrink-0 text-[#595959]" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 7l3 3 6-6" />
    </svg>
  );
}

export function AgentCard({ agent, state, onDeploy, onConfigure, onRemove }: Props) {
  const isActive = state === "active";

  return (
    <article className="agent-card-container bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.06)] flex flex-col gap-[24px] pt-[5px] px-[5px] pb-[21px] h-full">

      {/* Preview image */}
      <div className="bg-[#f8f8f7] dark:bg-[#262626] rounded-[14px] overflow-hidden w-full aspect-[1595/986]">
        <Image
          src={agent.previewImage}
          alt={agent.title}
          width={1595} height={986}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-[16px] px-[16px] flex-1">

        {/* Title + description */}
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[16px] text-[#141414] dark:text-white tracking-[-0.18px] leading-normal">{agent.title}</h3>
            {isActive && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 flex-shrink-0">Active</span>
            )}
          </div>
          <p className="font-normal text-[14px] text-[#595959] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">{agent.desc}</p>
        </div>

        {/* Capabilities */}
        <div className="flex flex-col gap-[6px]">
          <p className="font-medium text-[14px] text-[#595959] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[20px]">Capabilities</p>
          <div className="flex flex-wrap gap-[6px]">
            {agent.capabilities.map((cap) => (
              <span key={cap} className="flex items-center gap-[4px] bg-[#f5f5f5] dark:bg-[#262626] border border-black/[0.06] dark:border-white/[0.06] rounded-[999px] pl-[7px] pr-[11px] py-[5px]">
                <CheckIcon />
                <span className="font-normal text-[12px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] whitespace-nowrap">{cap}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between px-[16px]">
        {isActive ? (
          <>
            <button
              onClick={(e) => onConfigure(e)}
              className="flex items-center gap-[6px] pl-[12px] pr-[14px] h-[34px] rounded-[8px] font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              Configure
            </button>
            <button
              onClick={(e) => onRemove(e)}
              className="flex items-center gap-[6px] pl-[12px] pr-[14px] h-[34px] rounded-[8px] bg-red-500 hover:bg-red-600 transition-colors font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px]"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <button
              className="flex items-center gap-[6px] pl-[12px] pr-[14px] h-[34px] rounded-[8px] font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              Know More
            </button>
            <button
              onClick={(e) => onDeploy(e)}
              className="flex items-center gap-[6px] pl-[12px] pr-[14px] h-[34px] rounded-[8px] bg-[#0067ff] hover:bg-[#0055d4] transition-colors font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px]"
            >
              <Image src="/assets/icons/Deploy.svg" alt="" width={18} height={18} className="flex-shrink-0" />
              Deploy Karamchari
            </button>
          </>
        )}
      </div>
    </article>
  );
}
