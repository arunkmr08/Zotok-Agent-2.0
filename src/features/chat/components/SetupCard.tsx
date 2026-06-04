"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const MotionLink = motion(Link);

const STEPS = [
  {
    n: 1,
    title: "Choose an AI worker for your operations",
    desc: "Deploy workers for lead collection, categorization, reporting, or workflow automation.",
  },
  {
    n: 2,
    title: "Set up channels, groups & integrations",
    desc: "Connect WhatsApp groups, sheets, CRMs, and define how your AI worker should operate.",
  },
  {
    n: 3,
    title: "Review outputs and activate automation",
    desc: "Run a quick test, verify responses, and start automating real business operations.",
  },
];

export function SetupCard({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -28, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.32, 0.94, 0.6, 1] }}
      className="bg-white dark:bg-[#1a1a1a] rounded-[20px] p-4 flex flex-col gap-4 border border-black/[0.06] dark:border-white/[0.08] shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="p-[10px] rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #03f61f 0%, #02a115 78%)" }}
        >
          <Image src="/assets/icons/nav-karamchari.svg" alt="" width={18} height={18} className="brightness-0 invert" />
        </div>
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <p className="text-[16px] font-semibold text-[#262626] dark:text-[#f0f0f0] tracking-[-0.18px]">
            Setup your AI Karamchari&apos;s
          </p>
          <p className="text-[12px] font-medium text-[#8c8c8c] tracking-[0.01px]">3 Quick Steps</p>
        </div>
        <div className="flex items-center gap-1.5 border border-[#f0f0f0] dark:border-white/[0.1] rounded-full px-2 py-1 flex-shrink-0">
          <svg className="w-4 h-4 text-[#8c8c8c] animate-spin" viewBox="0 0 16 16" fill="none">
            <path d="M14 8A6 6 0 1 1 8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-[12px] font-semibold text-[#595959] dark:text-[#8c8c8c] tracking-[0.01px]">0 of 3</p>
        </div>
        <button
          onClick={onClose}
          className="w-5 h-5 flex items-center justify-center text-[#8c8c8c] hover:text-[#262626] dark:hover:text-white flex-shrink-0 transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4">
            <path d="M4 4l8 8M12 4L4 12" />
          </svg>
        </button>
      </div>

      {/* Steps */}
      <div className="flex gap-3">
        {STEPS.map((step) => (
          <div
            key={step.n}
            className="flex-1 bg-[#fcfcfc] dark:bg-[#242424] border border-dashed border-[#d9d9d9] dark:border-white/[0.1] rounded-lg p-3 flex flex-col gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-[#f0f0f0] dark:bg-white/[0.1] flex items-center justify-center text-[14px] font-medium text-[#595959] dark:text-[#adadad] flex-shrink-0">
              {step.n}
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[14px] font-semibold text-[#262626] dark:text-[#f0f0f0] tracking-[-0.09px] leading-[20px]">
                {step.title}
              </p>
              <p className="text-[12px] text-[#8c8c8c] tracking-[0.01px] leading-[18px]">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#8c8c8c]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5l2 2" />
          </svg>
          <span className="text-[12px] font-medium text-[#8c8c8c] tracking-[0.01px]">60s setup</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-md border border-[#bfbfbf] dark:border-white/[0.2] text-[14px] font-semibold text-[#262626] dark:text-[#f0f0f0] hover:bg-[#f4f3ef] dark:hover:bg-[#242424] transition-colors"
          >
            Skip for now
          </button>
          <MotionLink
            href="/agents"
            className="px-4 py-2.5 rounded-lg bg-[#0067ff] text-white text-[14px] font-semibold flex items-center gap-2 hover:bg-[#0055d4] transition-colors"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            Deploy First Karamchari
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 10h12M12 5l5 5-5 5" />
            </svg>
          </MotionLink>
        </div>
      </div>
    </motion.div>
  );
}
