import { motion } from "motion/react";
import { ArrowIcon } from "@/features/auth/components/ArrowIcon";
import { PhoneInput } from "@/features/auth/components/PhoneInput";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState,
  "waPhone" | "setWaPhone" | "waPhoneError" | "setWaPhoneError" |
  "waDialCode" | "setWaDialCode" | "setStep"
>;

export function WaPhoneStep({ waPhone, setWaPhone, waPhoneError, setWaPhoneError, waDialCode, setWaDialCode, setStep }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-[22px] font-semibold text-[#111] dark:text-white"
        >
          Enter your WhatsApp Phone number
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-sm text-[#6d6c6b] mb-6"
        >
          Link your number so Zotok can read the groups you choose.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
        >
          <PhoneInput
            id="wa-phone-input"
            label="Phone Number"
            value={waPhone}
            error={waPhoneError}
            dialCode={waDialCode}
            onDialCodeChange={setWaDialCode}
            onChange={setWaPhone}
            onError={setWaPhoneError}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        className="pt-1 flex flex-col gap-3"
      >
        <PrimaryBtn
          disabled={waPhone.length < 10 || waPhone.length > 15}
          onClick={() => {
            if (waPhone.length < 10) { setWaPhoneError("Enter at least 10 digits"); return; }
            setStep("wa-code");
          }}
        >Next</PrimaryBtn>
        <div className="flex justify-center">
          <button
            className="flex items-center gap-1.5 text-[13px] text-[#111] dark:text-white underline underline-offset-[2px] font-semibold hover:text-[#0067ff] dark:hover:text-[#0067ff] transition-all"
            onClick={() => setStep("wa-connect")}
          >Login With QR Code <ArrowIcon /></button>
        </div>
      </motion.div>
    </div>
  );
}
