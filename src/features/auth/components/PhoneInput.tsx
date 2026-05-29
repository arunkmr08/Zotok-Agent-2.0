"use client";

import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  return (
    <FormField label={label} htmlFor={id} error={error}>
      <div className={cn(
        "flex border rounded-xl overflow-hidden transition-[border-color,box-shadow]",
        error
          ? "border-destructive focus-within:border-destructive focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
          : "border-black/[0.08] dark:border-white/[0.08] focus-within:border-[#111] dark:focus-within:border-white focus-within:shadow-[0_0_0_3px_rgba(17,17,17,0.08)]"
      )}>
        <Select value={dialCode} onValueChange={(v) => v && onDialCodeChange(v)}>
          <SelectTrigger className="h-auto min-h-[44px] cursor-pointer rounded-none border-0 border-r border-black/[0.08] dark:border-white/[0.08] bg-[#f4f3ef] dark:bg-[#242424] hover:bg-[#e8e5e0] dark:hover:bg-[#2e2e2e] text-[#34322d] dark:text-[#dadada] font-medium px-3 gap-1 focus-visible:ring-0 focus-visible:shadow-none focus-visible:border-r focus-visible:border-black/[0.08] dark:focus-visible:border-white/[0.08] text-sm flex-shrink-0 [&_svg]:text-[#34322d] dark:[&_svg]:text-[#dadada]">
            <SelectValue>
              {COUNTRY_CODES.find(c => c.name === dialCode)?.flag} {COUNTRY_CODES.find(c => c.name === dialCode)?.dial}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false} className="min-w-[220px]">
            {COUNTRY_CODES.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.flag} {c.name} ({c.dial})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          className="flex-1 px-[14px] py-[11px] bg-transparent outline-none text-[#111] dark:text-[#dadada]"
        />
      </div>
    </FormField>
  );
}
