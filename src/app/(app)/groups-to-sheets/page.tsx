"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useGroupsToSheets } from "@/features/groups-to-sheets/hooks/useGroupsToSheets";
import { SheetSidebar } from "@/features/groups-to-sheets/components/SheetSidebar";
import { SheetTable } from "@/features/groups-to-sheets/components/SheetTable";

export default function GroupsToSheetsPage() {
  const state = useGroupsToSheets();

  return (
    <AppLayout>
      <div className="h-full flex overflow-hidden">
        <SheetSidebar
          sheets={state.sheets}
          activeSheet={state.activeSheet}
          setActiveSheet={state.setActiveSheet}
        />
        <SheetTable sheet={state.sheet} />
      </div>
    </AppLayout>
  );
}
