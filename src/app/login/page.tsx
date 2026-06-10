"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn, toggleDark } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLoginFlow } from "@/features/auth/hooks/useLoginFlow";
import { PhoneStep } from "@/features/auth/steps/PhoneStep";
import { OtpStep } from "@/features/auth/steps/OtpStep";
import { DetailsStep } from "@/features/auth/steps/DetailsStep";
import { WaConnectStep } from "@/features/auth/steps/WaConnectStep";
import { WaPhoneStep } from "@/features/auth/steps/WaPhoneStep";
import { WaCodeStep } from "@/features/auth/steps/WaCodeStep";
import { WaHistoryStep } from "@/features/auth/steps/WaHistoryStep";
import { GstStep } from "@/features/auth/steps/GstStep";
import { WaGroupsStep } from "@/features/auth/steps/WaGroupsStep";
import { WaSyncingStep } from "@/features/auth/steps/WaSyncingStep";

export default function LoginPage() {
  const flow = useLoginFlow();
  const { step } = flow;
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  };

  const { waPhone } = flow;
  useEffect(() => {
    if (step === "wa-history") showToast(`WhatsApp Connected to +91 ${waPhone || "98765 43210"} Successfully!`);
  }, [step]);

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

      <TooltipProvider delay={300}>
        <Tooltip>
          <TooltipTrigger render={<button onClick={toggleDark} className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white dark:bg-[#1f1f1f] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center hover:bg-[#f4f3ef] dark:hover:bg-[#2a2a2a] transition-colors" style={{ boxShadow: "rgba(17,17,17,0.02) 0px -6px 6px 0px, rgba(17,17,17,0.01) 0px -23px 9px 0px" }} aria-label="Toggle dark mode" />}>
            <Image src="/assets/icons/nav-theme.svg" alt="" width={18} height={18} />
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>Toggle theme</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "relative z-10 bg-white dark:bg-[#1a1a1a] border border-black/[0.08] dark:border-white/[0.08] rounded-[20px] px-8 py-9 w-full flex flex-col justify-between shadow-lg overflow-hidden",
          step === "wa-connect" ? "max-w-[720px]" : step === "details" || step === "wa-history" || step === "wa-groups" || step === "wa-code" ? "max-w-[520px]" : "max-w-[420px]"
        )}
        style={{
          boxShadow: "rgba(17,17,17,0.12) 0px 26px 60px -6px, rgba(17,17,17,0.02) 0px 28px 28px -14px",
        }}
      >
        <div className="flex items-center gap-3 mb-5 flex-shrink-0">
          <div className="w-9 h-9 rounded-[9px] bg-[#589981] flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/zotok-logo-20.svg" alt="Zotok" width={22} height={18} />
          </div>
          <span className="text-[18px] font-semibold text-[#34322d] dark:text-[#dadada] tracking-[-0.01em]">Zotok</span>
          {step !== "phone" && step !== "otp" && (() => {
            const currentStep = step === "gst" ? 1 : step === "details" ? 2 : step === "wa-connect" || step === "wa-phone" || step === "wa-code" ? 3 : step === "wa-history" ? 4 : step === "wa-groups" ? 5 : 6;
            const total = 6;
            const r = 5.5;
            const circ = 2 * Math.PI * r;
            const offset = circ * (1 - currentStep / total);
            return (
              <div className="ml-auto flex items-center gap-1.5 border border-[#f0f0f0] dark:border-white/[0.1] rounded-full px-2 py-1 flex-shrink-0">
                <svg className="w-4 h-4 -rotate-90" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r={r} stroke="#e5e5e5" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r={r} stroke="#0067ff" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
                </svg>
                <p className="text-[12px] font-semibold text-[#595959] dark:text-[#8c8c8c] tracking-[0.01px]">
                  {currentStep} of {total}
                </p>
              </div>
            );
          })()}
        </div>

        <div className="flex-1 flex flex-col justify-start min-h-0 relative">
          <div className="w-full flex flex-col justify-start">
            {step === "phone"      && <PhoneStep {...flow} />}
            {step === "otp"        && <OtpStep {...flow} showToast={showToast} />}
            {step === "gst"        && <GstStep {...flow} />}
            {step === "details"    && <DetailsStep {...flow} />}
            {step === "wa-connect" && <WaConnectStep {...flow} />}
            {step === "wa-phone"   && <WaPhoneStep {...flow} />}
            {step === "wa-code"    && <WaCodeStep {...flow} />}
            {step === "wa-history" && <WaHistoryStep {...flow} />}
            {step === "wa-groups"  && <WaGroupsStep {...flow} />}
            {step === "wa-syncing" && <WaSyncingStep {...flow} />}
          </div>
        </div>

      </motion.main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#111] dark:bg-white text-white dark:text-[#111] px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg flex items-center gap-2 border border-black/10 dark:border-white/10"
          >
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="whitespace-nowrap">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
