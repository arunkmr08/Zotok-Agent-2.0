"use client";

import { Button } from "@/components/ui/button";
import type { CategoryViewState } from "@/features/category/hooks/useCategoryView";

type Props = Pick<CategoryViewState, "cat" | "msgs" | "setFlyoutMsg">;

export function CategoryTable({ cat, msgs, setFlyoutMsg }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08] dark:border-white/[0.06] bg-white dark:bg-[#1a1a1a] flex-shrink-0">
        <div>
          <h1 className="text-base font-semibold text-[#111] dark:text-white">{cat.label}</h1>
          <p className="text-sm text-[#6d6c6b]">{msgs.length} messages</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f4f3ef] dark:bg-[#242424] sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-[#6d6c6b] whitespace-nowrap">Received Time</th>
              <th className="px-4 py-3 text-left font-medium text-[#6d6c6b] whitespace-nowrap">Sent in Group / Thread</th>
              <th className="px-4 py-3 text-left font-medium text-[#6d6c6b] whitespace-nowrap">Sent By</th>
              <th className="px-4 py-3 text-left font-medium text-[#6d6c6b]">Message</th>
              <th className="px-4 py-3 text-right font-medium text-[#6d6c6b]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            {msgs.map((m) => (
              <tr key={m.id} className="bg-white dark:bg-[#1a1a1a] hover:bg-[#f4f3ef] dark:hover:bg-[#2a2a2a] transition-colors">
                <td className="px-4 py-3 text-[#6d6c6b] whitespace-nowrap">{m.time}</td>
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
    </div>
  );
}
