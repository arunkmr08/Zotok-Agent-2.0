"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { cn, toggleDark } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AccountSettings } from "@/features/account/components/AccountSettings";
import { useUserAvatar } from "@/features/account/context/UserAvatarContext";

const NAV_DEPLOYED = [
  { key: "category", href: "/category-view",   label: "Category Messages", icon: "nav-category.svg", shortcut: "⌥⌘1" },
  { key: "leads",    href: "/leads-view",       label: "New Leads",         icon: "nav-leads.svg",    shortcut: "⌥⌘2" },
  { key: "sheets",   href: "/groups-to-sheets", label: "Groups to Sheets",  icon: "nav-sheets.svg",   shortcut: "⌥⌘3" },
];

const NAV_WORKSPACE = [
  { href: "/agents",     label: "Karamcharis",   icon: "nav-karamchari.svg", shortcut: "⌘⇧K" },
  { href: "/connectors", label: "Connectors",    icon: "nav-connectors.svg", shortcut: "⌘⇧L" },
  { href: "/whatsapp",   label: "WhatsApp Sync", icon: "nav-whatsapp.svg",   shortcut: "⌘⇧C" },
];

// cmd+shift shortcuts
const SHORTCUT_MAP: Record<string, string> = {
  KeyO:   "/chat",
  KeyK:   "/agents",
  KeyL:   "/connectors",
  KeyC:   "/whatsapp",
};

// cmd only shortcuts (no shift, no alt)
const SHORTCUT_MAP_NO_SHIFT: Record<string, string> = {
  KeyK: "/search",
};

// option+cmd shortcuts for deployed karmacharis (gated by deployed state)
const DEPLOYED_SHORTCUTS = [
  { code: "Digit1", key: "category", href: "/category-view"    },
  { code: "Digit2", key: "leads",    href: "/leads-view"       },
  { code: "Digit3", key: "sheets",   href: "/groups-to-sheets" },
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

function ShortcutBadge({ shortcut }: { shortcut: string }) {
  return (
    <span className="text-[11px] font-medium text-[#858481] dark:text-[#595959] bg-black/[0.05] dark:bg-white/[0.08] rounded-[5px] px-[5px] py-[2px] tracking-[0px] flex-shrink-0 leading-none">
      {shortcut}
    </span>
  );
}

function NavItem({
  href, icon, label, collapsed, isActive, shortcut,
}: {
  href: string; icon: string; label: string;
  collapsed: boolean; isActive: boolean; shortcut?: string;
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      <div className="relative z-10 flex items-center gap-[4px] w-full">
        <NavIcon icon={icon} />
        {!collapsed && (
          <>
            <span className="flex-1 text-[14px] font-medium text-[#1f1f1f] dark:text-[#f0f0f0] tracking-[-0.09px] leading-normal">
              {label}
            </span>
            {shortcut && (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pr-[4px]">
                <ShortcutBadge shortcut={shortcut} />
              </span>
            )}
          </>
        )}
      </div>
    </>
  );

  const containerCls = cn(
    "group relative flex items-center w-full transition-colors",
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
        <TooltipContent side="right" sideOffset={8}>
          <span>{label}</span>
          {shortcut && <ShortcutBadge shortcut={shortcut} />}
        </TooltipContent>
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const recentIndex = searchParams.get("recentIndex");
  const [collapsed, setCollapsed] = useState(false);
  const [deployedAgents, setDeployedAgents] = useState<string[]>([]);
  const [sidebarReady, setSidebarReady] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountDefaultTab, setAccountDefaultTab] = useState("whatsapp");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function openAccount(tab: string) {
    setDropdownOpen(false);
    setAccountDefaultTab(tab);
    setAccountOpen(true);
  }
  const { avatarSrc, bizName, whatsappPhone } = useUserAvatar();

  function refreshDeployed() {
    const active = NAV_DEPLOYED.filter((a) =>
      localStorage.getItem(`zotok_agent_${a.key}`) === "active"
    ).map((a) => a.key);
    setDeployedAgents(active);
  }

  useEffect(() => {
    setCollapsed(localStorage.getItem("zotok_nav_collapsed") === "true");
    refreshDeployed();
    setSidebarReady(true);
    window.addEventListener("agentStateChange", refreshDeployed);
    return () => window.removeEventListener("agentStateChange", refreshDeployed);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      if (!(e.metaKey || e.ctrlKey)) return;

      if (e.altKey && !e.shiftKey) {
        // ⌥⌘ + number → deployed karmachari pages (only if deployed)
        const match = DEPLOYED_SHORTCUTS.find((s) => s.code === e.code);
        if (match && deployedAgents.includes(match.key)) {
          e.preventDefault();
          router.push(match.href);
        }
      } else if (e.shiftKey && !e.altKey) {
        // ⌘⇧ shortcuts
        const href = SHORTCUT_MAP[e.code];
        if (href) { e.preventDefault(); router.push(href); }
      } else if (!e.shiftKey && !e.altKey) {
        // ⌘ only shortcuts
        const href = SHORTCUT_MAP_NO_SHIFT[e.code];
        if (href) { e.preventDefault(); router.push(href); }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, deployedAgents]);

  function handleCollapse(val: boolean) {
    setCollapsed(val);
    localStorage.setItem("zotok_nav_collapsed", String(val));
  }

  const activeDeployed = NAV_DEPLOYED.filter((a) => deployedAgents.includes(a.key));

  const sectionCls  = "px-[10px] py-[8px] text-[14px] text-[#858481] dark:text-[#595959] font-normal leading-[20px] tracking-[-0.09px]";

  return (
    <TooltipProvider delay={300}>
    <>
    <aside
      className={cn(
        "flex flex-col h-screen overflow-hidden bg-white dark:bg-[#141414] border-r border-[#f0f0f0] dark:border-[#262626] transition-all duration-300 flex-shrink-0",
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
        <NavItem href="/chat" icon="nav-new-chat.svg" label="New Chat" shortcut="⌘⇧O"
          collapsed={collapsed} isActive={pathname === "/chat" && recentIndex === null} />

        {/* Deployed Karmacharis */}
        {sidebarReady && (
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
                    <NavItem key={a.key} href={a.href} icon={a.icon} label={a.label} shortcut={a.shortcut}
                      collapsed={collapsed} isActive={pathname === a.href} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Workspace */}
        <div className="flex flex-col gap-px">
          {!collapsed && <p className={sectionCls}>Workspace</p>}
          {NAV_WORKSPACE.map((item) => (
            <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} shortcut={item.shortcut}
              collapsed={collapsed} isActive={pathname === item.href} />
          ))}
        </div>

        {/* Recent Chat */}
        {!collapsed && (
          <div className="flex flex-col gap-px">
            <p className={sectionCls}>Recent Chat</p>
            {RECENT_CHATS.map((chat, i) => {
              const isRecentActive = pathname === "/chat" && recentIndex === String(i);
              return (
                <Link
                  key={i}
                  href={`/chat?recentIndex=${i}`}
                  className={cn(
                    "relative flex items-center px-[10px] py-[8px] rounded-[10px] cursor-pointer transition-colors",
                    isRecentActive
                      ? "bg-[#e7f1ff] dark:bg-[#0049b5] border-l-[3px] border-[#0067ff] dark:border-[#5e9fff] rounded-tl-none rounded-bl-none"
                      : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  )}
                >
                  <p className="text-[14px] font-medium text-[#1f1f1f] dark:text-[#f0f0f0] tracking-[-0.09px] leading-[20px] truncate">{chat}</p>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-[rgba(0,0,0,0.06)] dark:border-[#262626] flex items-center gap-[8px] px-[8px] py-[12px]">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger render={
            <button type="button" className={cn(
              "flex items-center gap-[8px] w-full min-w-0 rounded-[10px] px-[4px] py-[4px] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors focus:outline-none",
              collapsed && "justify-center"
            )}>
              <div className="w-[36px] h-[36px] rounded-full bg-[#0067ff] dark:bg-[#003b91] flex items-center justify-center text-white dark:text-[#d9d9d9] text-[16px] font-semibold overflow-hidden flex-shrink-0">
                {avatarSrc ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" /> : "P"}
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0 flex-1 text-left">
                  <p className="font-semibold text-[13px] text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[18px] truncate">{bizName}</p>
                  <div className="flex items-center gap-[5px]">
                    <p className="font-normal text-[12px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[16px] truncate">{whatsappPhone}</p>
                    <span className="text-[10px] font-semibold px-[5px] py-[1px] rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 flex-shrink-0">Free</span>
                  </div>
                </div>
              )}
            </button>
          } />
          <DropdownMenuContent side="top" align="start" sideOffset={8}
            className="w-[260px] !rounded-[14px] !p-0 !shadow-[0px_8px_24px_rgba(0,0,0,0.14)] border border-black/[0.12] dark:border-white/[0.1] bg-white dark:bg-[#1f1f1f] overflow-hidden">
            {/* User info */}
            <div className="flex items-center gap-[8px] px-[12px] py-[12px]">
              <div className="w-[32px] h-[32px] rounded-full bg-[#0067ff] dark:bg-[#003b91] flex items-center justify-center text-white text-[14px] font-semibold flex-shrink-0 overflow-hidden">
                {avatarSrc ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" /> : "P"}
              </div>
              <div className="flex flex-col gap-0 min-w-0">
                <p className="font-semibold text-[14px] text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[20px] truncate">{bizName}</p>
                <div className="flex items-center gap-[6px]">
                  <p className="font-normal text-[13px] text-[#858481] dark:text-[#8c8c8c] tracking-[-0.09px] leading-[20px]">{whatsappPhone}</p>
                  <span className="text-[11px] font-semibold px-[6px] py-[1px] rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 flex-shrink-0">Free</span>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-[#f0f0f0] dark:bg-[#2a2a2a]" />
            {/* Section 1 */}
            <div className="py-[4px]">
              {[
                { label: "WhatsApp Settings", icon: <Image src="/assets/icons/menu-settings.svg" alt="" width={18} height={18} className="dark:invert" unoptimized priority />, onClick: () => openAccount("whatsapp") },
                { label: "Account",      icon: <Image src="/assets/icons/menu-profile.svg" alt="" width={18} height={18} className="dark:invert" unoptimized priority />, onClick: () => openAccount("account") },
                { label: "Usage Limit",  icon: <Image src="/assets/icons/settings-usage.svg" alt="" width={18} height={18} className="dark:invert" unoptimized priority />, onClick: () => openAccount("usage") },
                { label: "Upgrade Plan", icon: <Image src="/assets/icons/menu-upgrade.svg" alt="" width={18} height={18} className="dark:invert" unoptimized priority />, onClick: () => openAccount("upgrade") },
              ].map(({ label, icon, onClick }) => (
                <button key={label} type="button" onClick={onClick}
                  className="w-full flex items-center gap-[4px] px-[12px] h-[36px] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors">
                  <div className="w-[36px] h-[36px] flex items-center justify-center flex-shrink-0 text-[#34322d] dark:text-[#d9d9d9]">{icon}</div>
                  <span className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] leading-[20px]">{label}</span>
                </button>
              ))}
            </div>
            <DropdownMenuSeparator className="bg-[#f0f0f0] dark:bg-[#2a2a2a]" />
            {/* Section 2 */}
            <div className="py-[4px]">
              {[
                { label: "Logout", icon: <Image src="/assets/icons/menu-logout.svg" alt="" width={18} height={18} className="dark:invert" unoptimized priority />, onClick: () => router.push("/login") },
              ].map(({ label, icon, onClick }) => (
                <button key={label} type="button" onClick={onClick}
                  className="w-full flex items-center gap-[4px] px-[12px] h-[36px] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors">
                  <div className="w-[36px] h-[36px] flex items-center justify-center flex-shrink-0 text-[#34322d] dark:text-[#d9d9d9]">{icon}</div>
                  <span className="font-medium text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] leading-[20px]">{label}</span>
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {!collapsed && (
          <>
            <div className="flex flex-col gap-[2px] flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#1f1f1f] dark:text-[#f0f0f0] tracking-[-0.09px] truncate">Prathik Rati</p>
              <p className="text-[12px] text-[#858481] dark:text-[#8c8c8c] tracking-[0.01px] truncate">+91 93883 22332</p>
            </div>
            <Tooltip>
              <TooltipTrigger render={
                <button onClick={toggleDark} className="w-[36px] h-[36px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]" aria-label="Toggle dark mode">
                  <Image src="/assets/icons/nav-theme.svg" alt="" width={18} height={18} className="dark:brightness-0 dark:invert" />
                </button>
              } />
              <TooltipContent side="top" sideOffset={4}>Toggle theme</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </aside>

    {/* Account Settings popup */}
    <AnimatePresence>
      {accountOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setAccountOpen(false); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-[#f8f8f7] dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.08)] w-full max-w-[1024px] h-[700px] max-h-[800px] flex overflow-hidden"
          >
            <AccountSettings
              onClose={() => setAccountOpen(false)}
              defaultTab={accountDefaultTab}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    </>
    </TooltipProvider>
  );
}
