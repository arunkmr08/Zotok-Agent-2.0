"use client";

import { useState, useEffect } from "react";

export interface ActivityEntry {
  time: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: string;
}

interface UsageData {
  dailyUsed: number;
  monthlyUsed: number;
  creditsTotal: number;
  creditsUsed: number;
  activity: ActivityEntry[];
  lastReset: string;
  plan: "free" | "pro";
}

const DAILY_LIMIT   = 50_000;
const MONTHLY_LIMIT = 500_000;

const SEED_ACTIVITY: ActivityEntry[] = [
  { time: "10/06/2026 10:32:01 AM", model: "GPT 5.4 mini", inputTokens: 7457, outputTokens: 2020, cost: "₹0.034" },
  { time: "10/06/2026 10:30:14 AM", model: "GPT 5.4 mini", inputTokens: 4368, outputTokens: 1411, cost: "₹0.034" },
  { time: "10/06/2026 09:58:44 AM", model: "GPT 5.4 Nano", inputTokens: 7703, outputTokens: 1736, cost: "₹0.00"  },
  { time: "10/06/2026 09:21:09 AM", model: "GPT 5.4 mini", inputTokens: 5083, outputTokens: 2168, cost: "₹0.034" },
];

function loadData(): UsageData {
  try {
    const raw = localStorage.getItem("zotok_usage");
    if (raw) {
      const p = JSON.parse(raw);
      return {
        dailyUsed:    p.dailyUsed    ?? 13_000,
        monthlyUsed:  p.monthlyUsed  ?? 450_000,
        creditsTotal: p.creditsTotal ?? 0,
        creditsUsed:  p.creditsUsed  ?? 0,
        activity:     p.activity     ?? SEED_ACTIVITY,
        lastReset:    p.lastReset    ?? new Date().toDateString(),
        plan:         p.plan         ?? "free",
      };
    }
  } catch { /* ignore */ }
  return {
    dailyUsed: 13_000,
    monthlyUsed: 450_000,
    creditsTotal: 0,
    creditsUsed: 0,
    activity: SEED_ACTIVITY,
    lastReset: new Date().toDateString(),
    plan: "free",
  };
}

function saveData(data: UsageData) {
  localStorage.setItem("zotok_usage", JSON.stringify(data));
}

function nextMidnight(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function firstOfNextMonth(): Date {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatResetDate(d: Date): string {
  const day = d.getDate();
  const suffix = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `Resets at ${day}${suffix} ${month} ${year}, 12:00AM`;
}

function calcCost(input: number, output: number): string {
  const cost = (input * 0.000003 + output * 0.000006) * 83; // USD → INR approx
  return cost < 0.001 ? "₹0.00" : `₹${cost.toFixed(3)}`;
}

export function useUsage() {
  const [data, setData] = useState<UsageData>(() => loadData());

  // Check for daily reset on mount
  useEffect(() => {
    const today = new Date().toDateString();
    if (data.lastReset !== today) {
      const reset = { ...data, dailyUsed: 0, lastReset: today };
      setData(reset);
      saveData(reset);
    }
  }, []);

  const dailyPct   = Math.min(100, Math.round((data.dailyUsed / DAILY_LIMIT) * 100));
  const monthlyPct = Math.min(100, Math.round((data.monthlyUsed / MONTHLY_LIMIT) * 100));

  // Every mutator re-reads localStorage first: separate components each hold their own
  // useUsage() state, so mutating off this hook's possibly-stale `data` can clobber
  // changes another instance already persisted (e.g. a reset right before a purchase).
  function mutate(updater: (fresh: UsageData) => UsageData) {
    const updated = updater(loadData());
    setData(updated);
    saveData(updated);
  }

  function logActivity(model: string, inputTokens: number, outputTokens: number) {
    const now = new Date();
    const time = now.toLocaleString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
    }).replace(",", "");

    const entry: ActivityEntry = {
      time,
      model,
      inputTokens,
      outputTokens,
      cost: calcCost(inputTokens, outputTokens),
    };

    const tokens = inputTokens + outputTokens;

    mutate((fresh) => {
      const planLimitHit = fresh.dailyUsed >= DAILY_LIMIT || fresh.monthlyUsed >= MONTHLY_LIMIT;
      const creditsRemaining = fresh.creditsTotal - fresh.creditsUsed;

      // Once the plan limit is maxed, draw from purchased credits instead (like Claude's overage credits)
      const useCredits = fresh.plan === "pro" && planLimitHit && creditsRemaining > 0;

      return useCredits
        ? { ...fresh, creditsUsed: Math.min(fresh.creditsTotal, fresh.creditsUsed + tokens), activity: [entry, ...fresh.activity].slice(0, 50) }
        : { ...fresh, dailyUsed: fresh.dailyUsed + tokens, monthlyUsed: fresh.monthlyUsed + tokens, activity: [entry, ...fresh.activity].slice(0, 50) };
    });
  }

  function forceMax() {
    mutate((fresh) => ({ ...fresh, dailyUsed: DAILY_LIMIT, monthlyUsed: MONTHLY_LIMIT }));
  }

  function resetUsage() {
    mutate((fresh) => ({
      dailyUsed: 13_000,
      monthlyUsed: 450_000,
      creditsTotal: fresh.creditsTotal,
      creditsUsed: 0,
      activity: SEED_ACTIVITY,
      lastReset: new Date().toDateString(),
      plan: fresh.plan,
    }));
  }

  function resetCredits() {
    mutate((fresh) => ({ ...fresh, creditsUsed: fresh.creditsTotal }));
  }

  function addCredits(tokens: number) {
    mutate((fresh) => ({ ...fresh, creditsTotal: fresh.creditsTotal + tokens }));
  }

  function setPlan(plan: "free" | "pro") {
    mutate((fresh) => ({ ...fresh, plan }));
  }

  const creditsPct = data.creditsTotal > 0
    ? Math.min(100, Math.round((data.creditsUsed / data.creditsTotal) * 100))
    : 0;
  const creditsRemaining = data.creditsTotal - data.creditsUsed;
  const planLimitHit = dailyPct >= 100 || monthlyPct >= 100;
  // Blocked only once the plan limit is hit AND there are no credits left to cover overage
  const isBlocked = planLimitHit && !(data.plan === "pro" && creditsRemaining > 0);

  return {
    dailyUsed:    data.dailyUsed,
    dailyLimit:   DAILY_LIMIT,
    dailyPct,
    monthlyUsed:  data.monthlyUsed,
    monthlyLimit: MONTHLY_LIMIT,
    monthlyPct,
    creditsTotal: data.creditsTotal,
    creditsUsed:  data.creditsUsed,
    creditsRemaining,
    creditsPct,
    planLimitHit,
    isBlocked,
    dailyResetLabel:   formatResetDate(nextMidnight()),
    monthlyResetLabel: formatResetDate(firstOfNextMonth()),
    activity: data.activity,
    plan:     data.plan,
    logActivity,
    forceMax,
    resetUsage,
    resetCredits,
    setPlan,
    addCredits,
  };
}
