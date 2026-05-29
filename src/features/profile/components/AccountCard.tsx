"use client";

import { Button } from "@/components/ui/button";

export function AccountCard() {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-[#34322d] dark:text-[#adadad] mb-3">Account</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada]">Sign out</p>
          <p className="text-xs text-[#858481]">Sign out of your account on this device.</p>
        </div>
        <Button variant="outline" size="sm">Sign Out</Button>
      </div>
      <div className="mt-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-red-600">Delete account</p>
          <p className="text-xs text-[#858481]">Permanently remove your account and all data.</p>
        </div>
        <Button variant="outline" size="sm" className="border-red-300 text-red-500 hover:bg-red-50">Delete</Button>
      </div>
    </div>
  );
}
