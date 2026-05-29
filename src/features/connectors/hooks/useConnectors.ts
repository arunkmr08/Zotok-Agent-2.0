"use client";

import { useState, useEffect } from "react";
import { CONNECTORS } from "@/features/connectors/constants";
import type { ConnectorKey } from "@/features/connectors/types";

export function useConnectors() {
  const [gsheetsConnected, setGsheetsConnected] = useState(false);
  const [zotokConnected, setZotokConnected] = useState(false);
  const [gsheetsModal, setGsheetsModal] = useState(false);
  const [zotokModal, setZotokModal] = useState(false);
  const [disconnectTarget, setDisconnectTarget] = useState<"gsheets" | "zotok" | null>(null);

  useEffect(() => {
    setGsheetsConnected(localStorage.getItem("zotok_gsheets_connected") === "true");
    setZotokConnected(localStorage.getItem("zotok_atc_connected") === "true");
  }, []);

  function handleDisconnect() {
    if (disconnectTarget === "gsheets") {
      localStorage.removeItem("zotok_gsheets_connected");
      setGsheetsConnected(false);
    } else if (disconnectTarget === "zotok") {
      localStorage.removeItem("zotok_atc_connected");
      setZotokConnected(false);
    }
    setDisconnectTarget(null);
  }

  function getConnected(key: ConnectorKey): boolean {
    if (key === "gsheets") return gsheetsConnected;
    if (key === "zotok") return zotokConnected;
    return false;
  }

  function handleConnect(key: ConnectorKey) {
    if (key === "gsheets") setGsheetsModal(true);
    else if (key === "zotok") setZotokModal(true);
  }

  function handleDisconnectRequest(key: ConnectorKey) {
    if (key === "gsheets" || key === "zotok") setDisconnectTarget(key);
  }

  function handleGsheetsConnected() {
    setGsheetsConnected(true);
    localStorage.setItem("zotok_gsheets_connected", "true");
    setGsheetsModal(false);
  }

  function handleZotokConnected() {
    setZotokConnected(true);
    localStorage.setItem("zotok_atc_connected", "true");
    setZotokModal(false);
  }

  return {
    connectors: CONNECTORS,
    gsheetsConnected,
    zotokConnected,
    gsheetsModal, setGsheetsModal,
    zotokModal, setZotokModal,
    disconnectTarget, setDisconnectTarget,
    handleDisconnect,
    getConnected,
    handleConnect,
    handleDisconnectRequest,
    handleGsheetsConnected,
    handleZotokConnected,
  };
}

export type ConnectorsState = ReturnType<typeof useConnectors>;
