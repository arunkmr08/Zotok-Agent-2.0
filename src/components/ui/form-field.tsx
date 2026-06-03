"use client";

import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

interface FormFieldProps {
  label: React.ReactNode;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, error, className, children }: FormFieldProps) {
  return (
    <Field data-invalid={!!error} className={cn("gap-0", className)}>
      <FieldLabel htmlFor={htmlFor} className="mb-[6px]">{label}</FieldLabel>
      {children}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          error ? "max-h-10 opacity-100 mt-[6px]" : "max-h-0 opacity-0"
        )}
      >
        <FieldDescription className={error ? "text-destructive" : undefined}>{error}</FieldDescription>
      </div>
    </Field>
  );
}
