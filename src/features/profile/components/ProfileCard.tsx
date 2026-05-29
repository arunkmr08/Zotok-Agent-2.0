"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProfileState } from "@/features/profile/hooks/useProfile";

type Props = Pick<ProfileState, "kvItems">;

export function ProfileCard({ kvItems }: Props) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-2xl shadow-[0_8px_16px_rgba(0,0,0,0.06)] p-6">
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          RP
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold text-[#111] dark:text-white">Ravi Patel</h1>
            <Badge className="bg-[#ecebea] text-[#6d6c6b] dark:bg-[#242424] dark:text-[#adadad] text-xs">Free Plan</Badge>
          </div>
          <p className="text-sm text-[#6d6c6b] mt-0.5">ravi@patel.co</p>
        </div>
        <Button variant="outline" size="sm">Edit Profile</Button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {kvItems.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-xs text-[#858481] uppercase tracking-wide font-medium">{label}</span>
            <span className="text-sm font-medium text-[#34322d] dark:text-[#dadada]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
