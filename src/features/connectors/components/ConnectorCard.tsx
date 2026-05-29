"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Connector } from "@/features/connectors/types";

interface Props {
  connector: Connector;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function ConnectorCard({ connector, connected, onConnect, onDisconnect }: Props) {
  const isDynamic = !!connector.storageKey;

  return (
    <article className="flex flex-col gap-5 p-5 bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:border-black/20 dark:hover:border-white/[0.12] transition-colors">
      <div className={cn(
        "w-[50px] h-[50px] flex-shrink-0 rounded-xl border flex items-center justify-center overflow-hidden p-2",
        connector.iconBg
          ? `${connector.iconBg} border-transparent`
          : "border-black/[0.08] dark:border-white/[0.08] bg-[#f4f3ef] dark:bg-[#242424]"
      )}>
        <Image
          src={`/assets/icons/${connector.icon}`}
          alt={connector.title}
          width={32}
          height={32}
          className="object-contain w-full h-full"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-[#111] dark:text-white whitespace-nowrap">{connector.title}</h3>
          {isDynamic && connected && (
            <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Connected</Badge>
          )}
        </div>
        <p className="text-sm text-[#6d6c6b] dark:text-[#7f7f7f] leading-[22px]">{connector.desc}</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <Button size="sm" variant="ghost" className="text-[#6d6c6b]">Know More</Button>
        {isDynamic && connected ? (
          <button
            onClick={onDisconnect}
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] border border-red-500 text-red-500 text-sm font-medium hover:bg-red-500/[0.06] transition-colors"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="9" r="7.5" />
              <path d="M11.25 6.75 6.75 11.25M6.75 6.75l4.5 4.5" />
            </svg>
            Disconnect
          </button>
        ) : (
          <Button size="sm" onClick={onConnect}>
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12.75V2.25M4.5 8.25 9 12.75l4.5-4.5M14.25 15.75H3.75" />
            </svg>
            Connect
          </Button>
        )}
      </div>
    </article>
  );
}
