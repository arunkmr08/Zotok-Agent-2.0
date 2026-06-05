import { motion } from "motion/react";
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-[22px] font-semibold text-[#111] dark:text-white mb-[6px]"
        >
          Welcome to Zotok
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-sm text-[#6d6c6b] mb-4"
        >
          Enter your mobile number to sign in or set you up a new account.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
        >
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
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        className="pt-1 flex flex-col gap-3"
      >
        <PrimaryBtn
          disabled={phone.length < 10 || phone.length > 15}
          onClick={() => {
            if (phone.length < 10) { setPhoneError("Enter at least 10 digits"); return; }
            setStep("otp");
          }}
        >
          Send OTP <ArrowIcon />
        </PrimaryBtn>
        <p className="text-[13px] text-[#6d6c6b] text-center mt-2 leading-relaxed">
          By continuing you agree to the{" "}
          <span className="font-medium text-black dark:text-white hover:underline hover:text-[#0067ff] dark:hover:text-[#0067ff] transition-all cursor-pointer">Terms</span>{" "}
          and{" "}
          <span className="font-medium text-black dark:text-white hover:underline hover:text-[#0067ff] dark:hover:text-[#0067ff] transition-all cursor-pointer">Privacy notice</span>.
        </p>
      </motion.div>
    </div>
  );
}
