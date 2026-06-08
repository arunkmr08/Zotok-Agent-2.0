"use client";

import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/ui/table-pagination";
import type { CategoryViewState } from "@/features/category/hooks/useCategoryView";

type Props = Pick<CategoryViewState, "cat" | "msgs" | "setFlyoutMsg" | "page" | "perPage" | "totalPages" | "totalMsgs" | "setPage" | "setPerPage">;

export function CategoryTable({ cat, msgs, setFlyoutMsg, page, perPage, totalPages, totalMsgs, setPage, setPerPage }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08] dark:border-white/[0.06] flex-shrink-0">
        <div>
          <h1 className="text-base font-semibold text-[#111] dark:text-white">{cat.label}</h1>
          <p className="text-sm text-[#6d6c6b] dark:text-[#8c8c8c]">{totalMsgs} messages</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f4f3ef] dark:bg-[#141414] sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-[#6d6c6b] dark:text-[#8c8c8c] whitespace-nowrap">Received Time</th>
              <th className="px-4 py-3 text-left font-medium text-[#6d6c6b] dark:text-[#8c8c8c] whitespace-nowrap">Sent in Group / Thread</th>
              <th className="px-4 py-3 text-left font-medium text-[#6d6c6b] dark:text-[#8c8c8c] whitespace-nowrap">Sent By</th>
              <th className="px-4 py-3 text-left font-medium text-[#6d6c6b] dark:text-[#8c8c8c]">Message</th>
              <th className="px-4 py-3 text-right font-medium text-[#6d6c6b] dark:text-[#8c8c8c]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            {msgs.map((m, i) => (
              <tr
                key={m.id}
                onClick={() => setFlyoutMsg(m)}
                className="hover:bg-[#f4f3ef] dark:hover:bg-[#1e1e1e] transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 text-[#6d6c6b] dark:text-[#8c8c8c] whitespace-nowrap">{m.time}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ backgroundColor: m.groupColor }}
                    >
                      {m.groupAvatar}
                    </div>
                    <span className="text-[#34322d] dark:text-[#dadada] whitespace-nowrap font-medium">{m.group}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#6d6c6b] dark:text-[#7f7f7f] whitespace-nowrap">{m.sender}</td>
                <td className="px-4 py-3 text-[#6d6c6b] dark:text-[#7f7f7f] max-w-xs truncate">{m.text}</td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => setFlyoutMsg(m)}>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={page}
        perPage={perPage}
        total={totalMsgs}
        totalPages={totalPages}
        setPage={setPage}
        setPerPage={setPerPage}
      />
    </div>
  );
}
