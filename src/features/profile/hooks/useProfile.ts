"use client";

import { KV_ITEMS, PRO_FEATURES } from "@/features/profile/constants";
import type { KVItem } from "@/features/profile/types";

export function useProfile() {
  const kvItems: KVItem[] = KV_ITEMS;
  const proFeatures: string[] = PRO_FEATURES;

  return { kvItems, proFeatures };
}

export type ProfileState = ReturnType<typeof useProfile>;
