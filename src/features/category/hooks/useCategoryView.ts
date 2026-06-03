"use client";

import { useState } from "react";
import { CATEGORIES, MESSAGES } from "@/features/category/constants";
import type { CategoryKey, Message } from "@/features/category/types";

export function useCategoryView() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("orders");
  const [flyoutMsg, setFlyoutMsg] = useState<Message | null>(null);

  const cat = CATEGORIES.find((c) => c.key === activeCategory)!;
  const msgs = MESSAGES[activeCategory] ?? [];

  function handleSelectCategory(key: CategoryKey) {
    setActiveCategory(key);
    setFlyoutMsg(null);
  }

  return {
    activeCategory,
    handleSelectCategory,
    flyoutMsg,
    setFlyoutMsg,
    cat,
    msgs,
    categories: CATEGORIES,
  };
}

export type CategoryViewState = ReturnType<typeof useCategoryView>;
