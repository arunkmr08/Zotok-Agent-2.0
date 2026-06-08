import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState, "gst" | "setGst" | "phone" | "setStep">;

export function DetailsStep({ gst, setGst, phone, setStep }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-[20px] font-semibold text-[#111] dark:text-white"
        >
          Your Business Details
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-sm text-[#6d6c6b] mb-5"
        >
          Verify your business details &amp; submit to setup your workspace
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField label="GST Number">
              <Input
                value={gst}
                disabled
                placeholder="Enter GST Number"
              />
            </FormField>
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
          <FormField label="Your Name" className="mb-2">
            <Input placeholder="Enter your name" />
          </FormField>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        className="pt-1"
      >
        <PrimaryBtn onClick={() => setStep("wa-connect")}>Submit</PrimaryBtn>
      </motion.div>
    </div>
  );
}
