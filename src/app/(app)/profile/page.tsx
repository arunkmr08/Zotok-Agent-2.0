"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { ProfileCard } from "@/features/profile/components/ProfileCard";
import { UpgradeCard } from "@/features/profile/components/UpgradeCard";
import { AccountCard } from "@/features/profile/components/AccountCard";

export default function ProfilePage() {
  const profile = useProfile();

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto">
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
          <div className="absolute top-[-10%] right-[10%] w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute bottom-[5%] left-[5%] w-96 h-96 rounded-full bg-violet-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 flex flex-col gap-6">
          <ProfileCard kvItems={profile.kvItems} />
          <UpgradeCard proFeatures={profile.proFeatures} />
          <AccountCard />
        </div>
      </div>
    </AppLayout>
  );
}
