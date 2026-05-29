"use client";

import Image from "next/image";
import { cn, toggleDark } from "@/lib/utils";
import { useLoginFlow } from "@/features/auth/hooks/useLoginFlow";
import { PhoneStep } from "@/features/auth/steps/PhoneStep";
import { OtpStep } from "@/features/auth/steps/OtpStep";
import { GstStep } from "@/features/auth/steps/GstStep";
import { GstOtpStep } from "@/features/auth/steps/GstOtpStep";
import { DetailsStep } from "@/features/auth/steps/DetailsStep";
import { WaConnectStep } from "@/features/auth/steps/WaConnectStep";
import { WaPhoneStep } from "@/features/auth/steps/WaPhoneStep";
import { WaCodeStep } from "@/features/auth/steps/WaCodeStep";
import { WaHistoryStep } from "@/features/auth/steps/WaHistoryStep";
import { WaGroupsStep } from "@/features/auth/steps/WaGroupsStep";
import { WaSyncingStep } from "@/features/auth/steps/WaSyncingStep";

export default function LoginPage() {
  const flow = useLoginFlow();
  const { step, isWide, isExtraWide } = flow;

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-[#f4f3ef] dark:bg-[#1a1a1a] px-6">
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: "scale(1.5)" }}
      >
        <source src="/assets/Generated video 1.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 pointer-events-none dark:bg-black/30"
        style={{ transform: "scale(1.15)", backdropFilter: "blur(80px)", WebkitBackdropFilter: "blur(80px)" }}
      />

      <button
        onClick={toggleDark}
        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white dark:bg-[#1f1f1f] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center hover:bg-[#f4f3ef] dark:hover:bg-[#2a2a2a] transition-colors"
        style={{ boxShadow: "rgba(17,17,17,0.02) 0px -6px 6px 0px, rgba(17,17,17,0.01) 0px -23px 9px 0px" }}
        aria-label="Toggle dark mode"
      >
        <Image src="/assets/icons/nav-theme.svg" alt="" width={18} height={18} />
      </button>

      <main
        className={cn(
          "relative z-10 bg-white dark:bg-[#1a1a1a] border border-black/[0.08] dark:border-white/[0.08] rounded-[20px] px-8 py-10 w-full overflow-y-auto max-h-[calc(100vh-48px)] transition-[max-width] duration-[400ms] cubic-bezier-[0.16,1,0.3,1]",
          isExtraWide ? "max-w-[650px]" : isWide ? "max-w-[560px]" : "max-w-[400px]"
        )}
        style={{
          boxShadow: "rgba(17,17,17,0.12) 0px 26px 60px -6px, rgba(17,17,17,0.02) 0px 28px 28px -14px",
          animation: "cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-[9px] bg-[#589981] flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/zotok-logo-20.svg" alt="Zotok" width={22} height={18} />
          </div>
          <span className="text-[18px] font-semibold text-[#34322d] dark:text-[#dadada] tracking-[-0.01em]">Zotok</span>
        </div>

        {step === "phone"      && <PhoneStep {...flow} />}
        {step === "otp"        && <OtpStep {...flow} />}
        {step === "gst"        && <GstStep {...flow} />}
        {step === "gst-otp"    && <GstOtpStep {...flow} />}
        {step === "details"    && <DetailsStep {...flow} />}
        {step === "wa-connect" && <WaConnectStep {...flow} />}
        {step === "wa-phone"   && <WaPhoneStep {...flow} />}
        {step === "wa-code"    && <WaCodeStep {...flow} />}
        {step === "wa-history" && <WaHistoryStep {...flow} />}
        {step === "wa-groups"  && <WaGroupsStep {...flow} />}
        {step === "wa-syncing" && <WaSyncingStep {...flow} />}
      </main>
    </div>
  );
}
