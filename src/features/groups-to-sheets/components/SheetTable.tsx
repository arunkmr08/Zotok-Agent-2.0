"use client";

import { COL_LABELS, VISIBLE_COLS } from "@/features/groups-to-sheets/constants";
import { ColValue } from "@/features/groups-to-sheets/components/ColValue";
import { TablePagination } from "@/components/ui/table-pagination";
import type { GroupsToSheetsState } from "@/features/groups-to-sheets/hooks/useGroupsToSheets";

type Props = Pick<GroupsToSheetsState, "sheet" | "pagedRows" | "page" | "perPage" | "totalPages" | "totalRows" | "setPage" | "setPerPage">;

export function SheetTable({ sheet, pagedRows, page, perPage, totalPages, totalRows, setPage, setPerPage }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08] dark:border-white/[0.06] flex-shrink-0">
        <div>
          <h1 className="text-base font-semibold text-[#111] dark:text-white">
            {sheet.icon} {sheet.name}
          </h1>
          <p className="text-sm text-[#6d6c6b]">{totalRows} rows</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-[#6d6c6b] dark:text-[#7f7f7f] hover:border-black/[0.12] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 2v10M4 8l4 4 4-4M2 14h12" /></svg>
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors font-medium">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="12" height="12" rx="1.5" /><path d="M5 8h6M8 5v6" /></svg>
            Open in Sheets
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-[#f4f3ef] dark:bg-[#242424] sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-[#858481] text-xs w-8">#</th>
              {VISIBLE_COLS.map((col) => (
                <th key={col} className="px-4 py-3 text-left font-medium text-[#6d6c6b] whitespace-nowrap text-xs uppercase tracking-wider">
                  {COL_LABELS[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            {pagedRows.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-[#f4f3ef] dark:hover:bg-[#2a2a2a] transition-colors"
              >
                <td className="px-4 py-3 text-[#858481] text-xs">{(page - 1) * perPage + i + 1}</td>
                {VISIBLE_COLS.map((col) => (
                  <td key={col} className="px-4 py-3">
                    <ColValue col={col} row={row} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={page}
        perPage={perPage}
        total={totalRows}
        totalPages={totalPages}
        setPage={setPage}
        setPerPage={setPerPage}
      />
    </div>
  );
}
