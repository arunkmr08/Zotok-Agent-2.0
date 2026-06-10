import { motion } from "motion/react";
import { ArrowIcon } from "@/features/auth/components/ArrowIcon";
import { WA_CODE } from "@/features/auth/constants";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState, "waPhone" | "setStep">;

export function WaCodeStep({ waPhone, setStep }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-[22px] font-semibold text-[#111] dark:text-white"
        >
          Enter Code on your Phone
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-sm text-[#6d6c6b] mb-4"
        >
          Linking WhatsApp Account <strong>+91 {waPhone || "98765 43210"}</strong>{" "}
          <button className="text-[#111] dark:text-white font-medium text-[13px] underline underline-offset-[2px]" onClick={() => setStep("wa-phone")}>Change</button>
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
        >
          <div className="flex gap-2 mb-6 mt-2">
            {WA_CODE.map((c, i) => (
              <div key={i} className="flex-1 h-[52px] flex items-center justify-center bg-[#f4f3ef] dark:bg-[#242424] border border-black/[0.08] dark:border-white/[0.08] rounded-xl text-[22px] font-semibold tracking-[0.04em] text-[#34322d] dark:text-[#dadada]">
                {c}
              </div>
            ))}
          </div>
          <ol className="login-steps mt-4 mb-6">
            <li><span>Open WhatsApp on your phone</span></li>
            <li><span>On Android tap Menu, On iPhone tap Settings</span></li>
            <li><span>Tap Linked devices, then Link device</span></li>
            <li><span>Tap Link with phone number instead and enter the code on your phone</span></li>
          </ol>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        className="pt-1 flex flex-col items-center gap-4"
      >
        <button className="flex items-center gap-1.5 text-[13px] text-[#111] dark:text-white underline underline-offset-[2px] font-semibold hover:text-[#0067ff] dark:hover:text-[#0067ff] transition-all mb-2" onClick={() => setStep("wa-connect")}>Login With QR Code <ArrowIcon /></button>
        <button
          className="py-[6px] px-3 text-[11px] font-medium rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-[#34322d] dark:text-[#dadada] hover:bg-[#f4f3ef] dark:hover:bg-[#242424] transition-colors"
          onClick={() => setStep("wa-history")}
        >Skip</button>
      </motion.div>
    </div>
  );
}
