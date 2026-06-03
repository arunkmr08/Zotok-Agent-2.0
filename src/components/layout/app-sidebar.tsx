"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { cn, toggleDark } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_DEPLOYED = [
  { key: "category", href: "/category-view",   label: "Category Messages", icon: "nav-category.svg" },
  { key: "leads",    href: "/leads-view",       label: "New Leads",         icon: "nav-leads.svg"    },
  { key: "sheets",   href: "/groups-to-sheets", label: "Groups to Sheets",  icon: "nav-sheets.svg"   },
];

const NAV_WORKSPACE = [
  { href: "/agents",     label: "Karamcharis",   icon: "nav-karamchari.svg" },
  { href: "/connectors", label: "Connectors",    icon: "nav-connectors.svg" },
  { href: "/whatsapp",   label: "WhatsApp Sync", icon: "nav-whatsapp.svg"   },
  { href: "/search",     label: "Search",        icon: "nav-search.svg"     },
];

const RECENT_CHATS = [
  "Great news! Your order has been delivered.",
  "Your replacement for order #ORD-44291 is on its way.",
];

import { motion, AnimatePresence } from "motion/react";

function NavIcon({ icon }: { icon: string }) {
  return (
    <div className="w-[36px] h-[36px] flex items-center justify-center flex-shrink-0">
      <Image src={`/assets/icons/${icon}`} alt="" width={18} height={18} className="dark:brightness-0 dark:invert" />
    </div>
  );
}

function NavItem({
  href, icon, label, collapsed, isActive,
}: {
  href: string; icon: string; label: string;
  collapsed: boolean; isActive: boolean;
}) {
  const content = (
    <>
      {isActive && (
        <motion.div
          layoutId="activeNavBg"
          className={cn(
            "absolute inset-0 pointer-events-none z-0",
            collapsed
              ? "bg-[#e7f1ff] dark:bg-[#0049b5] rounded-[10px]"
              : "bg-[#e7f1ff] dark:bg-[#0049b5] border-l-[3px] border-[#0067ff] dark:border-[#5e9fff] rounded-tr-[6px] rounded-br-[6px]"
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <div className="relative z-10 flex items-center gap-[4px] w-full">
        <NavIcon icon={icon} />
        {!collapsed && (
          <span className="text-[14px] text-[#1f1f1f] dark:text-[#f0f0f0] tracking-[-0.09px] leading-normal">
            {label}
          </span>
        )}
      </div>
    </>
  );

  const containerCls = cn(
    "relative flex items-center w-full transition-colors",
    !isActive && "rounded-[10px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={<Link href={href} className={cn(containerCls, "justify-center")} /> as any}
        >
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>{label}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <Link href={href} className={containerCls}>
      {content}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [deployedAgents, setDeployedAgents] = useState<string[]>([]);

  function refreshDeployed() {
    const active = NAV_DEPLOYED.filter((a) =>
      localStorage.getItem(`zotok_agent_${a.key}`) === "active"
    ).map((a) => a.key);
    setDeployedAgents(active);
  }

  useEffect(() => {
    setCollapsed(localStorage.getItem("zotok_nav_collapsed") === "true");
    refreshDeployed();
    window.addEventListener("agentStateChange", refreshDeployed);
    return () => window.removeEventListener("agentStateChange", refreshDeployed);
  }, []);

  function handleCollapse(val: boolean) {
    setCollapsed(val);
    localStorage.setItem("zotok_nav_collapsed", String(val));
  }

  const activeDeployed = NAV_DEPLOYED.filter((a) => deployedAgents.includes(a.key));

  const sectionCls  = "px-[10px] py-[8px] text-[14px] text-[#858481] dark:text-[#595959] font-normal leading-[20px] tracking-[-0.09px]";

  return (
    <TooltipProvider delay={300}>
    <aside
      className={cn(
        "flex flex-col h-screen overflow-hidden bg-white dark:bg-[#1f1f1f] border-r border-[#f0f0f0] dark:border-[#262626] transition-all duration-300 flex-shrink-0",
        collapsed ? "w-[52px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-[8px]">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={() => handleCollapse(false)}
                  className="group w-[36px] h-[36px] flex items-center justify-center mx-auto rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <div className="group-hover:hidden bg-[#589981] dark:bg-[#043a26] rounded-[6px] w-[22px] h-[22px] flex items-center justify-center overflow-hidden">
                    <Image src="/assets/icons/zotok-logo-20.svg" alt="Zotok" width={14} height={14} />
                  </div>
                  <Image
                    src="/assets/icons/nav-toggle.svg"
                    alt="Expand"
                    width={18} height={18}
                    className="hidden group-hover:block dark:brightness-0 dark:invert rotate-180"
                  />
                </button>
              }
            />
            <TooltipContent side="right" sideOffset={8}>Expand</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <div className="flex items-center gap-[10px]">
              <div className="bg-[#589981] dark:bg-[#043a26] rounded-[10px] w-[36px] h-[36px] flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image src="/assets/icons/zotok-logo-20.svg" alt="Zotok" width={20} height={20} />
              </div>
              <span className="text-[18px] font-semibold text-[#1f1f1f] dark:text-[#f0f0f0] tracking-[-0.26px]">Zotok</span>
            </div>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => handleCollapse(true)}
                    className="w-[36px] h-[36px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  >
                    <Image src="/assets/icons/nav-toggle.svg" alt="Collapse" width={18} height={18} className="dark:brightness-0 dark:invert" />
                  </button>
                }
              />
              <TooltipContent side="bottom" sideOffset={4}>Collapse</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto flex flex-col gap-[8px] px-[8px] py-[8px]">

        {/* New Chat */}
        <NavItem href="/chat" icon="nav-new-chat.svg" label="New Chat"
          collapsed={collapsed} isActive={pathname === "/chat"} />

        {/* Deployed Karmacharis */}
        <AnimatePresence initial={false}>
          {activeDeployed.length > 0 && (
            <motion.div
              key="deployed-section"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-px">
                {!collapsed && <p className={sectionCls}>Deployed Karmacharis</p>}
                {activeDeployed.map((a) => (
                  <NavItem key={a.key} href={a.href} icon={a.icon} label={a.label}
                    collapsed={collapsed} isActive={pathname === a.href} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace */}
        <div className="flex flex-col gap-px">
          {!collapsed && <p className={sectionCls}>Workspace</p>}
          {NAV_WORKSPACE.map((item) => (
            <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label}
              collapsed={collapsed} isActive={pathname === item.href} />
          ))}
        </div>

        {/* Recent Chat */}
        {!collapsed && (
          <div className="flex flex-col gap-px">
            <p className={sectionCls}>Recent Chat</p>
            {RECENT_CHATS.map((chat, i) => (
              <div
                key={i}
                className="flex items-center px-[10px] py-[8px] rounded-[10px] cursor-pointer hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                <p className="text-[14px] text-[#1f1f1f] dark:text-[#f0f0f0] tracking-[-0.09px] leading-[20px] truncate">{chat}</p>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-[rgba(0,0,0,0.06)] dark:border-[#262626] flex items-center gap-[8px] px-[8px] py-[12px]">
        <Link href="/profile" className="flex-shrink-0">
          <div className="w-[36px] h-[36px] rounded-full bg-[#0067ff] dark:bg-[#003b91] flex items-center justify-center text-white dark:text-[#d9d9d9] text-[16px] font-semibold">
            P
          </div>
        </Link>
        {!collapsed && (
          <>
            <div className="flex flex-col gap-[2px] flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#1f1f1f] dark:text-[#f0f0f0] tracking-[-0.09px] truncate">Prathik Rati</p>
              <p className="text-[12px] text-[#858481] dark:text-[#8c8c8c] tracking-[0.01px] truncate">+91 93883 22332</p>
            </div>
            <div className="flex items-center flex-shrink-0">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={toggleDark}
                      className="w-[36px] h-[36px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                      aria-label="Toggle dark mode"
                    >
                      <Image src="/assets/icons/nav-theme.svg" alt="" width={18} height={18} className="dark:brightness-0 dark:invert" />
                    </button>
                  }
                />
                <TooltipContent side="top" sideOffset={4}>Toggle theme</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => router.push("/login")}
                      className="w-[36px] h-[36px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                      aria-label="Log out"
                    >
                      <Image src="/assets/icons/nav-logout.svg" alt="" width={18} height={18} className="dark:brightness-0 dark:invert" />
                    </button>
                  }
                />
                <TooltipContent side="top" sideOffset={4}>Log out</TooltipContent>
              </Tooltip>
            </div>
          </>
        )}
      </div>
    </aside>
    </TooltipProvider>
  );
}
