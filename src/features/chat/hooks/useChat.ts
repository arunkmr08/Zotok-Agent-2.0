"use client";

import { useState, useRef, useEffect } from "react";
import { GROUPS } from "@/features/chat/constants";
import type { Message } from "@/features/chat/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showSetupCard, setShowSetupCard] = useState(true);
  const [isMultiline, setIsMultiline] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [groupsModal, setGroupsModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<number | "custom">(7);
  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const [syncState, setSyncState] = useState<'syncing' | 'success' | 'hidden'>('syncing');
  const [inputFocused, setInputFocused] = useState(false);
  const [waConnected, setWaConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!waConnected) setConnectModal(true);
  }, [waConnected]);

  useEffect(() => {
    if (syncState === 'syncing') {
      const timer = setTimeout(() => {
        setSyncState('success');
      }, 3000);
      return () => clearTimeout(timer);
    } else if (syncState === 'success') {
      const timer = setTimeout(() => {
        setSyncState('hidden');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [syncState]);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages, isGenerating]);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const multi = el.scrollHeight > 44;
    setIsMultiline(multi);
    if (multi) {
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    } else {
      el.style.height = "24px";
    }
  }

  function dismissSetupCard() {
    setShowSetupCard(false);
  }

  function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setIsMultiline(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setMessages((prev) => [...prev, { role: "assistant", text: "I'm analysing your synced WhatsApp groups. Here's what I found…" }]);
    }, 1500); // Realistic loading delay to show indicator
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function toggleGroup(name: string) {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else if (next.size < 10) next.add(name);
      return next;
    });
  }

  function handleSimulateConnect() {
    setWaConnected(true);
    setConnectModal(false);
    setHistoryModal(true);
  }

  const filteredGroups = GROUPS.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  return {
    messages,
    input, setInput,
    showSetupCard, dismissSetupCard,
    isMultiline,
    connectModal, setConnectModal,
    historyModal, setHistoryModal,
    groupsModal, setGroupsModal,
    selectedHistory, setSelectedHistory,
    historyFrom, setHistoryFrom,
    historyTo, setHistoryTo,
    groupSearch, setGroupSearch,
    selectedGroups,
    syncing, setSyncing,
    syncState, setSyncState,
    inputFocused, setInputFocused,
    waConnected,
    textareaRef,
    threadRef,
    autoResize,
    sendMessage,
    handleKeyDown,
    toggleGroup,
    handleSimulateConnect,
    filteredGroups,
    isGenerating,
  };
}

export type ChatState = ReturnType<typeof useChat>;
