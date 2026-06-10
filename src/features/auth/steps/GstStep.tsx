import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";
import { PrimaryBtn } from "@/features/auth/components/PrimaryBtn";
import { ArrowIcon } from "@/features/auth/components/ArrowIcon";
import type { LoginFlowState } from "@/features/auth/hooks/useLoginFlow";

// 2 digit state + 5 letter PAN + 4 digit PAN + 1 letter + 1 alphanumeric + Z + 1 alphanumeric
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

function validateGst(value: string): string {
  if (!value) return "GST number is required";
  if (value.length < 15) return "GST number must be 15 characters";
  if (!GST_REGEX.test(value)) return "Invalid GST format (e.g. 36AABCU9603R1ZM)";
  return "";
}

type Props = Pick<LoginFlowState, "gst" | "setGst" | "gstError" | "setGstError" | "setStep">;

export function GstStep({ gst, setGst, gstError, setGstError, setStep }: Props) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 overflow-y-auto pr-0.5 pb-4 min-h-0 flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-[22px] font-semibold text-[#111] dark:text-white"
        >
          Enter GST Number
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="text-sm text-[#6d6c6b] mb-6"
        >
          Enter your 15-digit GST number to verify your business
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
        >
          <FormField label="GST Number" htmlFor="gst-input" error={gstError} className="mb-4">
            <div className="relative">
              <input
                id="gst-input"
                placeholder="e.g. 36AABCU9603R1ZM"
                maxLength={15}
                value={gst}
                aria-invalid={!!gstError}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15);
                  setGst(val);
                  if (gstError) setGstError(validateGst(val));
                }}
                onBlur={() => setGstError(validateGst(gst))}
                className={cn(
                  "w-full h-[40px] px-3 py-[9px] pr-[72px] rounded-lg border bg-transparent text-base outline-none transition-[border-color,box-shadow] md:text-sm",
                  "placeholder:text-muted-foreground",
                  "disabled:pointer-events-none disabled:opacity-50",
                  gstError
                    ? "border-destructive focus:border-destructive focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                    : "border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                )}
              />
              <span className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium tabular-nums",
                gst.length === 15 ? "text-muted-foreground" : gstError ? "text-destructive" : "text-muted-foreground"
              )}>
                {gst.length}/15
              </span>
            </div>
          </FormField>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
        className="flex-shrink-0 pt-2 bg-white dark:bg-[#1a1a1a]"
      >
        <PrimaryBtn
          disabled={!gst || !!validateGst(gst)}
          onClick={() => {
            const err = validateGst(gst);
            if (err) { setGstError(err); return; }
            setStep("details");
          }}
        >
          Validate GST <ArrowIcon />
        </PrimaryBtn>
      </motion.div>
    </div>
  );
}
