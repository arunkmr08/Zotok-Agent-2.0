"use client";

import { useWhatsapp } from "@/features/whatsapp/hooks/useWhatsapp";
import { PageHeader } from "@/features/whatsapp/components/PageHeader";
import { ConnectionCard } from "@/features/whatsapp/components/ConnectionCard";
import { SyncedGroupsList } from "@/features/whatsapp/components/SyncedGroupsList";
import { ConnectModal } from "@/features/whatsapp/components/ConnectModal";
import { HistoryModal } from "@/features/whatsapp/components/HistoryModal";
import { GroupsModal } from "@/features/whatsapp/components/GroupsModal";
import { DisconnectDialog } from "@/features/whatsapp/components/DisconnectDialog";

export default function WhatsAppPage() {
  const s = useWhatsapp();

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <PageHeader />
          <ConnectionCard syncedGroups={s.syncedGroups} slotsUsed={s.slotsUsed} resyncing={s.resyncing}
            handleResync={s.handleResync} setDisconnectModal={s.setDisconnectModal} setConnectModal={s.setConnectModal} />
          {s.syncedGroups.length > 0 && (
            <SyncedGroupsList syncedGroups={s.syncedGroups} slotsUsed={s.slotsUsed} slotsLeft={s.slotsLeft}
              allGroups={s.allGroups} openAddGroups={s.openAddGroups} removeGroup={s.removeGroup} />
          )}
        </div>
      </div>

      <ConnectModal connectModal={s.connectModal} setConnectModal={s.setConnectModal}
        handleSimulateConnect={s.handleSimulateConnect} />
      <HistoryModal historyModal={s.historyModal} setHistoryModal={s.setHistoryModal}
        selectedHistory={s.selectedHistory} setSelectedHistory={s.setSelectedHistory}
        historyFrom={s.historyFrom} setHistoryFrom={s.setHistoryFrom}
        historyTo={s.historyTo} setHistoryTo={s.setHistoryTo}
        handleHistoryContinue={s.handleHistoryContinue} />
      <GroupsModal groupsModal={s.groupsModal} setGroupsModal={s.setGroupsModal}
        syncing={s.syncing} setSyncing={s.setSyncing}
        groupSearch={s.groupSearch} setGroupSearch={s.setGroupSearch}
        pendingGroups={s.pendingGroups} setPendingGroups={s.setPendingGroups}
        slotsLeft={s.slotsLeft} filteredAvailable={s.filteredAvailable}
        togglePending={s.togglePending} handleSyncGroups={s.handleSyncGroups} />
      <DisconnectDialog disconnectModal={s.disconnectModal} setDisconnectModal={s.setDisconnectModal}
        handleDisconnect={s.handleDisconnect} />
    </>
  );
}
