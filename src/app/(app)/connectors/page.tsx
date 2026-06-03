"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useConnectors } from "@/features/connectors/hooks/useConnectors";
import { ConnectorCard } from "@/features/connectors/components/ConnectorCard";
import { ConnectModal } from "@/features/connectors/components/ConnectModal";
import { DisconnectDialog } from "@/features/connectors/components/DisconnectDialog";

const springEnter = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    duration: 0.3,
    delay,
  },
});

const FEATURE_CHIPS = [
  {
    icon: "/assets/icons/icon-chip-secure.svg",
    label: "Secure & Reliable",
  },
  {
    icon: "/assets/icons/icon-chip-sync.svg",
    label: "Real Time Data Sync",
  },
  {
    icon: "/assets/icons/icon-chip-noupload.svg",
    label: "No Manual Uploads",
  },
];

export default function ConnectorsPage() {
  const state = useConnectors();
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  return (
    <>
      <div className="h-full overflow-y-auto bg-[#f9f9f9] dark:bg-[#111]">

        {/* ── Hero ── */}
        <div className="bg-gradient-to-r from-white to-[#ebfff7] dark:from-[#141414] dark:to-[#0d1f18] px-[80px] py-[52px] flex items-center gap-[60px]">
          <div className="flex-1 flex flex-col gap-[16px]">

            {/* Tag */}
            <motion.div {...springEnter(0)} className="self-start flex items-center gap-[4px] bg-[#eaf8f2] border border-[#ccefe0] rounded-[8px] px-[8px] py-[6px]">
              <svg className="w-[18px] h-[18px] flex-shrink-0 text-[#249f6c]" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9a6 6 0 1 0 12 0A6 6 0 0 0 3 9zM9 6v3l2 2" />
              </svg>
              <span className="font-semibold text-[12px] text-[#249f6c] tracking-[0.01px] whitespace-nowrap">Data Connectors</span>
            </motion.div>

            {/* Headline */}
            <motion.div {...springEnter(0.07)} className="flex flex-col font-semibold text-[40px] tracking-[-0.6px] leading-[1.1]">
              <span className="text-[#262626] dark:text-white">Connect Your</span>
              <span className="text-[#249f6c]">Business Systems</span>
            </motion.div>

            {/* Subtext */}
            <motion.p {...springEnter(0.12)} className="font-normal text-[16px] text-[#595959] dark:text-[#8c8c8c] tracking-[-0.18px] leading-[26px] max-w-[440px]">
              Automatically sync products, customers, invoices, payments and orders from the tools your team already uses.
            </motion.p>

            {/* Feature chips */}
            <motion.div {...springEnter(0.17)} className="flex items-center gap-[10px] flex-wrap">
              {FEATURE_CHIPS.map((chip) => (
                <div key={chip.label} className="flex items-center gap-[8px] border border-[#d9d9d9] dark:border-white/[0.12] rounded-[8px] px-[8px] py-[6px] h-[30px]">
                  <Image src={chip.icon} alt={chip.label} width={20} height={20} unoptimized />
                  <span className="font-medium text-[12px] text-[#262626] dark:text-[#d9d9d9] tracking-[0.01px] whitespace-nowrap">{chip.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div {...springEnter(0.21)} className="pt-[4px]">
              <button className="flex items-center gap-[6px] bg-[#0067ff] hover:bg-[#0055d4] transition-colors pl-[12px] pr-[14px] py-[8px] rounded-[8px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px]">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="9" r="7" /><path d="M6 9h6M9 6l3 3-3 3" />
                </svg>
                View Connector
              </button>
            </motion.div>
          </div>

          {/* Hero illustration */}
          <motion.div {...springEnter(0.1)} className="flex-shrink-0 w-[507px] h-[338px]">
            <Image
              src="/assets/images/connectors-hero.png"
              alt="Connectors illustration"
              width={507} height={338}
              className="w-full h-full object-contain"
              unoptimized
            />
          </motion.div>
        </div>

        {/* ── Cards section ── */}
        <div className="flex flex-col py-[60px]">
          <motion.p {...springEnter(0)} className="font-semibold text-[18px] text-[#262626] dark:text-white tracking-[-0.3px] px-[80px] pb-[20px]">
            All Connectors
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] px-[80px] pb-[40px]">
            {state.connectors.map((connector, i) => (
              <motion.div key={connector.key} {...springEnter(0.06 + i * 0.07)}>
                <ConnectorCard
                  connector={connector}
                  connected={state.getConnected(connector.key)}
                  onConnect={(e) => {
                    const card = e.currentTarget.closest(".connector-card-container");
                    if (card) {
                      setTriggerRect(card.getBoundingClientRect());
                    }
                    state.handleConnect(connector.key);
                  }}
                  onDisconnect={(e) => {
                    const card = e.currentTarget.closest(".connector-card-container");
                    if (card) {
                      setTriggerRect(card.getBoundingClientRect());
                    }
                    state.handleDisconnectRequest(connector.key);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      <ConnectModal
        open={state.gsheetsModal}
        triggerRect={triggerRect}
        onClose={() => state.setGsheetsModal(false)}
        onDone={state.handleGsheetsConnected}
        title="Configure Collect New Leads"
        desc="Detect unknown contacts and extract lead information. Configure the columns below."
        ctaLabel="Continue In Google"
        leftIcon={
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={22} height={22} />
          </div>
        }
        rightIcon={
          <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/icon-google-sheets-sm.png" alt="Sheets" width={22} height={28} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        }
        successTitle="Google Sheets Connected!"
        successDesc="Your Google Sheets account is now connected. Lead data will sync automatically to your configured sheet."
      />
      <ConnectModal
        open={state.zotokModal}
        triggerRect={triggerRect}
        onClose={() => state.setZotokModal(false)}
        onDone={state.handleZotokConnected}
        title="Connect to Zotok"
        desc="Push leads detected from your WhatsApp groups directly into Zotok campaigns for automated follow-ups."
        ctaLabel="Continue In Zotok"
        leftIcon={
          <div className="w-10 h-10 rounded-lg bg-[#589981] flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={22} height={22} />
          </div>
        }
        rightIcon={
          <div className="w-10 h-10 rounded-lg bg-[#589981] flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={22} height={22} />
          </div>
        }
        successTitle="Zotok Connected!"
        successDesc="Group Sense is now connected to Zotok. Detected leads will be pushed to your campaigns automatically."
      />
      <DisconnectDialog
        open={!!state.disconnectTarget}
        triggerRect={triggerRect}
        disconnectTarget={state.disconnectTarget}
        setDisconnectTarget={state.setDisconnectTarget}
        handleDisconnect={state.handleDisconnect}
      />
    </>
  );
}
