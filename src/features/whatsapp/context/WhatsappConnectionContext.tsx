"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

interface WhatsappConnectionState {
  connected: boolean;
  disconnect: (groups?: string[]) => void;
  reconnect: () => void;
  reconnectModalOpen: boolean;
  setReconnectModalOpen: (open: boolean) => void;
  registerGroupsRestorer: (fn: ((groups: string[]) => void) | null) => void;
}

const WhatsappConnectionContext = createContext<WhatsappConnectionState | null>(null);

export function WhatsappConnectionProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(true);
  const [reconnectModalOpen, setReconnectModalOpenState] = useState(false);

  // Refs mirror state so the document-level click listener always reads the
  // latest value without needing to re-subscribe on every state change.
  const connectedRef = useRef(connected);
  const modalOpenRef = useRef(reconnectModalOpen);
  // Swallows the very click that triggered disconnect() so the modal doesn't
  // pop up instantly on the Logout click itself — only on the next action.
  const skipNextClickRef = useRef(false);
  // Snapshot of the synced groups taken at logout time, so reconnecting can
  // hand them back to whichever component owns the groups list right now.
  const lastGroupsRef = useRef<string[]>([]);
  const groupsRestorerRef = useRef<((groups: string[]) => void) | null>(null);

  connectedRef.current = connected;
  modalOpenRef.current = reconnectModalOpen;

  function setReconnectModalOpen(open: boolean) {
    modalOpenRef.current = open;
    setReconnectModalOpenState(open);
  }

  function registerGroupsRestorer(fn: ((groups: string[]) => void) | null) {
    groupsRestorerRef.current = fn;
  }

  function disconnect(groups: string[] = []) {
    lastGroupsRef.current = groups;
    connectedRef.current = false;
    skipNextClickRef.current = true;
    setConnected(false);
  }

  function reconnect() {
    connectedRef.current = true;
    setConnected(true);
    setReconnectModalOpen(false);
    groupsRestorerRef.current?.(lastGroupsRef.current);
  }

  useEffect(() => {
    function handleClick() {
      if (skipNextClickRef.current) {
        skipNextClickRef.current = false;
        return;
      }
      if (!connectedRef.current && !modalOpenRef.current) {
        setReconnectModalOpen(true);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <WhatsappConnectionContext.Provider value={{ connected, disconnect, reconnect, reconnectModalOpen, setReconnectModalOpen, registerGroupsRestorer }}>
      {children}
    </WhatsappConnectionContext.Provider>
  );
}

export function useWhatsappConnection() {
  const ctx = useContext(WhatsappConnectionContext);
  if (!ctx) throw new Error("useWhatsappConnection must be used within WhatsappConnectionProvider");
  return ctx;
}
