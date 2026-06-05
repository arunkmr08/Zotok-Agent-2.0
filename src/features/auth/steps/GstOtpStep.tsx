import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import { ArrowIcon } from "@/features/auth/components/ArrowIcon";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState, "gst" | "gstOtp" | "setGstOtp" | "setStep">;

export function GstOtpStep({ gst, gstOtp, setGstOtp, setStep }: Props) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 overflow-y-auto pr-0.5 pb-4 min-h-0 flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-[22px] font-semibold text-[#111] dark:text-white mb-[6px]"
        >
          Enter GST Number
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-sm text-[#6d6c6b] mb-6"
        >
          Enter GST Number to verify your business
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
        >
          <FormField label="GST Number" htmlFor="gst-prefilled" className="mb-4">
            <div className="relative">
              <Input id="gst-prefilled" value={gst} disabled className="pr-10" />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858481] hover:text-[#6d6c6b]"
                onClick={() => setStep("gst")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
          </FormField>
          <FormField label={<>OTP <span className="text-[#ff3b30]">*</span></>} htmlFor="gst-otp-input" className="mb-4">
            <Input id="gst-otp-input" placeholder="123212" value={gstOtp} onChange={(e) => setGstOtp(e.target.value)} />
          </FormField>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        className="flex-shrink-0 pt-2 bg-white dark:bg-[#1a1a1a]"
      >
        <PrimaryBtn onClick={() => setStep("details")}>
          Verify GST OTP <ArrowIcon />
        </PrimaryBtn>
      </motion.div>
    </div>
  );
}
