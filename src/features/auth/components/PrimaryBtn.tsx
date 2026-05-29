import { cn } from "@/lib/utils";

interface PrimaryBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function PrimaryBtn({ children, onClick, className, disabled }: PrimaryBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full py-[9px] px-4 bg-[#0067ff] hover:bg-[#0055d4] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
