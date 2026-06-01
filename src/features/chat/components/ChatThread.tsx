"use client";

import { ThumbsUp, ThumbsDown, RotateCw, Copy, MoreHorizontal, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ChatState } from "@/features/chat/hooks/useChat";

type Props = Pick<ChatState, "messages" | "threadRef">;

export function ChatThread({ messages, threadRef }: Props) {
  return (
    <div ref={threadRef} className="relative z-10 flex-1 overflow-y-auto px-6 pt-[72px] pb-6 scroll-smooth">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold text-[#34322d] dark:text-white">What can I do for you?</h1>
        </div>
      ) : (
        <TooltipProvider delayDuration={300}>
          <div className="max-w-[800px] mx-auto flex flex-col gap-8 pb-10">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col w-full group/msg", m.role === "user" ? "items-end" : "items-start")}>
                {m.role === "assistant" ? (
                  <div className="w-full flex flex-col max-w-[90%] md:max-w-[85%]">
                    <div className="text-[16px] font-normal text-black dark:text-[#f0f0f0] leading-[28px] whitespace-pre-wrap">
                      {m.text}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-[#8c8c8c] hover:text-black dark:hover:text-[#f0f0f0] transition-colors">
                            <ThumbsUp className="w-[18px] h-[18px]" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Good response</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-[#8c8c8c] hover:text-black dark:hover:text-[#f0f0f0] transition-colors">
                            <ThumbsDown className="w-[18px] h-[18px]" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Bad response</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-[#8c8c8c] hover:text-black dark:hover:text-[#f0f0f0] transition-colors">
                            <RotateCw className="w-[18px] h-[18px]" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Regenerate</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-[#8c8c8c] hover:text-black dark:hover:text-[#f0f0f0] transition-colors">
                            <Copy className="w-[18px] h-[18px]" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Copy</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-[#8c8c8c] hover:text-black dark:hover:text-[#f0f0f0] transition-colors">
                            <MoreHorizontal className="w-[18px] h-[18px]" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>More options</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-end max-w-[90%] md:max-w-[85%] relative">
                    <div className="bg-[#f0f0f0] dark:bg-[#1f1f1f] text-[16px] font-normal text-[#1f1f1f] dark:text-[#f0f0f0] px-[20px] py-[16px] rounded-[24px] leading-[28px] whitespace-pre-wrap">
                      {m.text}
                    </div>
                    {/* User Actions - Rendered but invisible until hover */}
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="w-[36px] h-[36px] rounded-full bg-[#f4f3ef] dark:bg-[#1a1a1a] flex items-center justify-center text-[#8c8c8c] hover:text-black dark:hover:text-[#f0f0f0] transition-colors">
                            <Copy className="w-[16px] h-[16px]" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Copy</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="w-[36px] h-[36px] rounded-full bg-[#f4f3ef] dark:bg-[#1a1a1a] flex items-center justify-center text-[#8c8c8c] hover:text-black dark:hover:text-[#f0f0f0] transition-colors">
                            <PenLine className="w-[16px] h-[16px]" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
}
