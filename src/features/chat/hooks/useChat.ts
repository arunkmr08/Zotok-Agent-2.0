"use client";

import { useState, useRef, useEffect } from "react";
import { GROUPS } from "@/features/chat/constants";
import type { Message } from "@/features/chat/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connectModal, setConnectModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [groupsModal, setGroupsModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<number | "custom">(7);
  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const [waConnected, setWaConnected] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!waConnected) setConnectModal(true);
  }, [waConnected]);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages]);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: "I'm analysing your synced WhatsApp groups. Here's what I found…" }]);
    }, 800);
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
    connectModal, setConnectModal,
    historyModal, setHistoryModal,
    groupsModal, setGroupsModal,
    selectedHistory, setSelectedHistory,
    historyFrom, setHistoryFrom,
    historyTo, setHistoryTo,
    groupSearch, setGroupSearch,
    selectedGroups,
    syncing, setSyncing,
    waConnected,
    textareaRef,
    threadRef,
    autoResize,
    sendMessage,
    handleKeyDown,
    toggleGroup,
    handleSimulateConnect,
    filteredGroups,
  };
}

export type ChatState = ReturnType<typeof useChat>;
