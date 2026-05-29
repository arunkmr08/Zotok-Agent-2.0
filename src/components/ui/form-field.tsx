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
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          error ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <FieldDescription>{error}</FieldDescription>
      </div>
    </Field>
  );
}
