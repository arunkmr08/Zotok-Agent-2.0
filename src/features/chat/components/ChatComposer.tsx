"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ChatState } from "@/features/chat/hooks/useChat";

type Props = Pick<ChatState, "input" | "setInput" | "textareaRef" | "autoResize" | "handleKeyDown" | "sendMessage" | "messages" | "syncState" | "setInputFocused">;

export function ChatComposer({ input, setInput, textareaRef, autoResize, handleKeyDown, sendMessage, messages, syncState, setInputFocused }: Props) {
  const hasInput = input.trim().length > 0;
  const isSendDisabled = !hasInput || syncState !== 'hidden';

  return (
    <div className="relative z-10 px-6 pb-6 pt-2">
      <div className="max-w-[760px] mx-auto">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[50px] drop-shadow-[0px_3px_5px_rgba(0,0,0,0.08)] flex items-center gap-[12px] px-[16px] py-[12px] w-full">
          <div className="w-[26px] h-[26px] flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/icon-minus.svg" alt="" width={20} height={20} className="dark:brightness-0 dark:invert opacity-50" />
          </div>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask Copilot"
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 text-[16px] font-medium bg-transparent outline-none resize-none text-black dark:text-[#f0f0f0] placeholder:text-[#8c8c8c] tracking-[-0.18px] leading-normal"
            style={{ height: "24px", maxHeight: "24px" }}
          />
          <div className="flex items-center gap-[16px] flex-shrink-0">
            <button className="flex items-center gap-[2px] text-[16px] font-medium text-[#8c8c8c] tracking-[-0.18px] whitespace-nowrap hover:text-[#595959] transition-colors">
              <span>Gemini 3.1 Flash</span>
              <Image src="/assets/icons/icon-chevron-down.svg" alt="" width={20} height={20} className="dark:brightness-0 dark:invert opacity-60" />
            </button>
            <motion.button
              disabled={isSendDisabled}
              onClick={() => sendMessage()}
              className="w-[36px] h-[36px] rounded-[50px] flex items-center justify-center flex-shrink-0 disabled:cursor-not-allowed"
              whileHover={isSendDisabled ? undefined : { scale: 1.03 }}
              whileTap={isSendDisabled ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              style={{
                background: hasInput && syncState === 'hidden' ? "#0067ff" : "rgba(55,53,47,0.08)",
                border: hasInput && syncState === 'hidden' ? "none" : "1px solid rgba(229,231,235,0.06)",
                boxShadow: hasInput && syncState === 'hidden' ? "0 4px 14px rgba(0,103,255,0.45), 0 2px 6px rgba(0,103,255,0.25)" : "none",
              }}
            >
              <Image
                src="/assets/icons/icon-chevron-up.svg"
                alt=""
                width={20} height={20}
                className={hasInput && syncState === 'hidden' ? "brightness-0 invert arrow-nudge" : "dark:brightness-0 dark:invert opacity-50"}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
