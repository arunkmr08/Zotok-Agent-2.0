"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOCK_GROUPS } from "@/features/auth/constants";
import type { Step } from "@/features/auth/types";

export function useLoginFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");

  // Phone step
  const [phone, setPhone] = useState("9876543210");
  const [phoneError, setPhoneError] = useState("");
  const [dialCode, setDialCode] = useState("India");

  // OTP step
  const [otpValues, setOtpValues] = useState(["1", "2", "3", "4"]);
  const [otpError, setOtpError] = useState("");
  const [otpResend, setOtpResend] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // GST step
  const [gst, setGst] = useState("36LVWLK3103B5ZM");
  const [gstError, setGstError] = useState("");
  const [gstOtp, setGstOtp] = useState("");

  // WhatsApp steps
  const [waPhone, setWaPhone] = useState("9876543210");
  const [waPhoneError, setWaPhoneError] = useState("");
  const [waDialCode, setWaDialCode] = useState("India");

  // History step
  const [selectedHistory, setSelectedHistory] = useState<number | "custom">(7);
  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");

  // Groups step
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [groupSearch, setGroupSearch] = useState("");

  // Syncing step
  const [syncText, setSyncText] = useState("");

  useEffect(() => {
    if (step === "otp") {
      setOtpResend(30);
      timerRef.current = setInterval(() => {
        setOtpResend((v) => {
          if (v <= 1) { clearInterval(timerRef.current!); return 0; }
          return v - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const isWide = ["details", "wa-phone", "wa-code", "wa-history", "wa-groups", "wa-syncing"].includes(step);
  const isExtraWide = step === "wa-connect";

  function handleOtpInput(i: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otpValues];
    next[i] = digit;
    setOtpValues(next);
    if (otpError) setOtpError("");
    if (digit && i < 3) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otpValues[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  function toggleGroup(id: number) {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : prev.length < 10 ? [...prev, id] : prev
    );
  }

  const filteredGroups = MOCK_GROUPS.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  return {
    router,
    step, setStep,
    phone, setPhone, phoneError, setPhoneError, dialCode, setDialCode,
    otpValues, otpError, setOtpError, otpResend, otpRefs, timerRef,
    handleOtpInput, handleOtpKeyDown,
    gst, setGst, gstError, setGstError, gstOtp, setGstOtp,
    waPhone, setWaPhone, waPhoneError, setWaPhoneError, waDialCode, setWaDialCode,
    selectedHistory, setSelectedHistory, historyFrom, setHistoryFrom, historyTo, setHistoryTo,
    selectedGroups, groupSearch, setGroupSearch, filteredGroups, toggleGroup,
    syncText, setSyncText,
    isWide, isExtraWide,
  };
}

export type LoginFlowState = ReturnType<typeof useLoginFlow>;
