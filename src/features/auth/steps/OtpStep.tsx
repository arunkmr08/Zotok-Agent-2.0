"use client";

import { cn } from "@/lib/utils";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState,
  "phone" | "otpValues" | "otpError" | "setOtpError" | "otpResend" |
  "otpRefs" | "timerRef" | "handleOtpInput" | "handleOtpKeyDown" | "setStep"
>;

export function OtpStep({ phone, otpValues, otpError, setOtpError, otpResend, otpRefs, timerRef, handleOtpInput, handleOtpKeyDown, setStep }: Props) {
  return (
    <div key="otp" style={{ animation: "fadeStep 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <h1 className="text-[22px] font-semibold text-[#111] dark:text-white mb-[6px]">Enter the code</h1>
      <p className="text-sm text-[#6d6c6b] mb-[28px]">
        We sent a 4-digit code to <strong>+91 {phone}</strong>{" "}
        <button className="text-[#111] dark:text-white font-medium text-[13px] underline underline-offset-[2px]" onClick={() => setStep("phone")}>Change</button>
      </p>
      <div className="flex justify-between gap-3">
        {otpValues.map((v, i) => (
          <input
            key={i}
            ref={(el) => { otpRefs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1}
            value={v}
            onChange={(e) => handleOtpInput(i, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            aria-invalid={!!otpError && !v}
            className={cn(
              "h-16 w-auto min-w-0 max-w-20 flex-[1_1_0%] text-center text-[26px] font-semibold rounded-lg outline-none transition-all duration-200 focus:-translate-y-0.5",
              otpError && !v
                ? "border border-destructive bg-destructive/5 dark:bg-destructive/10 text-[#111] dark:text-white focus:border-destructive focus:shadow-[0_4px_12px_rgba(239,68,68,0.15)]"
                : "border border-black/[0.08] dark:border-white/[0.08] bg-[#f4f3ef] dark:bg-[#242424] text-[#111] dark:text-white focus:bg-white dark:focus:bg-[#1a1a1a] focus:border-[#111] dark:focus:border-white focus:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            )}
          />
        ))}
      </div>
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-out",
        otpError ? "max-h-10 opacity-100 mt-2 mb-4" : "max-h-0 opacity-0 mb-6"
      )}>
        <p className="text-sm text-destructive">{otpError}</p>
      </div>
      <PrimaryBtn
        className={cn(!otpError && "mb-4")}
        disabled={otpValues.some(v => !v)}
        onClick={() => {
          if (otpValues.some(v => !v)) { setOtpError("Please enter all 4 digits"); return; }
          clearInterval(timerRef.current!);
          setStep("gst");
        }}
      >
        Verify and continue
      </PrimaryBtn>
      <p className="text-[13px] text-[#6d6c6b] text-center">
        Didn&apos;t get it?{" "}
        {otpResend > 0
          ? <span className="opacity-50">Resend in {otpResend}s</span>
          : <button className="text-[#111] dark:text-white underline underline-offset-[2px] font-medium text-[13px]">Resend</button>}
      </p>
    </div>
  );
}
