"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";
import { COUNTRY_CODES } from "@/features/auth/constants";

interface PhoneInputProps {
  id: string;
  label: string;
  value: string;
  error: string;
  dialCode: string;
  onDialCodeChange: (code: string) => void;
  onChange: (digits: string) => void;
  onError: (msg: string) => void;
}

export function PhoneInput({ id, label, value, error, dialCode, onDialCodeChange, onChange, onError }: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selected = COUNTRY_CODES.find((c) => c.name === dialCode) ?? COUNTRY_CODES[0];
  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  // Reset highlight when search changes
  useEffect(() => { setHighlightedIndex(-1); }, [search]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  function openDropdown() {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen(true);
    setSearch("");
    setHighlightedIndex(-1);
  }

  function close() {
    setOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
  }

  function selectCountry(name: string) {
    onDialCodeChange(name);
    close();
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      close();
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          selectCountry(filtered[highlightedIndex].name);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
    }
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if ((e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") && !open) {
      e.preventDefault();
      openDropdown();
    }
    if (e.key === "Escape" && open) {
      e.preventDefault();
      close();
    }
  }

  return (
    <FormField label={label} htmlFor={id} error={error}>
      <div className={cn(
        "flex border rounded-xl overflow-hidden transition-[border-color,box-shadow]",
        error
          ? "border-destructive focus-within:border-destructive focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
          : "border-black/[0.08] dark:border-white/[0.08] focus-within:border-[#111] dark:focus-within:border-white focus-within:shadow-[0_0_0_3px_rgba(17,17,17,0.08)]"
      )}>
        {/* Country trigger */}
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={openDropdown}
          onKeyDown={handleTriggerKeyDown}
          className="h-[40px] flex items-center gap-[6px] px-3 border-r border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#242424] hover:bg-[#f4f3ef] dark:hover:bg-[#2e2e2e] text-[#34322d] dark:text-[#dadada] font-medium text-sm transition-colors select-none whitespace-nowrap flex-shrink-0"
        >
          <span>{selected.flag}</span>
          <span>{selected.dial}</span>
          <svg className="w-[14px] h-[14px] text-[#858481] dark:text-[#595959]" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 5l4 4 4-4" />
          </svg>
        </button>

        {/* Phone number input */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          placeholder="98765 43210"
          maxLength={15}
          value={value}
          aria-invalid={!!error}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
            onChange(digits);
            if (digits.length > 0 && digits.length < 10) onError("Enter at least 10 digits");
            else onError("");
          }}
          onBlur={() => {
            if (value.length === 0) onError("Mobile number is required");
            else if (value.length < 10) onError("Enter at least 10 digits");
            else onError("");
          }}
          className="flex-1 px-[14px] py-[9px] h-[40px] bg-transparent outline-none text-[#111] dark:text-[#dadada]"
        />
      </div>

      {/* Dropdown — portalled to body to escape any overflow:hidden parent */}
      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={dropdownRef}
          style={{ position: "fixed", top: dropPos.top, left: dropPos.left, zIndex: 9999, minWidth: 240 }}
          className="bg-white dark:bg-[#1f1f1f] border border-black/[0.08] dark:border-white/[0.08] rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.14)] overflow-hidden"
        >
          {/* Search */}
          <div className="p-2 border-b border-black/[0.06] dark:border-white/[0.06]">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full h-[32px] px-[10px] rounded-[8px] bg-[#f4f3ef] dark:bg-[#2a2a2a] text-[13px] text-[#111] dark:text-[#dadada] placeholder:text-[#858481] outline-none"
            />
          </div>
          {/* List */}
          <div ref={listRef} role="listbox" className="max-h-[200px] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-[13px] text-[#858481] text-center">No results</p>
            ) : (
              filtered.map((c, i) => (
                <button
                  key={c.name}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  role="option"
                  aria-selected={c.name === dialCode}
                  type="button"
                  onClick={() => selectCountry(c.name)}
                  className={cn(
                    "w-full flex items-center gap-[10px] px-3 h-[36px] text-left text-[13px] transition-colors",
                    highlightedIndex === i
                      ? "bg-[#f4f3ef] dark:bg-[#2a2a2a]"
                      : c.name === dialCode
                        ? "bg-[#e7f1ff] dark:bg-[#0049b5]/40"
                        : "hover:bg-[#f4f3ef] dark:hover:bg-[#2a2a2a]",
                    c.name === dialCode
                      ? "text-[#0067ff] dark:text-[#5e9fff]"
                      : "text-[#34322d] dark:text-[#dadada]"
                  )}
                >
                  <span className="text-base flex-shrink-0">{c.flag}</span>
                  <span className="flex-1 truncate font-medium">{c.name}</span>
                  <span className="text-[#858481] dark:text-[#595959] flex-shrink-0">{c.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </FormField>
  );
}
