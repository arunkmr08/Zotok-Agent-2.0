"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWhatsapp } from "@/features/whatsapp/hooks/useWhatsapp";
import { GroupsModal } from "@/features/whatsapp/components/GroupsModal";

const NAV_ITEMS = [
  { key: "account",  label: "Account",           icon: "settings-account.svg"  },
  { key: "whatsapp", label: "WhatsApp Settings", icon: "settings-whatsapp.svg" },
  { key: "usage",    label: "Usage Limit",        icon: "settings-usage.svg"    },
  { key: "billing",  label: "Billing",            icon: "settings-billing.svg"  },
  { key: "upgrade",  label: "Upgrade Plan",       icon: "settings-upgrade.svg"  },
  { key: "data",     label: "Data Control",       icon: "settings-data.svg"     },
  { key: "help",     label: "Help",               icon: "settings-help.svg"     },
];

function WhatsAppSettingsPanel() {
  const wa = useWhatsapp();
  const { syncedGroups, slotsLeft, slotsUsed, allGroups } = wa;
  const groupObjects = syncedGroups
    .map((name) => allGroups.find((g) => g.name === name))
    .filter(Boolean) as typeof allGroups;

  return (
    <div className="flex flex-col gap-[22px]">
      {/* Connection card */}
      <div className="flex items-center gap-[12px] p-[13px] bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px]">
        <div className="w-[52px] h-[52px] flex-shrink-0 bg-white dark:bg-[#2a2a2a] border border-black/[0.12] dark:border-white/[0.08] rounded-[10px] flex items-center justify-center overflow-hidden">
          <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">
            Connected to +91 9876543210
          </p>
          <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">
            Last Sync 12 minutes ago · {slotsUsed} groups
          </p>
        </div>
        <button
          type="button"
          className="h-[38px] px-[16px] flex items-center gap-[8px] bg-[#dd360c] hover:bg-[#c42f0a] active:bg-[#b02a09] text-white text-[14px] font-semibold tracking-[-0.09px] rounded-[10px] transition-colors flex-shrink-0"
        >
          <Image src="/assets/icons/settings-logout-icon.svg" alt="" width={18} height={18} unoptimized />
          Logout
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#f0f0f0] dark:bg-[#2a2a2a]" />

      {/* Synced Groups */}
      <div className="flex flex-col gap-[14px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[2px]">
            <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">
              Synced Groups
            </p>
            <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">
              {slotsUsed} Groups Synced
            </p>
          </div>
          <Button
            variant="outline"
            onClick={wa.openAddGroups}
            disabled={slotsLeft === 0}
            className="h-[36px] rounded-[8px] gap-[6px] text-[14px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.09px] border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1f1f1f]"
          >
            <Image src="/assets/icons/settings-add.svg" alt="" width={18} height={18} className="dark:invert" unoptimized />
            Add Groups
          </Button>
        </div>

        {/* Groups list */}
        <div className="bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px] overflow-hidden">
          {groupObjects.map((group, i) => (
            <div
              key={group.name}
              className={cn(
                "flex items-center gap-[10px] px-[16px] py-[12px]",
                i < groupObjects.length - 1 && "border-b border-black/[0.06] dark:border-white/[0.06]"
              )}
            >
              <Image
                src={`/assets/icons/${group.avatar}`}
                alt=""
                width={36}
                height={36}
                className="rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.09px] leading-[18px] truncate">
                  {group.name}
                </p>
                <p className="text-[12px] text-[#858481] tracking-[0.01px] leading-[16px]">
                  {group.members}
                </p>
              </div>
              <div className="flex-shrink-0 overflow-hidden h-[20px] flex items-center">
                <AnimatePresence mode="wait" initial={false}>
                  {wa.syncingGroups[group.name] === "syncing" && (
                    <motion.span
                      key="syncing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-center gap-[5px] text-[11px] text-[#858481]"
                    >
                      <svg className="animate-spin flex-shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="4.5" stroke="#c0c0c0" strokeWidth="1.5" strokeDasharray="14 8" strokeLinecap="round" />
                      </svg>
                      Syncing...
                    </motion.span>
                  )}
                  {wa.syncingGroups[group.name] === "synced" && (
                    <motion.span
                      key="synced"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-center gap-[5px] text-[11px] text-emerald-500"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                        <path d="M2 6.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Synced
                    </motion.span>
                  )}
                  {!wa.syncingGroups[group.name] && (
                    <motion.button
                      key="trash"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      type="button"
                      onClick={() => wa.removeGroup(group.name)}
                      className="w-[20px] h-[20px] flex items-center justify-center hover:opacity-60 transition-opacity"
                      aria-label="Remove group"
                    >
                      <Image src="/assets/icons/settings-trash.svg" alt="" width={20} height={20} unoptimized />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GroupsModal
        groupsModal={wa.groupsModal}
        setGroupsModal={wa.setGroupsModal}
        groupSearch={wa.groupSearch}
        setGroupSearch={wa.setGroupSearch}
        pendingGroups={wa.pendingGroups}
        setPendingGroups={wa.setPendingGroups}
        filteredAvailable={wa.filteredAvailable}
        togglePending={wa.togglePending}
        handleSyncGroups={wa.handleSyncGroups}
      />
    </div>
  );
}

function PlaceholderPanel({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-20">
      <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px]">
        {label}
      </p>
      <p className="text-[14px] text-[#858481]">Coming soon</p>
    </div>
  );
}

export function AccountSettings({ onClose, defaultTab = "whatsapp" }: { onClose: () => void; defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const activeItem = NAV_ITEMS.find((n) => n.key === activeTab);

  return (
    <div className="flex gap-[12px] p-[17px] w-full h-full">

      {/* Left nav */}
      <div className="w-[200px] flex-shrink-0 flex flex-col py-[4px]">
        {NAV_ITEMS.map(({ key, label, icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px] w-full text-left transition-colors",
                isActive
                  ? "bg-[#e6f0ff] dark:bg-[#0049b5]/30"
                  : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              )}
            >
              <Image
                src={`/assets/icons/${icon}`}
                alt=""
                width={18}
                height={18}
                className="flex-shrink-0 dark:invert"
                unoptimized
              />
              <span className="text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] leading-[20px] whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right panel */}
      <div className="flex-1 min-w-0 bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] flex flex-col overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center justify-between px-[25px] pt-[21px] pb-0 flex-shrink-0">
          <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">
            {activeItem?.label}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Close"
          >
            <Image src="/assets/icons/settings-close.svg" alt="" width={20} height={20} className="dark:invert" unoptimized />
          </button>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto px-[25px] py-[21px]">
          {activeTab === "whatsapp" && <WhatsAppSettingsPanel />}
          {activeTab !== "whatsapp" && (
            <PlaceholderPanel label={activeItem?.label ?? ""} />
          )}
        </div>
      </div>

    </div>
  );
}
