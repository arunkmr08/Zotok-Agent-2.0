"use client";

import Image from "next/image";
import { AppLayout } from "@/components/layout/app-layout";
import { useChat } from "@/features/chat/hooks/useChat";
import { ChatThread } from "@/features/chat/components/ChatThread";
import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { ConnectWaModal } from "@/features/chat/components/ConnectWaModal";
import { HistoryModal } from "@/features/chat/components/HistoryModal";
import { GroupsModal } from "@/features/chat/components/GroupsModal";

export default function ChatPage() {
  const state = useChat();

  return (
    <AppLayout>
      <div className="relative flex flex-col h-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
          <div className="absolute top-[-10%] left-[20%] w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-purple-400/10 blur-3xl" />
          <div className="absolute top-[40%] left-[50%] w-64 h-64 rounded-full bg-pink-400/[0.08] blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center px-6 py-3 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm">
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
        />
      </div>

      <ConnectWaModal
        connectModal={state.connectModal}
        setConnectModal={state.setConnectModal}
        handleSimulateConnect={state.handleSimulateConnect}
      />
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
      <GroupsModal
        groupsModal={state.groupsModal}
        setGroupsModal={state.setGroupsModal}
        syncing={state.syncing}
        setSyncing={state.setSyncing}
        groupSearch={state.groupSearch}
        setGroupSearch={state.setGroupSearch}
        selectedGroups={state.selectedGroups}
        toggleGroup={state.toggleGroup}
        filteredGroups={state.filteredGroups}
      />
    </AppLayout>
  );
}
