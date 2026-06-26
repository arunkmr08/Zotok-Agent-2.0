"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowIcon } from "@/features/auth/components/ArrowIcon";
import { PhoneInput } from "@/features/auth/components/PhoneInput";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import { WA_CODE } from "@/features/auth/constants";
import { useWhatsappConnection } from "@/features/whatsapp/context/WhatsappConnectionContext";

// Mirrors the mock QR renderer from the signup flow's WaConnectStep
function MockQRCode({ seed }: { seed: number }) {
  const size = 17;
  const cells: boolean[] = [];

  let currentSeed = seed;
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isTopLeft = r < 5 && c < 5;
      const isTopRight = r < 5 && c >= size - 5;
      const isBottomLeft = r >= size - 5 && c < 5;

      if (isTopLeft || isTopRight || isBottomLeft) {
        const checkFinder = (row: number, col: number) => {
          if (row === 0 || row === 4 || col === 0 || col === 4) return true;
          if (row === 2 && col === 2) return true;
          return false;
        };

        let localR = r;
        let localC = c;
        if (isTopRight) localC = c - (size - 5);
        if (isBottomLeft) localR = r - (size - 5);

        cells.push(checkFinder(localR, localC));
      } else {
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

type Stage = "qr" | "phone" | "code";

export function WhatsappReconnectModal() {
  const { reconnectModalOpen, setReconnectModalOpen, reconnect } = useWhatsappConnection();
  const [stage, setStage] = useState<Stage>("qr");
  const [seed, setSeed] = useState(() => Date.now());
  const [timeLeft, setTimeLeft] = useState(30);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [dialCode, setDialCode] = useState("India");

  // Fresh QR + timer + stage each time the modal opens
  useEffect(() => {
    if (reconnectModalOpen) {
      setSeed(Date.now());
      setTimeLeft(30);
      setStage("qr");
      setPhone("");
      setPhoneError("");
    }
  }, [reconnectModalOpen]);

  useEffect(() => {
    if (!reconnectModalOpen || stage !== "qr" || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [reconnectModalOpen, stage, timeLeft]);

  function handleReload() {
    setSeed(Date.now());
    setTimeLeft(30);
  }

  function handlePhoneNext() {
    if (phone.length < 10) { setPhoneError("Enter at least 10 digits"); return; }
    setStage("code");
  }

  const isExpired = timeLeft <= 0;

  return (
    <Dialog open={reconnectModalOpen} onOpenChange={setReconnectModalOpen}>
      <DialogContent className="max-w-[42rem] sm:max-w-[42rem] p-[1.5rem]">
        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-[21px] font-semibold text-[#111] dark:text-white leading-snug">
            {stage === "code" ? "Enter Code on your Phone" : "Scan to Reconnect your WhatsApp account"}
          </DialogTitle>
          {stage === "code" ? (
            <p className="text-sm text-[#6d6c6b]">
              Linking WhatsApp Account <strong>+91 {phone}</strong>{" "}
              <button className="text-[#111] dark:text-white font-medium text-[13px] underline underline-offset-[2px]" onClick={() => setStage("phone")}>Change</button>
            </p>
          ) : (
            <p className="text-sm text-[#6d6c6b]">
              Your WhatsApp session was disconnected. Link your number again so Zotok can keep reading the groups you choose.
            </p>
          )}

          {stage === "qr" ? (
            <div className="flex gap-8 items-center justify-center mt-4">
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
                  <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex flex-col items-center justify-center gap-2 text-center p-3">
                    <span className="text-[11px] font-bold text-[#111] dark:text-white uppercase tracking-wider">QR Code Expired</span>
                    <button
                      onClick={handleReload}
                      className="w-10 h-10 rounded-full bg-[#0067ff] hover:bg-[#0055d4] text-white flex items-center justify-center shadow transition-colors"
                      aria-label="Reload QR Code"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-0.5 rounded text-[10px] font-mono select-none">
                    {timeLeft}s
                  </div>
                )}
              </div>
            </div>
          ) : stage === "phone" ? (
            <div className="mt-4 max-w-sm">
              <PhoneInput
                id="wa-reconnect-phone"
                label="Phone Number"
                value={phone}
                error={phoneError}
                dialCode={dialCode}
                onDialCodeChange={setDialCode}
                onChange={setPhone}
                onError={setPhoneError}
              />
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex gap-2 mb-6 mt-2">
                {WA_CODE.map((c, i) => (
                  <div key={i} className="flex-1 h-[52px] flex items-center justify-center bg-[#f4f3ef] dark:bg-[#242424] border border-black/[0.08] dark:border-white/[0.08] rounded-xl text-[22px] font-semibold tracking-[0.04em] text-[#34322d] dark:text-[#dadada]">
                    {c}
                  </div>
                ))}
              </div>
              <ol className="login-steps">
                <li><span>Open WhatsApp on your phone</span></li>
                <li><span>On Android tap Menu, On iPhone tap Settings</span></li>
                <li><span>Tap Linked devices, then Link device</span></li>
                <li><span>Tap Link with phone number instead and enter the code on your phone</span></li>
              </ol>
            </div>
          )}
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.04]">
          <button className="text-[13px] text-[#6d6c6b] underline underline-offset-[2px] font-medium hover:text-[#0067ff] transition-all">
            Need help?
          </button>

          {stage === "qr" ? (
            <button
              className="flex items-center gap-1.5 text-[13px] text-[#34322d] dark:text-[#adadad] underline underline-offset-[2px] font-semibold hover:text-[#0067ff] dark:hover:text-[#0067ff] transition-all"
              onClick={() => setStage("phone")}
            >
              Login with phone number <ArrowIcon />
            </button>
          ) : stage === "phone" ? (
            <div className="flex items-center gap-4">
              <button
                className="text-[13px] text-[#34322d] dark:text-[#adadad] underline underline-offset-[2px] font-semibold hover:text-[#0067ff] dark:hover:text-[#0067ff] transition-all"
                onClick={() => setStage("qr")}
              >
                Login with QR code
              </button>
              <PrimaryBtn className="w-auto" disabled={phone.length < 10 || phone.length > 15} onClick={handlePhoneNext}>
                Next
              </PrimaryBtn>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                className="text-[13px] text-[#34322d] dark:text-[#adadad] underline underline-offset-[2px] font-semibold hover:text-[#0067ff] dark:hover:text-[#0067ff] transition-all"
                onClick={() => setStage("qr")}
              >
                Login with QR code
              </button>
              <PrimaryBtn className="w-auto" onClick={reconnect}>
                Connect
              </PrimaryBtn>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
