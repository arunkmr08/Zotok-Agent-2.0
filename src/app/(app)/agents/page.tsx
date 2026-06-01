"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { AgentCard } from "@/features/agents/components/AgentCard";
import { CategoryModal } from "@/features/agents/components/CategoryModal";
import { LeadsModal } from "@/features/agents/components/LeadsModal";
import { SheetsModal } from "@/features/agents/components/SheetsModal";
import { RemoveDialog } from "@/features/agents/components/RemoveDialog";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" as const, delay },
});

const WHY_ITEMS = [
  {
    icon: "/assets/icons/icon-why-ai.svg",
    iconBg: "bg-[#f4ecff] dark:bg-[#2d1a4a]",
    iconBorder: "border-[#ceabff] dark:border-[#6b3fa0]",
    title: "AI That Understands",
    desc: "Identify intent, detects priority, and takes action.",
  },
  {
    icon: "/assets/icons/icon-why-247.svg",
    iconBg: "bg-[#e6f0ff] dark:bg-[#0f2040]",
    iconBorder: "border-[#91beff] dark:border-[#2a5ba0]",
    title: "Works 24/7",
    desc: "Never misses a message. Always on, always working.",
  },
  {
    icon: "/assets/icons/icon-why-plug.svg",
    iconBg: "bg-[#fff7e6] dark:bg-[#2a1f00]",
    iconBorder: "border-[#ffca5e] dark:border-[#7a5500]",
    title: "Plug & Play Deployment",
    desc: "Deploy in minutes. No code. No complex setup.",
  },
  {
    icon: "/assets/icons/icon-why-secure.svg",
    iconBg: "bg-[#eaf8f2] dark:bg-[#0a2a1a]",
    iconBorder: "border-[#a3e2c8] dark:border-[#1a6640]",
    title: "Secure & Reliable",
    desc: "Enterprise-grade security with full data privacy.",
  },
];

export default function AgentsPage() {
  const state = useAgents();

  return (
    <>
      <div className="h-full overflow-y-auto bg-[#fcfcfc] dark:bg-[#111]">

        {/* ── Hero ── */}
        <div className="bg-gradient-to-r from-white to-[#f1f5fd] dark:from-[#141414] dark:to-[#1a2035] px-[80px] py-[52px] flex items-center gap-[60px]">
          <div className="flex-1 flex flex-col gap-[16px]">
            {/* Tag */}
            <motion.div {...fadeUp(0)} className="flex items-center gap-[4px] self-start bg-[#e6f0ff] dark:bg-[#0067ff]/10 border border-[#91beff] dark:border-[#0067ff]/30 rounded-[8px] px-[8px] py-[6px]">
              <Image src="/assets/icons/icon-ai-tag.svg" alt="" width={18} height={18} unoptimized />
              <span className="font-medium text-[12px] text-[#0067ff] tracking-[0.01px] whitespace-nowrap">AI Workforce for WhatsApp Business</span>
            </motion.div>

            {/* Headline */}
            <motion.div {...fadeUp(0.07)} className="flex flex-col font-semibold text-[40px] tracking-[-0.6px] leading-[1.1]">
              <span className="text-[#262626] dark:text-white">Deploy AI Workers.</span>
              <span className="bg-gradient-to-r from-[#0067ff] to-[#8c3cff] bg-clip-text text-transparent">Run Operations on Autopilot.</span>
            </motion.div>

            {/* Subtext */}
            <motion.p {...fadeUp(0.12)} className="font-normal text-[16px] text-[#595959] dark:text-[#8c8c8c] tracking-[-0.18px] leading-[26px] max-w-[480px]">
              Karamcharis are AI employees that categorize messages, collect leads, sync data, and automate your WhatsApp operations 24/7.
            </motion.p>

            {/* CTA buttons */}
            <motion.div {...fadeUp(0.17)} className="flex items-center gap-[12px] pt-[4px]">
              <button
                onClick={() => {
                  document.getElementById("choose-karamchari")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-[6px] pl-[12px] pr-[14px] py-[8px] rounded-[8px] bg-[#0067ff] hover:bg-[#0055d4] transition-colors font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px]"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
                  <path d="M9.75 2.25C9.75 2.25 13.5 3 14.25 6.75C15 10.5 12.75 13.5 9 15C5.25 13.5 3 10.5 3.75 6.75C4.5 3 8.25 2.25 8.25 2.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="8.25" r="1.5" fill="white"/>
                  <path d="M9 9.75V12.75" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Deploy Now
              </button>
              <button className="flex items-center gap-[8px] font-medium text-[14px] text-[#595959] dark:text-[#8c8c8c] tracking-[-0.33px] leading-[16px] hover:text-[#141414] dark:hover:text-white transition-colors">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.25"/>
                  <path d="M7.5 6.5l4.5 2.5-4.5 2.5V6.5z" fill="currentColor"/>
                </svg>
                Watch how it works
              </button>
            </motion.div>
          </div>

          {/* Hero illustration */}
          <motion.div {...fadeUp(0.1)} className="flex-shrink-0 w-[366px] h-[366px]">
            <Image
              src="/assets/images/karamchari-hero.png"
              alt="AI Karamchari"
              width={366} height={366}
              className="w-full h-full object-contain"
              unoptimized
            />
          </motion.div>
        </div>

        {/* ── Cards section ── */}
        <div id="choose-karamchari" className="px-[80px] py-[60px] flex flex-col gap-[20px]">
          <motion.p {...fadeUp(0)} className="font-semibold text-[18px] text-[#262626] dark:text-white tracking-[-0.3px]">
            Choose an AI Karamchari
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            {state.agents.map((agent, i) => (
              <motion.div key={agent.key} {...fadeUp(0.08 + i * 0.07)}>
                <AgentCard
                  agent={agent}
                  state={state.states[agent.key]}
                  onDeploy={() => state.setOpenModal(agent.key)}
                  onConfigure={() => state.setOpenModal(agent.key)}
                  onRemove={() => state.setRemoveKey(agent.key)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Why section ── */}
        <div className="px-[80px] py-[40px]">
          <motion.div {...fadeUp(0)} className="bg-[#ebf6fd] dark:bg-[#0a1a2e] rounded-[18px] p-[24px] flex flex-col gap-[24px]">
            <p className="font-semibold text-[20px] text-[#141414] dark:text-white tracking-[-0.47px]">Why Business Love Karamcharis</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px]">
              {WHY_ITEMS.map((item, i) => (
                <motion.div key={item.title} {...fadeUp(0.06 + i * 0.06)} className="bg-white dark:bg-[#1a1a1a] rounded-[12px] p-[16px] flex items-center gap-[12px]">
                  <div className={`${item.iconBg} border-[0.5px] ${item.iconBorder} rounded-[12px] w-[60px] h-[60px] flex items-center justify-center flex-shrink-0`}>
                    <Image src={item.icon} alt={item.title} width={32} height={32} unoptimized />
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <p className="font-semibold text-[16px] text-[#141414] dark:text-white tracking-[-0.18px] leading-normal">{item.title}</p>
                    <p className="font-normal text-[14px] text-[#595959] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[22px]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      <CategoryModal open={state.openModal === "category"} onClose={() => state.setOpenModal(null)} onDeploy={() => state.deploy("category")} />
      <LeadsModal open={state.openModal === "leads"} onClose={() => state.setOpenModal(null)} onDeploy={() => state.deploy("leads")} />
      <SheetsModal open={state.openModal === "sheets"} onClose={() => state.setOpenModal(null)} onDeploy={() => state.deploy("sheets")} />
      <RemoveDialog removeKey={state.removeKey} setRemoveKey={state.setRemoveKey} removeTargetTitle={state.removeTargetTitle} remove={state.remove} />
    </>
  );
}
