"use client";

import { PhoneInput } from "@/features/auth/components/PhoneInput";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState,
  "waPhone" | "setWaPhone" | "waPhoneError" | "setWaPhoneError" |
  "waDialCode" | "setWaDialCode" | "setStep"
>;

export function WaPhoneStep({ waPhone, setWaPhone, waPhoneError, setWaPhoneError, waDialCode, setWaDialCode, setStep }: Props) {
  return (
    <div key="wa-phone" style={{ animation: "fadeStep 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <h1 className="text-[22px] font-semibold text-[#111] dark:text-white mb-[6px]">Enter your WhatsApp Phone number</h1>
      <p className="text-sm text-[#6d6c6b] mb-[28px]">Link your number so Zotok can read the groups you choose.</p>
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
      <PrimaryBtn
        className="mt-2 mb-[18px]"
        disabled={waPhone.length < 10 || waPhone.length > 15}
        onClick={() => {
          if (waPhone.length < 10) { setWaPhoneError("Enter at least 10 digits"); return; }
          setStep("wa-code");
        }}
      >Next</PrimaryBtn>
      <p className="text-center">
        <button
          className="text-[13px] text-[#111] dark:text-white underline underline-offset-[2px] font-medium"
          onClick={() => setStep("wa-connect")}
        >Login With QR Code</button>
      </p>
    </div>
  );
}
