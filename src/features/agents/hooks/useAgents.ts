"use client";

import { useState, useEffect } from "react";
import { AGENTS } from "@/features/agents/constants";
import type { AgentKey, AgentState } from "@/features/agents/types";

export function useAgents() {
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<Record<AgentKey, AgentState>>({
    category: "inactive",
    leads: "inactive",
    sheets: "inactive",
  });
  const [openModal, setOpenModal] = useState<AgentKey | null>(null);
  const [removeKey, setRemoveKey] = useState<AgentKey | null>(null);

  useEffect(() => {
    const s: Record<AgentKey, AgentState> = { category: "inactive", leads: "inactive", sheets: "inactive" };
    (["category", "leads", "sheets"] as AgentKey[]).forEach((k) => {
      const stored = localStorage.getItem(`zotok_agent_${k}`);
      if (stored === "active") s[k] = "active";
    });
    setStates(s);
    setTimeout(() => setLoading(false), 400);
  }, []);

  function deploy(key: AgentKey) {
    setStates((p) => ({ ...p, [key]: "active" }));
    localStorage.setItem(`zotok_agent_${key}`, "active");
  }

  function remove(key: AgentKey) {
    setStates((p) => ({ ...p, [key]: "inactive" }));
    localStorage.setItem(`zotok_agent_${key}`, "inactive");
    setRemoveKey(null);
  }

  const removeTargetTitle = removeKey ? AGENTS.find((a) => a.key === removeKey)?.title ?? "" : "";

  return {
    loading,
    states,
    openModal, setOpenModal,
    removeKey, setRemoveKey,
    removeTargetTitle,
    agents: AGENTS,
    deploy,
    remove,
  };
}

export type AgentsState = ReturnType<typeof useAgents>;
