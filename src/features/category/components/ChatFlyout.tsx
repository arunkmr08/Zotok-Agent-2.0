"use client";

import { cn } from "@/lib/utils";
import { FLYOUT_HISTORY } from "@/features/category/constants";
import type { Message } from "@/features/category/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  msg: Message;
  onClose: () => void;
}

export function ChatFlyout({ msg, onClose }: Props) {
  const history = FLYOUT_HISTORY[msg.group] ?? [];

  return (
    <div className="fixed inset-y-0 right-0 w-[380px] bg-white dark:bg-[#1a1a1a] border-l border-black/[0.08] dark:border-white/[0.06] flex flex-col z-40 shadow-2xl">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: msg.groupColor }}
        >
          {msg.groupAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#111] dark:text-white truncate">{msg.group}</p>
          <p className="text-xs text-[#858481]">Group thread</p>
        </div>
        <TooltipProvider delay={300}>
          <Tooltip>
            <TooltipTrigger render={<button onClick={onClose} className="p-1.5 rounded-md hover:bg-[#ecebea] dark:hover:bg-[#242424] text-[#858481]" />}>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>Close</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="px-3 py-2 rounded-xl bg-[#ecebea] dark:bg-[#242424] text-sm text-[#34322d] dark:text-[#adadad] border-l-4 border-blue-400">
          <p className="text-xs text-[#858481] mb-1">{msg.sender} · {msg.time}</p>
          {msg.text}
        </div>
        {history.map((h, i) => (
          <div key={i} className={cn("flex", h.from === "You" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[72%] px-3 py-2 rounded-2xl text-sm",
              h.from === "You"
                ? "bg-blue-500 text-white rounded-br-sm"
                : "bg-[#ecebea] dark:bg-[#242424] text-[#34322d] dark:text-[#dadada] rounded-bl-sm"
            )}>
              {h.from !== "You" && <p className="text-[10px] font-semibold opacity-60 mb-0.5">{h.from}</p>}
              {h.text}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-black/[0.06] dark:border-white/[0.06]">
        <TooltipProvider delay={300}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              className="w-full pl-3 pr-8 h-[40px] text-sm rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-[#f4f3ef] dark:bg-[#242424] text-[#34322d] dark:text-[#dadada] placeholder:text-[#858481] outline-none focus:border-blue-400"
              placeholder="Reply…"
            />
            <Tooltip>
              <TooltipTrigger render={
                <button className="absolute right-2 top-1/2 -translate-y-1/2 h-[26px] px-[6px] flex items-center gap-[3px] rounded-md transition-all duration-200 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #0067ff 0%, #8c3cff 100%)", boxShadow: "0 2px 8px rgba(0,103,255,0.3)" }}
                />
              }>
                <svg className="w-[10px] h-[10px] text-white flex-shrink-0" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 0l1.2 3.8L11 5l-3.8 1.2L6 10l-1.2-3.8L1 5l3.8-1.2z"/>
                </svg>
                <span className="text-white font-semibold text-[10px] tracking-[0.02px] leading-none">AI</span>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>Generate with AI</TooltipContent>
            </Tooltip>
          </div>
            <Tooltip>
              <TooltipTrigger render={
                <button
                  className="w-[40px] h-[40px] rounded-full bg-[#0067ff] hover:bg-[#0055d4] flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{ boxShadow: "0 4px 14px rgba(0,103,255,0.45), 0 2px 6px rgba(0,103,255,0.25)" }}
                />
              }>
                <svg className="w-[16px] h-[16px] brightness-0 invert" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 13V3M3 8l5-5 5 5" />
                </svg>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>Send</TooltipContent>
            </Tooltip>
        </div>
        </TooltipProvider>

      </div>
    </div>
  );
}
