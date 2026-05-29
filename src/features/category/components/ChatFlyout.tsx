"use client";

import { cn } from "@/lib/utils";
import { FLYOUT_HISTORY } from "@/features/category/constants";
import type { Message } from "@/features/category/types";

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
        <button onClick={onClose} className="p-1.5 rounded-md hover:bg-[#ecebea] dark:hover:bg-[#242424] text-[#858481]">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>
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
        <div className="flex gap-2">
          <select className="px-3 py-2 text-xs rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-[#f4f3ef] dark:bg-[#242424] text-[#6d6c6b] dark:text-[#7f7f7f] outline-none">
            <option>+91 93883 22332</option>
          </select>
          <input
            className="flex-1 px-3 py-2 text-sm rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-[#f4f3ef] dark:bg-[#242424] text-[#34322d] dark:text-[#dadada] placeholder:text-[#858481] outline-none focus:border-blue-400"
            placeholder="Reply…"
          />
          <button className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2L2 7l5 3 3 5 4-13zM7 9l3-3" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
