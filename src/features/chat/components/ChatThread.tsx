"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ChatState } from "@/features/chat/hooks/useChat";

type Props = Pick<ChatState, "messages" | "threadRef">;

export function ChatThread({ messages, threadRef }: Props) {
  return (
    <div ref={threadRef} className="relative z-10 flex-1 overflow-y-auto px-6 py-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold text-[#34322d] dark:text-white">What can I do for you?</h1>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <Image src="/assets/icons/zotok-logo-20.svg" alt="" width={14} height={14} />
                </div>
              )}
              <div className={cn(
                "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm",
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white dark:bg-[#242424] text-[#34322d] dark:text-[#dadada] border border-black/[0.06] dark:border-white/[0.08] rounded-bl-sm shadow-sm"
              )}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
