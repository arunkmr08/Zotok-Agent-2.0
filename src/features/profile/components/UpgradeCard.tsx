"use client";

import { Button } from "@/components/ui/button";
import type { ProfileState } from "@/features/profile/hooks/useProfile";

type Props = Pick<ProfileState, "proFeatures">;

export function UpgradeCard({ proFeatures }: Props) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-100 mb-1">Upgrade</p>
          <h2 className="text-xl font-bold mb-1">Go Pro</h2>
          <p className="text-sm text-blue-100 mb-4">Unlock the full power of Group Sense for your business.</p>
          <ul className="space-y-1.5 mb-5">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-blue-50">
                <svg className="w-4 h-4 text-blue-200 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm3.354-9.146a.5.5 0 0 0-.708-.708L7 8.793 5.354 7.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l4-4z" clipRule="evenodd" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-md">
            Upgrade to Pro →
          </Button>
        </div>
      </div>
    </div>
  );
}
