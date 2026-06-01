"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useChat } from "@/features/chat/hooks/useChat";
import { ChatThread } from "@/features/chat/components/ChatThread";
import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { ChatHero } from "@/features/chat/components/ChatHero";
import { HistoryModal } from "@/features/chat/components/HistoryModal";

export default function ChatPage() {
  const state = useChat();
  const noMessages = state.messages.length === 0;

  // Thread-mode: smooth static radial glow at the bottom, intensifies on focus
  const threadGlow = !noMessages
    ? `radial-gradient(ellipse 760px ${state.inputFocused ? 220 : 160}px at 50% 100%, rgba(0,103,255,${state.inputFocused ? 0.18 : 0.1}) 0%, transparent 80%)`
    : "none";

  return (
    <>
      <div
        className="relative flex flex-col h-full overflow-hidden bg-[#f9f9f9] dark:bg-[#141414] transition-all duration-500"
        style={{ backgroundImage: threadGlow }}
      >
        {/* Hero background: blue blob + frosted overlay — only in empty state */}
        {noMessages && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
            <motion.div
              className="blob-pulse absolute rounded-full"
              animate={{
                left: "50%",
                top: "50%",
                x: "-50%",
                y: "-50%",
                width: state.inputFocused ? 900 : 798,
                height: state.inputFocused ? 520 : 441,
                opacity: 1,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ background: "rgba(0,103,255,0.6)" }}
            />
            <div className="absolute inset-0 bg-white/70 dark:bg-black/60 backdrop-blur-[100px]" />
          </div>
        )}

        {noMessages ? (
          /* ── Empty state: full-screen hero ── */
          <div className="relative flex-1 flex flex-col overflow-hidden" style={{ zIndex: 1 }}>
            <ChatHero
              input={state.input}
              setInput={state.setInput}
              textareaRef={state.textareaRef}
              autoResize={state.autoResize}
              handleKeyDown={state.handleKeyDown}
              sendMessage={state.sendMessage}
              showSetupCard={state.showSetupCard}
              dismissSetupCard={state.dismissSetupCard}
              isMultiline={state.isMultiline}
              syncState={state.syncState}
              setInputFocused={state.setInputFocused}
            />
          </div>
        ) : (
          /* ── Thread state: model header + messages + bottom composer ── */
          <>

            <ChatThread messages={state.messages} threadRef={state.threadRef} />
            <ChatComposer
              input={state.input}
              setInput={state.setInput}
              textareaRef={state.textareaRef}
              autoResize={state.autoResize}
              handleKeyDown={state.handleKeyDown}
              sendMessage={state.sendMessage}
              messages={state.messages}
              syncState={state.syncState}
              setInputFocused={state.setInputFocused}
            />
          </>
        )}
      </div>

      <HistoryModal
        historyModal={state.historyModal}
        setHistoryModal={state.setHistoryModal}
        selectedHistory={state.selectedHistory}
        setSelectedHistory={state.setSelectedHistory}
        historyFrom={state.historyFrom}
        setHistoryFrom={state.setHistoryFrom}
        historyTo={state.historyTo}
        setHistoryTo={state.setHistoryTo}
        setGroupsModal={state.setGroupsModal}
      />
    </>
  );
}
