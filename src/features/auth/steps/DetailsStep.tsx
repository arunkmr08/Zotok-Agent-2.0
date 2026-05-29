"use client";

import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState, "gst" | "phone" | "setStep">;

export function DetailsStep({ gst, phone, setStep }: Props) {
  return (
    <div key="details" style={{ animation: "fadeStep 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <h2 className="text-[20px] font-semibold text-[#111] dark:text-white mb-[6px]">Your Business Details</h2>
      <p className="text-sm text-[#6d6c6b] mb-5">Verify your business details &amp; submit to setup your workspace</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormField label="GST Number"><Input value={gst || "36LVWLK3103B5ZM"} disabled /></FormField>
        <FormField label="Phone Number"><Input value={`+91 ${phone || "9876543210"}`} disabled /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormField label="Business Name"><Input defaultValue="Alpha" /></FormField>
        <FormField label="Business Address"><Input defaultValue="North Building" /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormField label="City / Town"><Input defaultValue="Hyderabad" /></FormField>
        <FormField label="State"><Input defaultValue="Telangana" /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormField label="District"><Input defaultValue="Rangareddy" /></FormField>
        <FormField label="Pin Code"><Input defaultValue="500084" /></FormField>
      </div>
      <FormField label="Your Name" className="mb-6">
        <Input placeholder="Enter your name" />
      </FormField>
      <PrimaryBtn onClick={() => setStep("wa-connect")}>Submit</PrimaryBtn>
    </div>
  );
}
