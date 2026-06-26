"use client";

import { useState } from "react";
import { ALL_GROUPS, INITIAL_SYNCED, MAX_FREE } from "@/features/whatsapp/constants";

export function useWhatsapp() {
  const [syncedGroups, setSyncedGroups] = useState<string[]>(INITIAL_SYNCED);
  const [connectModal, setConnectModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [groupsModal, setGroupsModal] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState(false);
  const [resyncing, setResyncing] = useState(false);
  const [syncingGroups, setSyncingGroups] = useState<Record<string, "syncing" | "synced">>({});

  const [selectedHistory, setSelectedHistory] = useState<number | "custom">(7);
  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");

  const [groupSearch, setGroupSearch] = useState("");
  const [pendingGroups, setPendingGroups] = useState<Set<string>>(new Set());
  // exposed so modal components can reset pending state

  const slotsUsed = syncedGroups.length;
  const slotsLeft = MAX_FREE - syncedGroups.length;

  function handleResync() {
    setResyncing(true);
    setTimeout(() => setResyncing(false), 2000);
  }

  function handleDisconnect() {
    setSyncedGroups([]);
    setDisconnectModal(false);
  }

  function restoreGroups(groups: string[]) {
    setSyncedGroups(groups);
  }

  function handleSimulateConnect() {
    setConnectModal(false);
    setTimeout(() => setHistoryModal(true), 200);
  }

  function handleHistoryContinue() {
    setHistoryModal(false);
    setTimeout(() => setGroupsModal(true), 200);
  }

  function togglePending(name: string) {
    setPendingGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function handleSyncGroups() {
    const newGroups = Array.from(pendingGroups).filter((g) => !syncedGroups.includes(g));
    setSyncedGroups((prev) => [...newGroups, ...prev]);
    setPendingGroups(new Set());
    setGroupsModal(false);

    setSyncingGroups((prev) => {
      const next = { ...prev };
      newGroups.forEach((g) => { next[g] = "syncing"; });
      return next;
    });

    setTimeout(() => {
      setSyncingGroups((prev) => {
        const next = { ...prev };
        newGroups.forEach((g) => { if (next[g]) next[g] = "synced"; });
        return next;
      });
      setTimeout(() => {
        setSyncingGroups((prev) => {
          const next = { ...prev };
          newGroups.forEach((g) => { delete next[g]; });
          return next;
        });
      }, 1500);
    }, 3000);
  }

  function removeGroup(name: string) {
    setSyncedGroups((prev) => prev.filter((g) => g !== name));
  }

  function openAddGroups() {
    setPendingGroups(new Set());
    setGroupSearch("");
    setGroupsModal(true);
  }

  const availableToAdd = ALL_GROUPS.filter((g) => !syncedGroups.includes(g.name));
  const filteredAvailable = availableToAdd.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  return {
    syncedGroups,
    connectModal, setConnectModal,
    historyModal, setHistoryModal,
    groupsModal, setGroupsModal,
    disconnectModal, setDisconnectModal,
    resyncing,
    syncingGroups,
    selectedHistory, setSelectedHistory,
    historyFrom, setHistoryFrom,
    historyTo, setHistoryTo,
    groupSearch, setGroupSearch,
    pendingGroups, setPendingGroups,
    slotsUsed,
    slotsLeft,
    handleResync,
    handleDisconnect,
    restoreGroups,
    handleSimulateConnect,
    handleHistoryContinue,
    togglePending,
    handleSyncGroups,
    removeGroup,
    openAddGroups,
    availableToAdd,
    filteredAvailable,
    allGroups: ALL_GROUPS,
  };
}

export type WhatsappState = ReturnType<typeof useWhatsapp>;
