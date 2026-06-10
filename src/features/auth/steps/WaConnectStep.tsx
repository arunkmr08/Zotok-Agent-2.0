"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowIcon } from "@/features/auth/components/ArrowIcon";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

type Props = Pick<LoginFlowState, "setStep">;

// Simple custom component to render a mock QR code SVG based on randomized seed
function MockQRCode({ seed }: { seed: number }) {
  const size = 17; // 17x17 grid
  const cells: boolean[] = [];

  // Seeded pseudo-random generator
  let currentSeed = seed;
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't randomize finder patterns (corners)
      const isTopLeft = r < 5 && c < 5;
      const isTopRight = r < 5 && c >= size - 5;
      const isBottomLeft = r >= size - 5 && c < 5;

      if (isTopLeft || isTopRight || isBottomLeft) {
        // Finder patterns rendering logic
        const checkFinder = (row: number, col: number) => {
          // outer border
          if (row === 0 || row === 4 || col === 0 || col === 4) return true;
          // inner solid block
          if (row === 2 && col === 2) return true;
          return false;
        };

        let localR = r;
        let localC = c;
        if (isTopRight) localC = c - (size - 5);
        if (isBottomLeft) localR = r - (size - 5);

        cells.push(checkFinder(localR, localC));
      } else {
        // Random block
        cells.push(random() > 0.5);
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full p-2 text-black dark:text-white" fill="currentColor">
      {cells.map((filled, idx) => {
        if (!filled) return null;
        const r = Math.floor(idx / size);
        const c = idx % size;
        return <rect key={idx} x={c} y={r} width="1" height="1" />;
      })}
    </svg>
  );
}

export function WaConnectStep({ setStep }: Props) {
  const [seed, setSeed] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleReload = () => {
    setSeed(Date.now());
    setTimeLeft(30);
  };

  const isExpired = timeLeft <= 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-[21px] font-semibold text-[#111] dark:text-white leading-snug"
        >
          Scan to Login with your Whatsapp account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-sm text-[#6d6c6b]"
        >
          Link your number so Zotok can read the groups you choose.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
          className="flex gap-8 items-center justify-center mt-4"
        >
          <div className="flex-1 flex flex-col justify-center gap-4">
            <ol className="login-steps">
              <li><span>Scan the QR Code with your phone&apos;s Camera</span></li>
              <li><span>Tap the link to open WhatsApp</span></li>
              <li><span>Scan the QR code again to link to your account</span></li>
            </ol>
          </div>
          
          <div className="w-[180px] h-[180px] flex-shrink-0 relative border border-black/[0.08] dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#1f1f1f] flex items-center justify-center p-2.5 overflow-hidden shadow-sm">
            <div className={isExpired ? "blur-[2px] opacity-25 w-full h-full" : "w-full h-full"}>
              <MockQRCode seed={seed} />
            </div>

            {isExpired ? (
              <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex flex-col items-center justify-center gap-2 text-center p-3 animate-fadeIn">
                <span className="text-[11px] font-bold text-[#111] dark:text-white uppercase tracking-wider">QR Code Expired</span>
                <button
                  onClick={handleReload}
                  className="w-10 h-10 rounded-full bg-[#0067ff] hover:bg-[#0055d4] text-white flex items-center justify-center shadow transition-colors"
                  aria-label="Reload QR Code"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-0.5 rounded text-[10px] font-mono select-none">
                {timeLeft}s
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        className="pt-4 flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.04]"
      >
        <button className="text-[13px] text-[#6d6c6b] underline underline-offset-[2px] font-medium hover:text-[#0067ff] transition-all">Need help?</button>
        <button
          className="text-[13px] font-semibold text-[#6d6c6b] hover:text-[#111] dark:hover:text-white transition-colors"
          onClick={() => setStep("wa-history")}
        >Skip</button>
        <button
          className="flex items-center gap-1.5 text-[13px] text-[#34322d] dark:text-[#adadad] underline underline-offset-[2px] font-semibold hover:text-[#0067ff] dark:hover:text-[#0067ff] transition-all"
          onClick={() => setStep("wa-phone")}
        >
          Login with phone number <ArrowIcon />
        </button>
      </motion.div>
    </div>
  );
}
