"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { SuccessLottie } from "@/features/chat/components/SuccessLottie";
import { PROMPT_PILLS } from "@/features/chat/constants";
import { SetupCard } from "@/features/chat/components/SetupCard";
import type { ChatState } from "@/features/chat/hooks/useChat";

type Props = Pick<ChatState,
  "input" | "setInput" | "textareaRef" | "autoResize" | "handleKeyDown" | "sendMessage" |
  "showSetupCard" | "dismissSetupCard" | "isMultiline" | "syncState" | "setInputFocused"
>;

export function ChatHero({
  input, setInput, textareaRef, autoResize, handleKeyDown, sendMessage,
  showSetupCard, dismissSetupCard, isMultiline, syncState, setInputFocused
}: Props) {
  const hasInput = input.trim().length > 0;
  const isSendDisabled = syncState !== 'hidden' || !hasInput;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">



      {/* ── Centered hero content ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto pb-[200px]">
        <div className="w-full max-w-[760px] flex flex-col items-center relative">

          {/* Title */}
          <h1 className="text-[40px] font-normal text-black dark:text-white text-center tracking-[-0.8px] leading-[48px] pb-8">
            What can I do for you?
          </h1>

          {/* ── Input container with sync row ── */}
          <div className={`w-full flex flex-col transition-all duration-700 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${syncState !== 'syncing' ? 'bg-[#86efac] dark:bg-[#064e3b]' : 'bg-[#c2dbff] dark:bg-[#003b91]'} ${syncState !== 'hidden' ? 'rounded-tl-[22px] rounded-tr-[22px] rounded-bl-[32px] rounded-br-[32px] gap-[8px] pt-[8px]' : (isMultiline ? 'rounded-[24px]' : 'rounded-[50px]') + ' gap-0 pt-0'}`}>
            {/* Sync row */}
            <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${syncState !== 'hidden' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="flex items-center gap-[8px] px-[8px]">
                  {/* Fixed-size icon slot — prevents layout shift between spinner and lottie */}
                  <div className="relative w-[36px] h-[36px] flex-shrink-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {syncState === 'syncing' ? (
                        <motion.div
                          key="spinner"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <svg
                            className="w-[20px] h-[20px] text-[#0067ff] dark:text-white animate-spin"
                            viewBox="0 0 24 24" fill="none"
                          >
                            <path d="M21 12A9 9 0 1 1 12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="lottie"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <SuccessLottie />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Text crossfade */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={syncState}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="text-[16px] font-normal text-black dark:text-[#f0f0f0] tracking-[-0.18px] whitespace-nowrap"
                    >
                      {syncState === 'syncing' ? "Please wait, we are syncing messages..." : "Messages synced successfully"}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Input area */}
            {!isMultiline ? (
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
                    className="w-[36px] h-[36px] rounded-[50px] flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: hasInput && syncState === 'hidden' ? "#0067ff" : "rgba(55,53,47,0.08)",
                      border: hasInput && syncState === 'hidden' ? "none" : "1px solid rgba(229,231,235,0.06)",
                      boxShadow: hasInput && syncState === 'hidden' ? "0 4px 14px rgba(0,103,255,0.45), 0 2px 6px rgba(0,103,255,0.25)" : "none",
                    }}
                  >
                    <Image src="/assets/icons/icon-chevron-up.svg" alt="" width={20} height={20}
                      className={hasInput && syncState === 'hidden' ? "brightness-0 invert arrow-nudge" : "dark:brightness-0 dark:invert opacity-50"}
                    />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="w-full bg-white dark:bg-[#1a1a1a] rounded-[24px] drop-shadow-[0px_3px_5px_rgba(0,0,0,0.08)] flex flex-col px-[16px] py-[12px]">
                <div className="px-1 pt-1 pb-2">
                  <textarea
                    ref={textareaRef}
                    placeholder="Ask Copilot"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); autoResize(); }}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    onKeyDown={handleKeyDown}
                    className="w-full text-[16px] font-normal bg-transparent outline-none resize-none text-black dark:text-[#f0f0f0] placeholder:text-[#8c8c8c] tracking-[-0.18px] leading-[24px]"
                    style={{ minHeight: "72px", maxHeight: "160px" }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-[26px] h-[26px] flex items-center justify-center">
                    <Image src="/assets/icons/icon-minus.svg" alt="" width={20} height={20} className="dark:brightness-0 dark:invert opacity-50" />
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <button className="flex items-center gap-[2px] text-[16px] font-medium text-[#8c8c8c] tracking-[-0.18px] whitespace-nowrap hover:text-[#595959] transition-colors">
                      <span>Gemini 3.1 Flash</span>
                      <Image src="/assets/icons/icon-chevron-down.svg" alt="" width={20} height={20} className="dark:brightness-0 dark:invert opacity-60" />
                    </button>
                    <motion.button
                      disabled={isSendDisabled}
                      onClick={() => sendMessage()}
                      className="w-[36px] h-[36px] rounded-[50px] bg-[#0067ff] flex items-center justify-center flex-shrink-0 hover:bg-[#0055d4] disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ boxShadow: hasInput && syncState === 'hidden' ? "0 4px 14px rgba(0,103,255,0.45), 0 2px 6px rgba(0,103,255,0.25)" : "none" }}
                    >
                      <Image src="/assets/icons/icon-chevron-up.svg" alt="" width={20} height={20} className={hasInput && syncState === 'hidden' ? "brightness-0 invert arrow-nudge" : "brightness-0 invert"} />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Setup card or prompt pills ── */}
          <div className={`w-full absolute top-full left-0 mt-8 transition-all duration-700 delay-150 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <AnimatePresence mode="wait">
              {showSetupCard ? (
                <SetupCard key="setup-card" onClose={dismissSetupCard} />
              ) : (
                <motion.div
                  key="prompt-pills"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex gap-3 flex-wrap justify-center"
                >
                  {PROMPT_PILLS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => sendMessage(p.label)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1a1a1a] border border-black/[0.08] dark:border-white/[0.08] text-[14px] text-[#34322d] dark:text-[#adadad] hover:bg-[#f4f3ef] dark:hover:bg-[#242424] transition-colors shadow-sm"
                    >
                      <Image
                        src={`/assets/icons/${p.icon}`} alt="" width={16} height={16}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
