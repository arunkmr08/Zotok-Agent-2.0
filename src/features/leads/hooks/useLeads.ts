"use client";

import { useState, useRef, useEffect } from "react";
import { DATE_GROUPS, ALL_DATES } from "@/features/leads/constants";
import type { Lead } from "@/features/leads/types";

export function useLeads() {
  const [selectedDate, setSelectedDate] = useState("Today");
  const [dateOpen, setDateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [flyoutLead, setFlyoutLead] = useState<Lead | null>(null);
  const [campaignLead, setCampaignLead] = useState<Lead | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDateOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const group = DATE_GROUPS.find((g) => g.label === selectedDate)!;
  const filtered = group.leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.mobile.includes(search) ||
      l.location.toLowerCase().includes(search.toLowerCase())
  );

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((l) => l.id)));
  }

  function toggleOne(id: number) {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  }

  function selectDate(date: string) {
    setSelectedDate(date);
    setDateOpen(false);
    setSelected(new Set());
  }

  return {
    selectedDate,
    dateOpen, setDateOpen,
    search, setSearch,
    selected, setSelected,
    flyoutLead, setFlyoutLead,
    campaignLead, setCampaignLead,
    dropRef,
    group,
    filtered,
    allDates: ALL_DATES,
    toggleAll,
    toggleOne,
    selectDate,
  };
}

export type LeadsState = ReturnType<typeof useLeads>;
