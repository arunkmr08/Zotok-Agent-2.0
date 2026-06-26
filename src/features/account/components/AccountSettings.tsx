"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Popover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useWhatsapp } from "@/features/whatsapp/hooks/useWhatsapp";
import { useWhatsappConnection } from "@/features/whatsapp/context/WhatsappConnectionContext";
import { useUserAvatar } from "@/features/account/context/UserAvatarContext";
import { useUsage } from "@/features/account/hooks/useUsage";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Check, Sparkle, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { key: "whatsapp", label: "WhatsApp Settings", icon: "settings-whatsapp.svg" },
  { key: "account", label: "Account", icon: "settings-account.svg" },
  { key: "usage", label: "Usage Limit", icon: "settings-usage.svg" },
  { key: "billing", label: "Billing", icon: "settings-billing.svg" },
  { key: "upgrade", label: "Upgrade Plan", icon: "settings-upgrade.svg" },
];

function WhatsAppSettingsPanel() {
  const wa = useWhatsapp();
  const { syncedGroups, slotsLeft, slotsUsed, allGroups } = wa;
  const groupObjects = syncedGroups
    .map((name) => allGroups.find((g) => g.name === name))
    .filter(Boolean) as typeof allGroups;
  const { connected, disconnect, setReconnectModalOpen, registerGroupsRestorer } = useWhatsappConnection();

  // Keep the context's restorer pointed at this hook instance so reconnecting
  // can hand back the groups that were synced right before logout.
  registerGroupsRestorer(wa.restoreGroups);

  function handleConnectionAction() {
    if (connected) {
      disconnect(wa.syncedGroups);
      wa.handleDisconnect();
    } else {
      setReconnectModalOpen(true);
    }
  }

  return (
    <div className="flex flex-col gap-[22px]">
      {/* Connection card */}
      <div className="flex items-center gap-[12px] p-[13px] bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px]">
        <div className="w-[52px] h-[52px] flex-shrink-0 bg-white dark:bg-[#2a2a2a] border border-black/[0.12] dark:border-white/[0.08] rounded-[10px] flex items-center justify-center overflow-hidden">
          <Image src="/assets/avatars/wa-icon.svg" alt="Zotok" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">
            {connected ? "Connected to +91 9876543210" : "Disconnected"}
          </p>
          <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">
            {connected ? `Last Sync 12 minutes ago · ${slotsUsed} groups` : "Reconnect to resume syncing groups."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleConnectionAction}
          className={cn(
            "h-[38px] px-[16px] flex items-center gap-[8px] text-white text-[14px] font-semibold tracking-[-0.09px] rounded-[10px] transition-colors flex-shrink-0",
            connected
              ? "bg-[#dd360c] hover:bg-[#c42f0a] active:bg-[#b02a09]"
              : "bg-[#0067ff] hover:bg-[#0055d4] active:bg-[#004abd]"
          )}
        >
          <Image src={connected ? "/assets/icons/settings-logout-icon.svg" : "/assets/icons/settings-add.svg"} alt="" width={18} height={18} className={cn(!connected && "dark:invert")} unoptimized />
          {connected ? "Logout" : "Reconnect"}
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
          <Popover.Root
            open={wa.groupsModal}
            onOpenChange={(open) => {
              if (open) {
                wa.setGroupsModal(true);
              } else {
                wa.setGroupsModal(false);
                wa.setPendingGroups(new Set());
              }
            }}
          >
            <Popover.Trigger
              disabled={slotsLeft === 0 || !connected}
              className="h-[36px] rounded-[8px] flex items-center gap-[6px] px-[12px] text-[14px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.09px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1f1f1f] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Image src="/assets/icons/settings-add.svg" alt="" width={18} height={18} className="dark:invert" unoptimized />
              Add Groups
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner side="bottom" align="end" sideOffset={8} className="z-[210]">
                <Popover.Popup className="w-[300px] bg-white dark:bg-[#1f1f1f] rounded-[14px] shadow-[0px_8px_24px_rgba(0,0,0,0.14)] border border-black/[0.12] dark:border-white/[0.1] p-[16px] flex flex-col gap-[12px]">
                  <p className="font-semibold text-[15px] text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px]">Choose Groups to Sync</p>

                  <div className="flex items-center gap-2 h-[40px] bg-[#f4f3ef] dark:bg-[#242424] border border-black/[0.08] dark:border-white/[0.08] rounded-lg px-3">
                    <Image src="/assets/icons/icon-search.svg" alt="" width={14} height={14} />
                    <input
                      type="text"
                      placeholder="Search Group"
                      value={wa.groupSearch}
                      onChange={(e) => wa.setGroupSearch(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-[#34322d] dark:text-[#dadada]"
                    />
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {wa.filteredAvailable.length === 0 ? (
                      <p className="text-sm text-[#858481] text-center py-4">All groups already synced or no results.</p>
                    ) : wa.filteredAvailable.map((g) => {
                      const isSel = wa.pendingGroups.has(g.name);
                      return (
                        <div
                          key={g.name}
                          onClick={() => wa.togglePending(g.name)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors",
                            isSel
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                              : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.12]"
                          )}
                        >
                          <Image
                            src={`/assets/icons/${g.avatar}`}
                            alt="" width={28} height={28}
                            className="rounded-full flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#34322d] dark:text-[#dadada] truncate">{g.name}</p>
                            <p className="text-xs text-[#858481]">{g.members}</p>
                          </div>
                          <Checkbox
                            checked={isSel}
                            onClick={(e) => e.stopPropagation()}
                            readOnly
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => { wa.setGroupsModal(false); wa.setPendingGroups(new Set()); }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={wa.pendingGroups.size === 0}
                      onClick={wa.handleSyncGroups}
                    >
                      Add selected
                    </Button>
                  </div>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
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

    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">
      {children}
    </p>
  );
}


function ReadonlyInput({ value }: { value: string }) {
  return (
    <input
      type="text"
      value={value}
      readOnly
      className="w-full h-[41px] bg-[#f0f0f0] dark:bg-[#242424] border border-black/[0.08] dark:border-white/[0.06] rounded-[8px] px-[13px] text-[14px] text-[#262626] dark:text-[#d9d9d9] tracking-[-0.09px] outline-none cursor-default"
    />
  );
}

function loadAccount() {
  try { return JSON.parse(localStorage.getItem("zotok_account") ?? "{}"); }
  catch { return {}; }
}

function AccountPanel({ onSave }: { onSave: () => void }) {
  const { avatarSrc, setAvatarSrc, setUserName, setBizName: syncBizName } = useUserAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(() => loadAccount().name ?? "Prakash Yadav");
  const [bizName, setBizName] = useState(() => loadAccount().bizName ?? "JK Traders");
  const [address, setAddress] = useState(() => loadAccount().address ?? "122/32/H/S, Aditya Enclave, Ground Floor, Venkateswara Nagar, Kondapur");
  const [city, setCity] = useState(() => loadAccount().city ?? "Hyderabad");
  const [state, setStateVal] = useState(() => loadAccount().state ?? "Telangana");
  const [district, setDistrict] = useState(() => loadAccount().district ?? "Ranga Reddy");
  const [pin, setPin] = useState(() => loadAccount().pin ?? "500048");

  function handleSave() {
    localStorage.setItem("zotok_account", JSON.stringify({ name, bizName, address, city, state, district, pin }));
    setUserName(name);
    syncBizName(bizName);
    onSave();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarSrc(URL.createObjectURL(file));
  }

  function handleRemoveAvatar() {
    setAvatarSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-[22px]">


      {/* Avatar */}
      <div className="flex items-center justify-between">
        <FieldLabel>Avatar</FieldLabel>
        <div className="flex items-center gap-[10px]">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0 ring-2 ring-transparent hover:ring-[#0067ff] transition-all"
            title="Click to change avatar"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#0067ff] flex items-center justify-center">
                <span className="text-white text-[16px] font-semibold leading-none">P</span>
              </div>
            )}
          </button>
          {avatarSrc && (
            <button type="button" onClick={handleRemoveAvatar} className="text-[13px] font-medium text-[#dd360c] hover:underline">
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-[#f0f0f0] dark:bg-[#2a2a2a]" />

      {/* Your Name */}
      <div className="flex items-center justify-between gap-[16px]">
        <FieldLabel>Your Name</FieldLabel>
        <div className="w-[55%]">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[40px] bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[8px] px-[12px] text-[14px] text-[#141414] dark:text-[#f0f0f0] tracking-[-0.09px] leading-[18px] outline-none focus:ring-1 focus:ring-[#0067ff] transition-shadow"
          />
        </div>
      </div>

      <div className="h-px bg-[#f0f0f0] dark:bg-[#2a2a2a]" />

      {/* Business Details */}
      <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Business Details</p>

      <div className="flex flex-col gap-[20px]">

        {/* GST row — read-only */}
        <div className="flex gap-[16px]">
          <div className="flex-1 flex flex-col gap-[4px]">
            <FieldLabel>GST Number</FieldLabel>
            <ReadonlyInput value="36LVWLK3103B5ZM" />
          </div>
          <div className="flex-1 flex flex-col gap-[4px]">
            <FieldLabel>GST Linked Mobile Number</FieldLabel>
            <ReadonlyInput value="+91 9889763331" />
          </div>
        </div>

        {/* Business Name */}
        <div className="flex flex-col gap-[4px]">
          <FieldLabel>Business Name</FieldLabel>
          <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)}
            className="w-full h-[40px] bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[8px] px-[12px] text-[14px] text-[#141414] dark:text-[#f0f0f0] tracking-[-0.09px] outline-none focus:ring-1 focus:ring-[#0067ff] transition-shadow" />
        </div>

        {/* Business Address */}
        <div className="flex flex-col gap-[4px]">
          <FieldLabel>Business Address</FieldLabel>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full h-[40px] bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[8px] px-[12px] text-[14px] text-[#141414] dark:text-[#f0f0f0] tracking-[-0.09px] outline-none focus:ring-1 focus:ring-[#0067ff] transition-shadow" />
        </div>

        {/* City + State */}
        <div className="flex gap-[12px]">
          <div className="flex-1 flex flex-col gap-[4px]">
            <FieldLabel>City / Town</FieldLabel>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
              className="w-full h-[40px] bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[8px] px-[12px] text-[14px] text-[#141414] dark:text-[#f0f0f0] tracking-[-0.09px] outline-none focus:ring-1 focus:ring-[#0067ff] transition-shadow" />
          </div>
          <div className="flex-1 flex flex-col gap-[4px]">
            <FieldLabel>State</FieldLabel>
            <input type="text" value={state} onChange={(e) => setStateVal(e.target.value)}
              className="w-full h-[40px] bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[8px] px-[12px] text-[14px] text-[#141414] dark:text-[#f0f0f0] tracking-[-0.09px] outline-none focus:ring-1 focus:ring-[#0067ff] transition-shadow" />
          </div>
        </div>

        {/* District + Pin Code */}
        <div className="flex gap-[12px]">
          <div className="flex-1 flex flex-col gap-[4px]">
            <FieldLabel>District</FieldLabel>
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)}
              className="w-full h-[40px] bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[8px] px-[12px] text-[14px] text-[#141414] dark:text-[#f0f0f0] tracking-[-0.09px] outline-none focus:ring-1 focus:ring-[#0067ff] transition-shadow" />
          </div>
          <div className="flex-1 flex flex-col gap-[4px]">
            <FieldLabel>Pin Code</FieldLabel>
            <input type="text" value={pin} onChange={(e) => setPin(e.target.value)}
              className="w-full h-[40px] bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[8px] px-[12px] text-[14px] text-[#141414] dark:text-[#f0f0f0] tracking-[-0.09px] outline-none focus:ring-1 focus:ring-[#0067ff] transition-shadow" />
          </div>
        </div>
      </div>

      {/* Save Changes */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="h-[38px] px-[16px] bg-[#0067ff] hover:bg-[#0055d4] active:bg-[#004abd] text-white text-[14px] font-semibold tracking-[-0.09px] rounded-[10px] transition-colors"
        >
          Save Changes
        </button>
      </div>

      <div className="h-px bg-[#f0f0f0] dark:bg-[#2a2a2a]" />

      {/* Delete Account */}
      <div className="bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px] p-[17px] flex items-center gap-[16px]">
        <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
          <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Delete Account</p>
          <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">
            This will permanently delete your account and all your previous conversations with ZöChief.
          </p>
        </div>
        <button
          type="button"
          className="h-[38px] px-[14px] bg-[#dd360c] hover:bg-[#c42f0a] active:bg-[#b02a09] border border-[#dd360c] text-white text-[14px] font-semibold tracking-[-0.09px] rounded-[8px] transition-colors flex-shrink-0"
        >
          Delete Account
        </button>
      </div>

    </div>
  );
}


function AnimatedNumber({ value, duration = 700 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    let startTime: number | null = null;

    function tick(now: number) {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

function formatCompact(n: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

function ModelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <path d="M37.532 16.87a9.963 9.963 0 00-.856-8.184 10.078 10.078 0 00-10.855-4.835 9.952 9.952 0 00-7.485-3.348 10.079 10.079 0 00-9.614 6.977 9.967 9.967 0 00-6.664 4.834 10.08 10.08 0 001.24 11.817 9.965 9.965 0 00.856 8.185 10.079 10.079 0 0010.855 4.835 9.965 9.965 0 007.485 3.348 10.078 10.078 0 009.617-6.981 9.967 9.967 0 006.663-4.834 10.079 10.079 0 00-1.243-11.814zM22.498 37.886a7.474 7.474 0 01-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 00.655-1.134V19.054l3.366 1.944a.12.12 0 01.066.092v9.299a7.505 7.505 0 01-7.49 7.496zM6.392 31.006a7.471 7.471 0 01-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 001.308 0l9.724-5.614v3.888a.12.12 0 01-.048.103L16.628 33.95a7.504 7.504 0 01-10.237-2.944zM4.297 13.62A7.469 7.469 0 018.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 00.654 1.132l9.723 5.614-3.366 1.944a.12.12 0 01-.114.012L7.044 23.86a7.504 7.504 0 01-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 01.114-.012l8.048 4.648a7.498 7.498 0 01-1.158 13.528v-9.476a1.293 1.293 0 00-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 00-1.308 0l-9.723 5.614v-3.888a.12.12 0 01.048-.103l8.05-4.645a7.497 7.497 0 0111.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 01-.065-.092v-9.299a7.497 7.497 0 0112.293-5.756 6.94 6.94 0 00-.236.134l-7.965 4.6a1.294 1.294 0 00-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.497v4.994l-4.331 2.5-4.331-2.5V18z" fill="currentColor" />
    </svg>
  );
}

function UsageBar({ pct }: { pct: number }) {
  const color = pct > 90 ? "#dd360c" : pct > 70 ? "#f59e0b" : "#0067ff";
  return (
    <div className="relative h-[6px] w-full rounded-[12px] bg-[#f0f0f0] dark:bg-[#2a2a2a]">
      <div
        className="absolute inset-y-0 left-0 rounded-[12px] transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function UpgradeCard({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="bg-[#e6f0ff] dark:bg-[#0049b5]/20 border border-[#e83535] rounded-[12px] p-[17px] flex items-center gap-[16px]">
      <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
        <p className="text-[14px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Upgrade to Pro</p>
        <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">
          Top up usage credits to keep using ZöChief uninterrupted if you hit a limit.
        </p>
      </div>
      <button
        type="button"
        onClick={onUpgrade}
        className="h-[36px] px-[14px] text-white text-[14px] font-semibold tracking-[-0.09px] rounded-[8px] flex-shrink-0 whitespace-nowrap transition-opacity hover:opacity-90 active:opacity-80"
        style={{ background: "linear-gradient(7.16deg, #e83535 14.59%, #8135e8 51.66%, #35a7e8 85.6%)" }}
      >
        Upgrade Plan
      </button>
    </div>
  );
}

function UsageLimitPanel({ onNavigate, onBuyCredits }: { onNavigate: (tab: string) => void; onBuyCredits: () => void }) {
  const u = useUsage();
  const limitReached = u.isBlocked;

  return (
    <div className="flex flex-col gap-[22px]">

      {/* Limits card */}
      <div className="bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px] p-[17px] flex flex-col gap-[28px]">

        {/* Plan label */}
        <div className="flex items-center justify-between">
          <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">
            Plan: ZöChief {u.plan === "pro" ? "Pro" : "Free"} Plan
          </p>
          <div className="flex items-center gap-[12px]">
            <button type="button" onClick={u.forceMax} className="text-[13px] font-medium text-[#0067ff] hover:underline">
              Make 100%
            </button>
            <button type="button" onClick={u.resetUsage} className="text-[13px] font-medium text-[#858481] hover:underline">
              Reset Limit
            </button>
            <button
              type="button"
              onClick={() => u.setPlan(u.plan === "free" ? "pro" : "free")}
              className="text-[13px] font-medium text-[#8135e8] hover:underline"
            >
              {u.plan === "free" ? "Switch to Pro" : "Switch to Free"}
            </button>
          </div>
        </div>

        {/* Daily */}
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Daily Limit</p>
            <p className="text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] leading-[22px] tabular-nums"><AnimatedNumber value={u.dailyPct} />% Used</p>
          </div>
          <UsageBar pct={u.dailyPct} />
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">{u.dailyResetLabel}</p>
            <p className="text-[12px] text-[#858481] tracking-[-0.09px] leading-[20px] tabular-nums">{formatCompact(u.dailyUsed)} / {formatCompact(u.dailyLimit)} tokens</p>
          </div>
        </div>

        <div className="h-px bg-[#f0f0f0] dark:bg-[#2a2a2a]" />

        {/* Monthly */}
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Monthly Limit</p>
            <p className="text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] leading-[22px] tabular-nums"><AnimatedNumber value={u.monthlyPct} />% Used</p>
          </div>
          <UsageBar pct={u.monthlyPct} />
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">{u.monthlyResetLabel}</p>
            <p className="text-[12px] text-[#858481] tracking-[-0.09px] leading-[20px] tabular-nums">{formatCompact(u.monthlyUsed)} / {formatCompact(u.monthlyLimit)} tokens</p>
          </div>
        </div>

        {/* Usage Credits — pro plan only, when credits have been purchased */}
        {u.plan === "pro" && u.creditsTotal > 0 && (
          <>
            <div className="h-px bg-[#f0f0f0] dark:bg-[#2a2a2a]" />
            <div className="flex flex-col gap-[4px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <p className="text-[14px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Usage Credits</p>
                  <p className="text-[12px] text-[#858481] tracking-[-0.09px] leading-[20px]">₹0.00 spent</p>
                </div>
                <p className="text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] leading-[22px] tabular-nums"><AnimatedNumber value={u.creditsPct} />% Used</p>
              </div>
              <UsageBar pct={u.creditsPct} />
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">{u.monthlyResetLabel}</p>
                <p className="text-[12px] text-[#858481] tracking-[-0.09px] leading-[20px] tabular-nums">
                  {formatCompact(u.creditsUsed)} / {formatCompact(u.creditsTotal)} tokens
                </p>
              </div>
              <div className="flex items-center justify-between mt-[8px]">
                <div className="flex items-center gap-[6px]">
                  <p className="text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">
                    Available Balance <span className="font-semibold">₹{(u.creditsRemaining / TOKENS_PER_RUPEE).toFixed(2)}</span>
                  </p>
                  <button
                    type="button"
                    onClick={u.resetCredits}
                    aria-label="Reset credits"
                    className="text-[#858481] hover:text-[#34322d] dark:hover:text-[#f0f0f0] transition-colors"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onBuyCredits}
                  className="h-[32px] px-[14px] text-white text-[13px] font-semibold tracking-[-0.09px] rounded-[8px] whitespace-nowrap transition-opacity hover:opacity-90 active:opacity-80"
                  style={{ background: "linear-gradient(8.04deg, #e83535 14.59%, #8135e8 51.66%, #35a7e8 85.6%)" }}
                >
                  Buy Credits
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action card — only when a limit is hit and not on pro (pro buys credits inline above) */}
      {limitReached && u.plan !== "pro" && (
        <UpgradeCard onUpgrade={() => onNavigate("upgrade")} />
      )}

      <div className="h-px bg-[#f0f0f0] dark:bg-[#2a2a2a]" />

      {/* Usage Activity */}
      <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Usage Activity</p>

      <div className="bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#d9d9d9] dark:border-white/[0.1] hover:bg-transparent">
              <TableHead className="px-[12px] text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] w-[200px]">Time</TableHead>
              <TableHead className="px-[12px] text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px]">Model</TableHead>
              <TableHead className="px-[12px] text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] w-[110px]">Input Tokens</TableHead>
              <TableHead className="px-[12px] text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] w-[115px]">Output Tokens</TableHead>
              <TableHead className="px-[12px] text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] w-[80px]">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {u.activity.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-[14px] text-[#858481] py-8">No activity yet.</TableCell>
              </TableRow>
            ) : u.activity.map((row, i) => (
              <TableRow key={i} className="border-[#f0f0f0] dark:border-white/[0.06] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                <TableCell className="px-[12px] py-[12px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px]">{row.time}</TableCell>
                <TableCell className="px-[12px] py-[12px]">
                  <div className="flex items-center gap-[6px]">
                    <ModelIcon />
                    <span className="text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px]">{row.model}</span>
                  </div>
                </TableCell>
                <TableCell className="px-[12px] py-[12px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px]">{row.inputTokens.toLocaleString()}</TableCell>
                <TableCell className="px-[12px] py-[12px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px]">{row.outputTokens.toLocaleString()}</TableCell>
                <TableCell className="px-[12px] py-[12px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px]">{row.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}

const CREDIT_PRESETS = [500, 1000, 1500, 2000];
const SERVICE_FEE = 12;
const TAX_RATE = 0.10;
const TOKENS_PER_RUPEE = 3_500; // ₹500 → 1.75M tokens

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function BuyCreditsPanel({ onBack, onClose, onSuccess }: { onBack: () => void; onClose: () => void; onSuccess: (tokens: number) => void }) {
  const [amount, setAmount] = useState(500);
  const [inputVal, setInputVal] = useState("500");
  const [paying, setPaying] = useState(false);

  const discount = 0;
  const tax = Math.round(amount * TAX_RATE);
  const total = amount + SERVICE_FEE + tax - discount;
  const tokens = amount * TOKENS_PER_RUPEE;
  const tokensM = Math.round((tokens / 1_000_000) * 100) / 100;

  function selectPreset(val: number) {
    if (paying) return;
    setAmount(val);
    setInputVal(val.toString());
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (paying) return;
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setInputVal(raw);
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n > 0) setAmount(n);
  }

  function handlePay() {
    if (paying) return;
    setPaying(true);
    setTimeout(() => {
      onSuccess(tokens);
    }, 3000);
  }

  const summaryRows = [
    { label: "Amount", value: formatINR(amount) },
    { label: "Discount", value: formatINR(discount) },
    { label: "Service fees", value: formatINR(SERVICE_FEE) },
    { label: "Sales Tax / VAT", value: formatINR(tax) },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-[25px] pt-[21px] pb-0 flex-shrink-0">
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            onClick={onBack}
            className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-[#34322d] dark:text-[#d9d9d9]" />
            </svg>
          </button>
          <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Usage Limit</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          aria-label="Close"
        >
          <Image src="/assets/icons/settings-close.svg" alt="" width={20} height={20} className="dark:invert" unoptimized priority />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-[25px] py-[21px] flex flex-col items-center">
        <div className="w-full max-w-[520px] flex flex-col gap-[24px]">

          {/* Title */}
          <div className="flex flex-col gap-[2px]">
            <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Buy Usage Credits</p>
            <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">Choose an amount to start. You can always buy more later</p>
          </div>

          {/* Amount input + preset chips */}
          <div className="flex flex-col gap-[8px]">
            <div className="w-full h-[58px] border-2 border-[#454545] dark:border-white/[0.3] rounded-[12px] flex items-center px-[16px] bg-white dark:bg-[#1a1a1a]">
              <span className="text-[20px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.33px] select-none">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={inputVal}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-[20px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.33px] ml-[2px]"
              />
            </div>
            <div className="flex items-center gap-[6px] flex-wrap">
              {CREDIT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className={cn(
                    "min-w-[75px] px-[12px] py-[8px] rounded-[8px] text-[14px] font-semibold tracking-[-0.33px] border transition-colors",
                    amount === preset
                      ? "border-[#0067ff] bg-[#e6f0ff] text-[#0067ff] dark:bg-[#0049b5]/20 dark:text-[#4d9fff]"
                      : "border-[#d9d9d9] dark:border-white/[0.12] bg-white dark:bg-[#1f1f1f] text-[#34322d] dark:text-[#f0f0f0] hover:border-[#999] dark:hover:border-white/[0.3]"
                  )}
                >
                  ₹{preset.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px] p-[17px] flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              {summaryRows.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <p className="text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">{label}</p>
                  <p className="text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">{value}</p>
                </div>
              ))}
            </div>
            <div className="h-px bg-[#f0f0f0] dark:bg-[#2a2a2a]" />
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-[2px]">
                <p className="text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">Expected Tokens</p>
                <p className="text-[14px] font-medium text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.09px] leading-[20px]">{tokensM}M</p>
              </div>
              <div className="flex flex-col items-end gap-[2px]">
                <p className="text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">Total Due</p>
                <p className="text-[16px] font-semibold text-[#141414] dark:text-[#f0f0f0] leading-[22px]">{formatINR(total)}</p>
              </div>
            </div>
          </div>

          {/* Pay button */}
          <button
            type="button"
            onClick={handlePay}
            disabled={paying}
            className="w-full h-[42px] bg-[#0067ff] hover:bg-[#0055d4] active:bg-[#004abd] disabled:opacity-80 text-white text-[14px] font-semibold tracking-[-0.09px] rounded-[8px] transition-colors flex items-center justify-center gap-[8px]"
          >
            {paying && (
              <svg className="animate-spin w-[16px] h-[16px] flex-shrink-0" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            {paying ? "Processing..." : `Pay ${formatINR(total)} Now`}
          </button>

        </div>
      </div>
    </div>
  );
}

const PRO_MONTHLY_PRICE = 1800;
const PRO_YEARLY_DISCOUNT = 0.17;
const PRO_YEARLY_MONTHLY_PRICE = Math.round(PRO_MONTHLY_PRICE * (1 - PRO_YEARLY_DISCOUNT));

const FREE_FEATURES = [
  "Create and manage distributor orders",
  "Access on web and mobile",
  "View order history and status",
  "Manage customers and distributors",
  "Basic reports and insights",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited usage with top ups",
  "Advanced analytics",
  "AI-powered insights",
  "Campaign automation",
  "Priority support",
];

function PlanFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-[12px] w-full">
      <Check size={16} className="text-[#34322d] dark:text-[#d9d9d9] flex-shrink-0" />
      <p className="text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[18px]">{text}</p>
    </div>
  );
}

function UpgradePlanPanel({ onUpgraded }: { onUpgraded: () => void }) {
  const u = useUsage();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const proPrice = billing === "yearly" ? PRO_YEARLY_MONTHLY_PRICE : PRO_MONTHLY_PRICE;
  const isFree = u.plan === "free";
  const isPro = u.plan === "pro";

  function handleSwitchToFree() {
    if (isFree) return;
    u.setPlan("free");
    onUpgraded();
  }

  function handleGetPro() {
    if (isPro) return;
    u.setPlan("pro");
    onUpgraded();
  }

  return (
    <div className="flex flex-col gap-[20px] items-center">
      <p className="text-[20px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">
        Plans that grow with you
      </p>

      <Tabs value={billing} onValueChange={(v) => setBilling(v as "monthly" | "yearly")}>
        <TabsList>
          <TabsTrigger value="monthly" className="px-[16px] data-active:bg-[#0067ff] data-active:text-white data-active:hover:text-white">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="px-[16px] data-active:bg-[#0067ff] data-active:text-white data-active:hover:text-white">
            Yearly{" "}
            <span className={cn(billing === "yearly" ? "text-white" : "text-[#0067ff]")}>• Save 17%</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-[20px] items-stretch w-full">
        {/* Free plan */}
        <div className="flex-1 bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px] px-[24px] py-[25px] flex flex-col gap-[20px]">
          <Sparkle size={24} className="text-[#34322d] dark:text-[#d9d9d9]" />
          <div className="flex flex-col gap-[2px]">
            <p className="text-[20px] font-bold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Free</p>
            <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">Meet ZöChief</p>
            <p className="text-[36px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] mt-[8px]">₹0</p>
          </div>

          <Button
            variant="outline"
            className="w-full h-[36px]"
            disabled={isFree}
            onClick={handleSwitchToFree}
          >
            {isFree ? "Current Plan" : "Use for free"}
          </Button>

          <div className="h-px bg-[#f0f0f0] dark:bg-[#2a2a2a]" />

          <div className="flex flex-col gap-[12px]">
            {FREE_FEATURES.map((f) => <PlanFeature key={f} text={f} />)}
          </div>
        </div>

        {/* Pro plan */}
        <div className="flex-1 bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px] px-[24px] py-[25px] flex flex-col gap-[20px]">
          <Sparkles size={24} className="text-[#0067ff]" />
          <div className="flex flex-col gap-[2px]">
            <p className="text-[20px] font-bold text-[#0067ff] tracking-[-0.18px] leading-[22px]">Pro</p>
            <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">Use without limits</p>
            <div className="flex items-end gap-[6px] mt-[8px]">
              <p className="text-[36px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px]">₹{proPrice.toLocaleString("en-IN")}</p>
              <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px] pb-[6px]">/Month</p>
            </div>
          </div>

          <div className="bg-[#f4f3ef] dark:bg-[#242424] border border-black/[0.12] dark:border-white/[0.08] rounded-[8px] p-[9px] flex gap-[8px] items-center">
            <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[10px] size-[38px] flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-[#0067ff]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">
                {billing === "yearly" ? "You are on a yearly billing plan." : "You are on a monthly billing plan."}
              </p>
              <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">
                {billing === "yearly" ? "You're saving 17% with annual billing." : "Pay annually to save 17%."}
              </p>
            </div>
          </div>

          <Button
            className="w-full h-[36px] bg-[#0067ff] hover:bg-[#0055d4] text-white"
            disabled={isPro}
            onClick={handleGetPro}
          >
            {isPro ? "Current Plan" : billing === "yearly" ? "Get Pro Annual Plan" : "Get Pro Monthly Plan"}
          </Button>

          <div className="h-px bg-[#f0f0f0] dark:bg-[#2a2a2a]" />

          <div className="flex flex-col gap-[12px]">
            {PRO_FEATURES.map((f) => <PlanFeature key={f} text={f} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BillingInvoice {
  date: string;
  amount: string;
  status: "Paid";
}

const SEED_INVOICES: BillingInvoice[] = [
  { date: "Jun 10, 2026", amount: "₹5,000", status: "Paid" },
  { date: "May 10, 2026", amount: "₹5,000", status: "Paid" },
];

function loadBilling() {
  try { return JSON.parse(localStorage.getItem("zotok_billing") ?? "{}"); }
  catch { return {}; }
}

function saveBilling(data: { last4: string }) {
  localStorage.setItem("zotok_billing", JSON.stringify(data));
}

function nextRenewalLabel(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function VisaBadge() {
  return (
    <div className="h-[24px] w-[36px] rounded-[4px] bg-[#1434cb] flex items-center justify-center flex-shrink-0">
      <span className="text-white text-[10px] font-bold italic tracking-[-0.3px]">VISA</span>
    </div>
  );
}

function BillingPanel({ onChanged, onNavigateUpgrade }: { onChanged: () => void; onNavigateUpgrade: () => void }) {
  const u = useUsage();
  const isPro = u.plan === "pro";

  const [last4, setLast4] = useState(() => loadBilling().last4 ?? "2574");
  const [newLast4, setNewLast4] = useState(last4);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);

  function handleUpdatePayment() {
    if (!/^\d{4}$/.test(newLast4)) return;
    setLast4(newLast4);
    saveBilling({ last4: newLast4 });
    setUpdateOpen(false);
    onChanged();
  }

  function handleCancelPlan() {
    u.setPlan("free");
    setCancelConfirm(false);
    onChanged();
  }

  return (
    <div className="flex flex-col gap-[26px]">

      {/* Plan summary */}
      <div className="bg-[#f4f3ef] dark:bg-[#242424] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px] p-[17px] flex gap-[12px] items-center">
        <div className="bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[10px] size-[52px] flex items-center justify-center flex-shrink-0">
          {isPro ? <Sparkles size={24} className="text-[#0067ff]" /> : <Sparkle size={24} className="text-[#34322d] dark:text-[#d9d9d9]" />}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
          <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">
            ZöChief {isPro ? "Pro" : "Free"} Plan
          </p>
          <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[20px]">
            {isPro
              ? `Monthly • Your subscription will auto renew on ${nextRenewalLabel()}.`
              : "You're on the Free plan. Upgrade to unlock billing & invoices."}
          </p>
        </div>
        {!isPro && (
          <Button className="bg-[#0067ff] hover:bg-[#0055d4] text-white flex-shrink-0" onClick={onNavigateUpgrade}>
            View Plans
          </Button>
        )}
      </div>

      {/* Payment */}
      <div className="flex flex-col gap-[16px]">
        <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Payment</p>
        <div className="bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px] p-[17px] flex gap-[12px] items-center">
          <div className="flex-1 min-w-0 flex flex-col gap-[12px]">
            <p className="text-[14px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[20px]">Payment Method</p>
            <div className="flex items-center gap-[6px]">
              <VisaBadge />
              <p className="text-[14px] text-[#858481] tracking-[-0.09px] leading-[22px]">
                Visa <span className="font-bold">••••</span> {last4}
              </p>
            </div>
          </div>

          <Popover.Root open={updateOpen} onOpenChange={(open) => { setUpdateOpen(open); if (open) setNewLast4(last4); }}>
            <Popover.Trigger className="h-[36px] px-[14px] flex items-center justify-center bg-[#0067ff] hover:bg-[#0055d4] text-white text-[14px] font-semibold tracking-[-0.09px] rounded-[8px] transition-colors flex-shrink-0">
              Update
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner side="bottom" align="end" sideOffset={8} className="z-[210]">
                <Popover.Popup className="w-[260px] bg-white dark:bg-[#1f1f1f] rounded-[14px] shadow-[0px_8px_24px_rgba(0,0,0,0.14)] border border-black/[0.12] dark:border-white/[0.1] p-[16px] flex flex-col gap-[12px]">
                  <p className="font-semibold text-[14px] text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px]">Update Card</p>
                  <div className="flex flex-col gap-[4px]">
                    <FieldLabel>Last 4 digits</FieldLabel>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={newLast4}
                      onChange={(e) => setNewLast4(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full h-[36px] bg-white dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[8px] px-[12px] text-[14px] text-[#141414] dark:text-[#f0f0f0] tracking-[-0.09px] outline-none focus:ring-1 focus:ring-[#0067ff] transition-shadow"
                    />
                  </div>
                  <Button
                    className="w-full bg-[#0067ff] hover:bg-[#0055d4] text-white"
                    disabled={!/^\d{4}$/.test(newLast4)}
                    onClick={handleUpdatePayment}
                  >
                    Save Card
                  </Button>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>

      {/* Invoices */}
      <div className="flex flex-col gap-[16px]">
        <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Invoices</p>
        <div className="bg-white dark:bg-[#1f1f1f] border border-black/[0.12] dark:border-white/[0.08] rounded-[12px] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[#d9d9d9] dark:border-white/[0.1] hover:bg-transparent">
                <TableHead className="px-[16px] text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px]">Date</TableHead>
                <TableHead className="px-[16px] text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] w-[100px]">Total</TableHead>
                <TableHead className="px-[16px] text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] w-[100px]">Status</TableHead>
                <TableHead className="px-[16px] text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px] w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isPro ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-[14px] text-[#858481] py-8">No invoices yet.</TableCell>
                </TableRow>
              ) : SEED_INVOICES.map((inv, i) => (
                <TableRow key={i} className="border-[#f0f0f0] dark:border-white/[0.06] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <TableCell className="px-[16px] py-[12px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px]">{inv.date}</TableCell>
                  <TableCell className="px-[16px] py-[12px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px]">{inv.amount}</TableCell>
                  <TableCell className="px-[16px] py-[12px] text-[14px] text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.18px]">{inv.status}</TableCell>
                  <TableCell className="px-[16px] py-[12px] text-[14px] tracking-[-0.18px]">
                    <button type="button" onClick={onChanged} className="text-[#0067ff] underline hover:opacity-80 transition-opacity">View</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Cancellation */}
      <div className="flex flex-col gap-[16px]">
        <p className="text-[16px] font-semibold text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.18px] leading-[22px]">Cancellation</p>
        {cancelConfirm ? (
          <div className="bg-white dark:bg-[#1f1f1f] border border-[#dd360c]/40 rounded-[12px] p-[17px] flex items-center justify-between gap-[16px]">
            <p className="text-[14px] text-[#34322d] dark:text-[#f0f0f0] tracking-[-0.09px] leading-[20px]">
              Cancel your Pro plan now? You'll be downgraded to Free immediately.
            </p>
            <div className="flex gap-[8px] flex-shrink-0">
              <Button variant="outline" onClick={() => setCancelConfirm(false)}>Keep Pro</Button>
              <Button className="bg-[#dd360c] hover:bg-[#c42f0a] text-white" onClick={handleCancelPlan}>Confirm Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <p className="text-[14px] font-medium text-[#34322d] dark:text-[#d9d9d9] tracking-[-0.09px] leading-[20px]">
              {isPro ? "Cancel Plan" : "No active subscription"}
            </p>
            <Button
              className="bg-[#dd360c] hover:bg-[#c42f0a] text-white disabled:opacity-40"
              disabled={!isPro}
              onClick={() => setCancelConfirm(true)}
            >
              Cancel Plan
            </Button>
          </div>
        )}
      </div>

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
  const [usageSubView, setUsageSubView] = useState<"list" | "buy-credits">("list");
  const [usageKey, setUsageKey] = useState(0);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const { addCredits } = useUsage();

  useEffect(() => { setMounted(true); }, []);

  function switchTab(tab: string) {
    setActiveTab(tab);
    setUsageSubView("list");
  }

  function handleBuySuccess(tokens: number) {
    addCredits(tokens);
    setUsageSubView("list");
    setUsageKey((k) => k + 1);
  }

  function showToast() {
    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2500);
  }

  const activeItem = NAV_ITEMS.find((n) => n.key === activeTab);

  return (
    <div className="relative flex gap-[12px] p-[17px] w-full h-full">

      {/* Toast — portaled to <body> so it renders above the popup instead of being clipped inside it */}
      {mounted && createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[24px] left-1/2 -translate-x-1/2 z-[300] flex items-center gap-[8px] bg-[#111] dark:bg-white text-white dark:text-[#111] px-[14px] py-[9px] rounded-[10px] text-[13px] font-semibold shadow-lg pointer-events-none"
            >
              <svg className="w-[14px] h-[14px] text-emerald-400 flex-shrink-0" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 7l3 3 6-6" />
              </svg>
              Changes saved successfully
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Left nav */}
      <div className="w-[200px] flex-shrink-0 flex flex-col py-[4px]">
        {NAV_ITEMS.map(({ key, label, icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => switchTab(key)}
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
                priority
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
        {activeTab === "usage" && usageSubView === "buy-credits" ? (
          <BuyCreditsPanel onBack={() => setUsageSubView("list")} onClose={onClose} onSuccess={handleBuySuccess} />
        ) : (
          <>
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
                <Image src="/assets/icons/settings-close.svg" alt="" width={20} height={20} className="dark:invert" unoptimized priority />
              </button>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto px-[25px] py-[21px]">
              {activeTab === "whatsapp" && <WhatsAppSettingsPanel />}
              {activeTab === "account" && <AccountPanel onSave={showToast} />}
              {activeTab === "usage" && (
                <UsageLimitPanel
                  key={usageKey}
                  onNavigate={switchTab}
                  onBuyCredits={() => setUsageSubView("buy-credits")}
                />
              )}
              {activeTab === "upgrade" && (
                <UpgradePlanPanel
                  onUpgraded={() => {
                    showToast();
                    setUsageKey((k) => k + 1);
                  }}
                />
              )}
              {activeTab === "billing" && (
                <BillingPanel
                  onChanged={() => {
                    showToast();
                    setUsageKey((k) => k + 1);
                  }}
                  onNavigateUpgrade={() => switchTab("upgrade")}
                />
              )}
              {activeTab !== "whatsapp" && activeTab !== "account" && activeTab !== "usage" && activeTab !== "upgrade" && activeTab !== "billing" && (
                <PlaceholderPanel label={activeItem?.label ?? ""} />
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
