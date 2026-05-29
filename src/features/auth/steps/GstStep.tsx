"use client";

import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import { ArrowIcon } from "@/features/auth/components/ArrowIcon";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState, "gst" | "setGst" | "setStep">;

export function GstStep({ gst, setGst, setStep }: Props) {
  return (
    <div key="gst" style={{ animation: "fadeStep 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <h1 className="text-[22px] font-semibold text-[#111] dark:text-white mb-[6px]">Enter GST Number</h1>
      <p className="text-sm text-[#6d6c6b] mb-[28px]">Enter GST Number to verify your business</p>
      <FormField label="GST Number" htmlFor="gst-input" className="mb-4">
        <Input id="gst-input" placeholder="Enter GST number" value={gst} onChange={(e) => setGst(e.target.value)} />
      </FormField>
      <PrimaryBtn onClick={() => setStep("gst-otp")}>
        Verify GST <ArrowIcon />
      </PrimaryBtn>
    </div>
  );
}
