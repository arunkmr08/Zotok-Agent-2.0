"use client";

import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import { ArrowIcon } from "@/features/auth/components/ArrowIcon";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState, "gst" | "gstOtp" | "setGstOtp" | "setStep">;

export function GstOtpStep({ gst, gstOtp, setGstOtp, setStep }: Props) {
  return (
    <div key="gst-otp" style={{ animation: "fadeStep 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <h1 className="text-[22px] font-semibold text-[#111] dark:text-white mb-[6px]">Enter GST Number</h1>
      <p className="text-sm text-[#6d6c6b] mb-[28px]">Enter GST Number to verify your business</p>
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
      <PrimaryBtn onClick={() => setStep("details")}>
        Verify GST OTP <ArrowIcon />
      </PrimaryBtn>
    </div>
  );
}
