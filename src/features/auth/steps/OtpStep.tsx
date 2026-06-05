import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import { COUNTRY_CODES } from "@/features/auth/constants";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState,
  "phone" | "dialCode" | "otpValues" | "otpError" | "setOtpError" | "otpResend" |
  "otpRefs" | "timerRef" | "handleOtpInput" | "handleOtpKeyDown" | "setStep" | "restartOtpTimer"
> & { showToast: (message: string) => void };

export function OtpStep({ phone, dialCode, otpValues, otpError, setOtpError, otpResend, otpRefs, timerRef, handleOtpInput, handleOtpKeyDown, setStep, showToast, restartOtpTimer }: Props) {
  const dial = COUNTRY_CODES.find((c) => c.name === dialCode)?.dial ?? "+91";

  const handleResend = () => {
    showToast(`OTP Sent to mobile number ${dial} ${phone}`);
    restartOtpTimer();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-[22px] font-semibold text-[#111] dark:text-white mb-[6px]"
        >
          Enter the code
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-sm text-[#6d6c6b] mb-4"
        >
          We sent a 4-digit code to <strong>{dial} {phone}</strong>{" "}
          <button className="text-[#111] dark:text-white font-medium text-[13px] underline underline-offset-[2px]" onClick={() => setStep("phone")}>Change</button>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
          className="flex justify-between gap-3"
        >
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
        </motion.div>
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          otpError ? "max-h-12 opacity-100 mt-3 mb-2" : "max-h-0 opacity-0 mb-0"
        )}>
          <p className="text-sm text-destructive">{otpError}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        className="pt-1 flex flex-col gap-4"
      >
        <PrimaryBtn
          disabled={otpValues.some(v => !v)}
          onClick={() => {
            if (otpValues.some(v => !v)) { setOtpError("Please enter all 4 digits"); return; }
            if (otpValues.join("") !== "1234") { setOtpError("OTP is not valid"); return; }
            clearInterval(timerRef.current!);
            setStep("details");
          }}
        >
          Verify and continue
        </PrimaryBtn>
        <p className="text-[13px] text-[#6d6c6b] text-center">
          Didn&apos;t get it?{" "}
          {otpResend > 0
            ? <span className="opacity-50">Resend in {otpResend}s</span>
            : <button onClick={handleResend} className="text-[#111] dark:text-white underline underline-offset-[2px] font-semibold text-[13px] hover:text-[#0067ff] dark:hover:text-[#0067ff] transition-all">Resend</button>}
        </p>
      </motion.div>
    </div>
  );
}
