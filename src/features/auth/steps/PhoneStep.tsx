"use client";

import { PhoneInput } from "@/features/auth/components/PhoneInput";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import { ArrowIcon } from "@/features/auth/components/ArrowIcon";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState,
  "phone" | "setPhone" | "phoneError" | "setPhoneError" |
  "dialCode" | "setDialCode" | "setStep"
>;

export function PhoneStep({ phone, setPhone, phoneError, setPhoneError, dialCode, setDialCode, setStep }: Props) {
  return (
    <div key="phone" style={{ animation: "fadeStep 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <h1 className="text-[22px] font-semibold text-[#111] dark:text-white mb-[6px]">Welcome to Zotok</h1>
      <p className="text-sm text-[#6d6c6b] mb-[28px]">Enter your mobile number to sign in or set you up a new account.</p>
      <PhoneInput
        id="phone-input"
        label="Mobile number"
        value={phone}
        error={phoneError}
        dialCode={dialCode}
        onDialCodeChange={setDialCode}
        onChange={setPhone}
        onError={setPhoneError}
      />
      <PrimaryBtn
        className="mt-2"
        disabled={phone.length < 10 || phone.length > 15}
        onClick={() => {
          if (phone.length < 10) { setPhoneError("Enter at least 10 digits"); return; }
          setStep("otp");
        }}
      >
        Send OTP <ArrowIcon />
      </PrimaryBtn>
      <p className="text-[13px] text-[#6d6c6b] text-center mt-[18px]">By continuing you agree to the Terms and Privacy notice.</p>
    </div>
  );
}
