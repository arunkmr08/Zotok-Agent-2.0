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
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDateOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, selectedDate]);

  const group = DATE_GROUPS.find((g) => g.label === selectedDate)!;
  const filtered = group.leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.mobile.includes(search) ||
      l.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pagedLeads = filtered.slice((safePage - 1) * perPage, safePage * perPage);

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
    setPage(1);
  }

  function setPageSafe(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }

  function setPerPageAndReset(n: number) {
    setPerPage(n);
    setPage(1);
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
    pagedLeads,
    allDates: ALL_DATES,
    toggleAll,
    toggleOne,
    selectDate,
    page: safePage,
    perPage,
    totalPages,
    totalLeads: filtered.length,
    setPage: setPageSafe,
    setPerPage: setPerPageAndReset,
  };
}

export type LeadsState = ReturnType<typeof useLeads>;
