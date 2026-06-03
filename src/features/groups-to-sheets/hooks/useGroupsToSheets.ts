"use client";

import { useState } from "react";
import { DEMO_SHEETS } from "@/features/groups-to-sheets/constants";

export function useGroupsToSheets() {
  const [activeSheet, setActiveSheet] = useState<string>("group-messages");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  const sheet = DEMO_SHEETS.find((s) => s.id === activeSheet)!;
  const allRows = sheet.rows;
  const totalPages = Math.max(1, Math.ceil(allRows.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pagedRows = allRows.slice((safePage - 1) * perPage, safePage * perPage);

  function handleSetActiveSheet(id: string) {
    setActiveSheet(id);
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
    activeSheet,
    setActiveSheet: handleSetActiveSheet,
    sheet,
    sheets: DEMO_SHEETS,
    pagedRows,
    page: safePage,
    perPage,
    totalPages,
    totalRows: allRows.length,
    setPage: setPageSafe,
    setPerPage: setPerPageAndReset,
  };
}

export type GroupsToSheetsState = ReturnType<typeof useGroupsToSheets>;
