"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Connector } from "@/features/connectors/types";

interface Props {
  connector: Connector;
  connected: boolean;
  onConnect: (e: React.MouseEvent) => void;
  onDisconnect: (e: React.MouseEvent) => void;
}

export function ConnectorCard({ connector, connected, onConnect, onDisconnect }: Props) {
  const isDynamic = !!connector.storageKey;
  const showConnected = isDynamic && connected;

  return (
    <article className="connector-card-container bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.06)] flex flex-col gap-[20px] p-[21px]">

      {/* Icon + connected badge row */}
      <div className="flex items-center justify-between w-full">
        <div className={cn(
          "w-[50px] h-[50px] flex-shrink-0 rounded-[12px] border border-[#e8e6e0] dark:border-white/[0.08] flex items-center justify-center overflow-hidden p-[8px]",
          connector.iconBg ? connector.iconBg : "bg-[#f8f8f7] dark:bg-[#262626]"
        )}>
          <Image
            src={`/assets/icons/${connector.icon}`}
            alt={connector.title}
            width={34} height={34}
            className="object-contain w-full h-full"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        {showConnected && (
          <div className="flex items-center gap-[4px] bg-[#eaf8f2] border border-[#ccefe0] rounded-[8px] px-[8px] py-[6px]">
            <div className="w-[8px] h-[8px] rounded-full bg-[#249f6c] flex-shrink-0" />
            <span className="font-medium text-[12px] text-[#249f6c] tracking-[0.01px] whitespace-nowrap">Connected</span>
          </div>
        )}
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-[4px] flex-1">
        <h3 className="font-semibold text-[16px] text-[#34322d] dark:text-white tracking-[-0.18px] leading-normal whitespace-nowrap">{connector.title}</h3>
        <p className="font-normal text-[14px] text-[#858481] dark:text-[#7f7f7f] tracking-[-0.09px] leading-[22px]">{connector.desc}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between w-full">
        {/* Left — last sync or Know More */}
        {showConnected ? (
          <span className="font-normal text-[12px] text-[#8c8c8c] tracking-[-0.09px] leading-[18px] whitespace-nowrap">Last Sync: 5 min ago</span>
        ) : (
          <button className="font-semibold text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px] pl-[12px] pr-[14px] h-[34px] rounded-[8px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors">
            Know More
          </button>
        )}
        {/* Right — action button */}
        <div>
          {showConnected ? (
            <button
              onClick={(e) => onDisconnect(e)}
              className="flex items-center gap-[6px] bg-white dark:bg-transparent border border-[#dd360c] pl-[13px] pr-[15px] h-[34px] rounded-[8px] font-semibold text-[14px] text-[#dd360c] tracking-[-0.09px] leading-[18px] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Image src="/assets/icons/connector-btn-disconnect.svg" alt="" width={18} height={18} className="flex-shrink-0" unoptimized />
              Disconnect
            </button>
          ) : (
            <button
              onClick={(e) => onConnect(e)}
              className="flex items-center gap-[6px] bg-[#0067ff] hover:bg-[#0055d4] transition-colors pl-[12px] pr-[14px] h-[34px] rounded-[8px] font-semibold text-[14px] text-white tracking-[-0.09px] leading-[18px]"
            >
              <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12.75V2.25M4.5 8.25 9 12.75l4.5-4.5M14.25 15.75H3.75" />
              </svg>
              Connect
            </button>
          )}
        </div>
      </div>
    </article>

  );
}
