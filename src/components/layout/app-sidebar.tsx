"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { cn, toggleDark } from "@/lib/utils";

const NAV_MODULES = [
  { href: "/agents", nav: "agents", label: "Karamcharis", icon: "nav-karamchari.svg", tooltip: "Karamcharis" },
  { href: "/connectors", nav: "connectors", label: "Connectors", icon: "nav-connectors.svg", tooltip: "Connectors" },
  { href: "/whatsapp", nav: "whatsapp", label: "WhatsApp Sync", icon: "nav-whatsapp.svg", tooltip: "WhatsApp Sync" },
];

const DEPLOYED_AGENTS = [
  { key: "category", href: "/category-view", nav: "category-view", label: "Category Messages", icon: "nav-category.svg" },
  { key: "leads", href: "/leads-view", nav: "leads-view", label: "New Leads", icon: "nav-leads.svg" },
  { key: "sheets", href: "/groups-to-sheets", nav: "groups-to-sheets", label: "Groups to Sheets", icon: "nav-sheets.svg" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [deployedAgents, setDeployedAgents] = useState<string[]>([]);

  useEffect(() => {
    const active = DEPLOYED_AGENTS.filter((a) => {
      const stored = localStorage.getItem(`zotok_agent_${a.key}`);
      return stored === "active";
    }).map((a) => a.key);
    setDeployedAgents(active);
  }, []);

  function handleLogout() {
    router.push("/login");
  }


  const activeDeployed = DEPLOYED_AGENTS.filter((a) => deployedAgents.includes(a.key));

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-[#ebebeb] dark:bg-[#1f1f1f] border-r border-black/[0.06] dark:border-white/[0.06] transition-all duration-200 flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Head */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
        {!collapsed && (
          <Link href="/chat" className="flex items-center gap-2">
            <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={28} height={28} />
            <span className="font-bold text-base text-zinc-900 dark:text-white">Zotok</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn("p-1.5 rounded-md hover:bg-black/[0.06] dark:hover:bg-white/[0.06] text-[#34322d] dark:text-[#adadad]", collapsed && "mx-auto")}
          aria-label="Toggle sidebar"
        >
          <Image src="/assets/icons/nav-toggle.svg" alt="" width={18} height={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {/* New Chat */}
        <Link
          href="/chat"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/chat"
              ? "bg-black/[0.06] dark:bg-white/[0.06] text-[#111] dark:text-[#dadada]"
              : "text-[#34322d] dark:text-[#adadad] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          )}
        >
          <Image src="/assets/icons/nav-new-chat.svg" alt="" width={18} height={18} className="flex-shrink-0" />
          {!collapsed && <span>New Chat</span>}
        </Link>

        {/* Deployed Karmacharis */}
        {activeDeployed.length > 0 && (
          <div className="pt-3">
            {!collapsed && (
              <p className="px-3 pb-1 text-xs font-semibold text-[#6d6c6b] dark:text-[#7f7f7f] uppercase tracking-wider">
                Deployed Karmacharis
              </p>
            )}
            {activeDeployed.map((a) => (
              <Link
                key={a.key}
                href={a.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === a.href
                    ? "bg-black/[0.06] dark:bg-white/[0.06] text-[#111] dark:text-[#dadada]"
                    : "text-[#34322d] dark:text-[#adadad] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                )}
              >
                <Image src={`/assets/icons/${a.icon}`} alt="" width={18} height={18} className="flex-shrink-0" />
                {!collapsed && <span>{a.label}</span>}
              </Link>
            ))}
          </div>
        )}

        {/* Modules */}
        <div className="pt-3">
          {!collapsed && (
            <p className="px-3 pb-1 text-xs font-semibold text-[#6d6c6b] dark:text-[#7f7f7f] uppercase tracking-wider">Modules</p>
          )}
          {NAV_MODULES.map((item) => (
            <Link
              key={item.nav}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-black/[0.06] dark:bg-white/[0.06] text-[#111] dark:text-[#dadada]"
                  : "text-[#34322d] dark:text-[#adadad] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              )}
            >
              <Image src={`/assets/icons/${item.icon}`} alt="" width={18} height={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-black/[0.06] dark:border-white/[0.06] px-2 py-3">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors mb-1",
            collapsed && "justify-center"
          )}
        >
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            P
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#111] dark:text-[#dadada] truncate">Prathik Rati</p>
              <p className="text-xs text-[#6d6c6b] dark:text-[#7f7f7f] truncate">+91 93883 22332</p>
            </div>
          )}
        </Link>
        <div className={cn("flex gap-1", collapsed ? "justify-center flex-col items-center" : "px-3")}>
          <button
            onClick={toggleDark}
            className="p-2 rounded-md hover:bg-black/[0.06] dark:hover:bg-white/[0.06] text-[#34322d] dark:text-[#adadad]"
            aria-label="Toggle dark mode"
          >
            <Image src="/assets/icons/nav-theme.svg" alt="" width={16} height={16} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-md hover:bg-black/[0.06] dark:hover:bg-white/[0.06] text-[#34322d] dark:text-[#adadad]"
            aria-label="Log out"
          >
            <Image src="/assets/icons/nav-logout.svg" alt="" width={16} height={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
