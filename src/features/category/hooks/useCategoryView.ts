"use client";

import { useState } from "react";
import { CATEGORIES, MESSAGES } from "@/features/category/constants";
import type { CategoryKey, Message } from "@/features/category/types";

export function useCategoryView() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("orders");
  const [flyoutMsg, setFlyoutMsg] = useState<Message | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  const cat = CATEGORIES.find((c) => c.key === activeCategory)!;
  const allMsgs = MESSAGES[activeCategory] ?? [];
  const totalPages = Math.max(1, Math.ceil(allMsgs.length / perPage));
  const safePage = Math.min(page, totalPages);
  const msgs = allMsgs.slice((safePage - 1) * perPage, safePage * perPage);

  function handleSelectCategory(key: CategoryKey) {
    setActiveCategory(key);
    setFlyoutMsg(null);
    setPage(1);
  }

  function setPageSafe(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }

  function setPerPageAndReset(n: number) {
    setPerPage(n);
    setPage(1);
  }

  return {
    activeCategory,
    handleSelectCategory,
    flyoutMsg,
    setFlyoutMsg,
    cat,
    msgs,
    categories: CATEGORIES,
    page: safePage,
    perPage,
    totalPages,
    totalMsgs: allMsgs.length,
    setPage: setPageSafe,
    setPerPage: setPerPageAndReset,
  };
}

export type CategoryViewState = ReturnType<typeof useCategoryView>;
