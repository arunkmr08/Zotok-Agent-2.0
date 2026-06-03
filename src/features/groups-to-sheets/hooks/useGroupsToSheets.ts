"use client";

import { useState } from "react";
import { DEMO_SHEETS } from "@/features/groups-to-sheets/constants";

export function useGroupsToSheets() {
  const [activeSheet, setActiveSheet] = useState<string>("group-messages");

  const sheet = DEMO_SHEETS.find((s) => s.id === activeSheet)!;

  return {
    activeSheet,
    setActiveSheet,
    sheet,
    sheets: DEMO_SHEETS,
  };
}

export type GroupsToSheetsState = ReturnType<typeof useGroupsToSheets>;
