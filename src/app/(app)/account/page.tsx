"use client";
import { useRouter } from "next/navigation";
import { AccountSettings } from "@/features/account/components/AccountSettings";

export default function AccountPage() {
  const router = useRouter();
  return (
    <div className="h-full flex items-center justify-center p-6 bg-[#f8f8f7] dark:bg-[#1a1a1a]">
      <div className="bg-[#f8f8f7] dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.08)] w-full max-w-[900px] h-[580px] flex overflow-hidden">
        <AccountSettings onClose={() => router.back()} />
      </div>
    </div>
  );
}
