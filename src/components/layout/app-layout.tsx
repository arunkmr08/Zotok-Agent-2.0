"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { AppSidebar } from "./app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

function SidebarSkeleton() {
  return (
    <div className="w-[260px] h-screen bg-white dark:bg-[#141414] border-r border-[#f0f0f0] dark:border-[#262626] flex flex-col p-3 gap-6 flex-shrink-0">
      <div className="flex items-center gap-3 px-1 py-1">
        <Skeleton className="w-9 h-9 rounded-[10px]" />
        <Skeleton className="w-24 h-5 rounded-md" />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-1">
            <Skeleton className="w-[36px] h-[36px] rounded-[10px]" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-black/[0.06] dark:border-white/[0.06] pt-3 px-1">
        <Skeleton className="w-9 h-9 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-2.5 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function TablePageSkeleton() {
  return (
    <div className="h-full flex flex-col p-8 gap-6 bg-[#f9f9f9] dark:bg-[#141414] overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      <div className="flex-1 border border-black/[0.08] dark:border-white/[0.06] rounded-xl bg-white dark:bg-[#1a1a1a] p-4 flex flex-col gap-4 overflow-hidden">
        <div className="flex gap-4 pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
          <Skeleton className="h-4 w-6 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center py-2">
            <Skeleton className="h-4 w-6 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

function GridPageSkeleton() {
  return (
    <div className="h-full flex flex-col p-8 gap-6 bg-[#fcfcfc] dark:bg-[#111] overflow-y-auto">
      <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.08] dark:border-white/[0.06] rounded-2xl p-8 flex justify-between items-center gap-8">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="h-9 w-96 rounded-md" />
          <Skeleton className="h-4 w-full max-w-lg rounded-md" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-36 rounded-md" />
          </div>
        </div>
        <Skeleton className="w-48 h-48 rounded-xl flex-shrink-0 hidden md:block" />
      </div>
      <Skeleton className="h-6 w-40 rounded-md mt-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-black/[0.08] dark:border-white/[0.06] bg-white dark:bg-[#1a1a1a] p-5 space-y-4">
            <div className="flex gap-3 items-center">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-3/4 rounded-md" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatPageSkeleton() {
  return (
    <div className="h-full flex bg-[#f9f9f9] dark:bg-[#141414] overflow-hidden">
      <div className="flex-1 flex flex-col h-full relative p-6">
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.06] mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex gap-3 self-start max-w-[70%]">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl rounded-tl-none p-4 space-y-2 flex-1 min-w-[200px]">
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-5/6 rounded-md" />
            </div>
          </div>
          <div className="flex gap-3 self-end max-w-[70%] justify-end">
            <div className="bg-[#0067ff]/10 rounded-2xl rounded-tr-none p-4 space-y-2 min-w-[200px]">
              <Skeleton className="h-3.5 w-full bg-[#0067ff]/20 rounded-md" />
              <Skeleton className="h-3.5 w-2/3 bg-[#0067ff]/20 rounded-md" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          </div>
        </div>
        <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#1a1a1a] p-3 flex flex-col gap-2 mt-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Skeleton className="w-7 h-7 rounded-md" />
              <Skeleton className="w-7 h-7 rounded-md" />
            </div>
            <Skeleton className="w-16 h-7 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [showAppSkeleton, setShowAppSkeleton] = useState(false);

  // Set loading to false immediately after hydration/mount
  useEffect(() => {
    setLoading(false);
  }, []);

  // Show skeleton only if loading takes more than 200ms (prevents flashing on fast loads)
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowAppSkeleton(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setShowAppSkeleton(false);
    }
  }, [loading]);

  const renderPageSkeleton = () => {
    if (pathname === "/chat") return <ChatPageSkeleton />;
    if (["/agents", "/connectors"].includes(pathname)) return <GridPageSkeleton />;
    return <TablePageSkeleton />;
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#f8f8f7] dark:bg-[#1a1a1a]">
      <AnimatePresence mode="wait">
        {showAppSkeleton && (
          <motion.div
            key="app-initial-skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex w-full h-full overflow-hidden bg-[#f8f8f7] dark:bg-[#141414]"
          >
            <SidebarSkeleton />
            <div className="flex-1 overflow-hidden">
              {renderPageSkeleton()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main app content - renders instantly if loading is prompt */}
      <motion.div
        className="flex w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <Suspense fallback={<SidebarSkeleton />}>
          <AppSidebar />
        </Suspense>
        <main className="relative flex-1 overflow-hidden">
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}



