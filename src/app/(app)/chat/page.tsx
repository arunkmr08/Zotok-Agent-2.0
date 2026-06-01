"use client";

import Image from "next/image";
import { useChat } from "@/features/chat/hooks/useChat";
import { ChatThread } from "@/features/chat/components/ChatThread";
import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { ChatHero } from "@/features/chat/components/ChatHero";
import { HistoryModal } from "@/features/chat/components/HistoryModal";

export default function ChatPage() {
  const state = useChat();
  const noMessages = state.messages.length === 0;

  return (
    <>
      <div className="relative flex flex-col h-full overflow-hidden bg-[#f9f9f9] dark:bg-[#141414]">
        {/* Dark theme background: blue blob + dark frosted overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          {/* Blue blob — both modes, centered */}
          <div
            className="blob-pulse absolute left-1/2 top-1/2 w-[798px] h-[441px] rounded-full"
            style={{ background: "rgba(0,103,255,0.6)" }}
          />
          {/* Overlay — light: white wash, dark: dark frosted */}
          <div
            className="absolute inset-0 bg-white/70 dark:bg-black/60 backdrop-blur-[100px]"
          />
        </div>

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
          />
          </div>
        ) : (
          /* ── Thread state: model header + messages + bottom composer ── */
          <>
            <div className="relative z-10 flex items-center px-6 py-3 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm flex-shrink-0">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-sm text-[#34322d] dark:text-[#adadad] hover:bg-[#f4f3ef] dark:hover:bg-[#242424] transition-colors">
                <span>Google 3.1 Flash</span>
                <Image src="/assets/icons/icon-chevron-down.svg" alt="" width={14} height={14} />
              </button>
            </div>
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
