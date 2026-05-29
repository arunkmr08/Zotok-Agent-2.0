"use client";

import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState, "setStep">;

export function WaConnectStep({ setStep }: Props) {
  return (
    <div key="wa-connect" className="relative" style={{ animation: "fadeStep 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <button
        className="absolute top-0 right-0 text-[13px] font-semibold text-[#6d6c6b] hover:text-[#111] dark:hover:text-white"
        onClick={() => setStep("wa-history")}
      >Skip</button>
      <h1 className="text-[20px] font-semibold text-[#111] dark:text-white mb-1">Scan to Login with your Whatsapp account</h1>
      <p className="text-sm text-[#6d6c6b] mb-6">Link your number so Zotok can read the groups you choose.</p>
      <div className="flex gap-8">
        <div className="flex-1 flex flex-col justify-between min-h-[226px]">
          <ol className="login-steps">
            <li><span>Scan the QR Code with your phone&apos;s Camera</span></li>
            <li><span>Tap the link to open WhatsApp</span></li>
            <li><span>Scan the QR code again to link to your account</span></li>
          </ol>
          <div>
            <button className="text-[13px] text-[#6d6c6b] underline underline-offset-[2px]">Need help?</button>
          </div>
        </div>
        <div className="w-48 flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-[#ecebea] dark:bg-[#242424] rounded-lg flex items-center justify-center border border-black/[0.08] dark:border-white/[0.08]">
            <span className="text-xs text-[#858481]">QR Code</span>
          </div>
          <button
            className="text-[13px] text-[#34322d] dark:text-[#adadad] underline underline-offset-[2px] font-medium"
            onClick={() => setStep("wa-phone")}
          >
            Login with phone number &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
