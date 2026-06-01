"use client";

import Image from "next/image";
import { PROMPT_PILLS } from "@/features/chat/constants";
import { Button as MovingBorderBox } from "@/components/ui/moving-border";
import type { ChatState } from "@/features/chat/hooks/useChat";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Props = Pick<ChatState, "input" | "setInput" | "textareaRef" | "autoResize" | "handleKeyDown" | "sendMessage" | "messages" | "syncState">;

export function ChatComposer({ input, setInput, textareaRef, autoResize, handleKeyDown, sendMessage, messages, syncState }: Props) {
  return (
    <div className="relative z-10 px-6 pb-6 pt-2">
      <div className="max-w-2xl mx-auto">
        <MovingBorderBox
          as="div"
          borderRadius="1rem"
          duration={6000}
          containerClassName="w-full h-auto shadow-sm"
          borderClassName="h-24 w-24 bg-[radial-gradient(#0067ff_40%,transparent_60%)] opacity-80"
          className="bg-white dark:bg-[#1a1a1a] border-none p-0 h-auto w-full flex-col items-stretch"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask about your synced groups…"
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            className="w-full px-4 pt-3.5 pb-2 text-sm bg-transparent outline-none resize-none text-[#34322d] dark:text-[#dadada] placeholder:text-[#858481]"
          />
          <TooltipProvider delay={300}>
            <div className="flex items-center justify-between px-3 pb-2.5">
              <div className="flex gap-1.5">
                <Tooltip>
                  <TooltipTrigger render={<button className="p-1.5 rounded-md border border-black/[0.08] dark:border-white/[0.08] hover:bg-[#f4f3ef] dark:hover:bg-[#242424]" />}>
                    <Image src="/assets/icons/icon-minus.svg" alt="Attach" width={16} height={16} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6}>Attach</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<button className="p-1.5 rounded-md border border-black/[0.08] dark:border-white/[0.08] hover:bg-[#f4f3ef] dark:hover:bg-[#242424]" />}>
                    <Image src="/assets/icons/icon-grid.svg" alt="Browse" width={16} height={16} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6}>Browse</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-1.5">
                <Tooltip>
                  <TooltipTrigger render={<button className="p-1.5 rounded-md hover:bg-[#f4f3ef] dark:hover:bg-[#242424]" />}>
                    <Image src="/assets/icons/icon-media.svg" alt="Voice" width={16} height={16} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6}>Voice</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<button disabled={!input.trim() || syncState !== 'hidden'} onClick={() => sendMessage()} className="p-1.5 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" />}>
                    <Image src="/assets/icons/icon-chevron-up.svg" alt="Send" width={16} height={16} />
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6}>Send message</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
        </MovingBorderBox>

        {messages.length === 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {PROMPT_PILLS.map((p) => (
              <button
                key={p.id}
                onClick={() => sendMessage(p.label)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#1a1a1a] border border-black/[0.08] dark:border-white/[0.08] text-sm text-[#34322d] dark:text-[#adadad] hover:bg-[#f4f3ef] dark:hover:bg-[#242424] transition-colors shadow-sm"
              >
                <Image src={`/assets/icons/${p.icon}`} alt="" width={16} height={16} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
