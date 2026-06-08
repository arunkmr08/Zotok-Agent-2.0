"use client";

import { motion } from "motion/react";
import { useGroupsToSheets } from "@/features/groups-to-sheets/hooks/useGroupsToSheets";
import { SheetSidebar } from "@/features/groups-to-sheets/components/SheetSidebar";
import { SheetTable } from "@/features/groups-to-sheets/components/SheetTable";

export default function GroupsToSheetsPage() {
  const state = useGroupsToSheets();

  return (
    <div className="h-full flex overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="flex-shrink-0"
      >
        <SheetSidebar
          sheets={state.sheets}
          activeSheet={state.activeSheet}
          setActiveSheet={state.setActiveSheet}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <SheetTable
          sheet={state.sheet}
          pagedRows={state.pagedRows}
          page={state.page}
          perPage={state.perPage}
          totalPages={state.totalPages}
          totalRows={state.totalRows}
          setPage={state.setPage}
          setPerPage={state.setPerPage}
        />
      </motion.div>
    </div>
  );
}
