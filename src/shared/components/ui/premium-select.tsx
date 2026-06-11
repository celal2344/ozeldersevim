"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type SelectOption = {
  value: string;
  label: string;
};

type PremiumSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  variant?: "dark" | "light";
  className?: string;
};

export function PremiumSelect({ value, onChange, options, variant = "light", className }: PremiumSelectProps) {
  const currentLabel = options.find((o) => o.value === value)?.label ?? options[0]?.label ?? "";

  return (
    <SelectPrimitive.Root value={value} onValueChange={(v) => onChange(v ?? "")}>
      <SelectPrimitive.Trigger
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 text-sm font-medium transition-all outline-none select-none focus-visible:ring-2",
          variant === "dark"
            ? "border-white/15 bg-white/10 text-white hover:bg-white/15 focus-visible:ring-brand-orange/60 backdrop-blur"
            : "border-slate-200 bg-white text-brand-navy hover:border-slate-300 focus-visible:ring-brand-orange/40",
          className
        )}
      >
        <span className="truncate">{currentLabel}</span>
        <SelectPrimitive.Icon
          render={<ChevronDownIcon className={cn("size-4 shrink-0 transition-transform duration-200 [[data-popup-open]_&]:rotate-180", variant === "dark" ? "text-white/50" : "text-muted-foreground")} />}
        />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={6} className="z-[999]">
          <SelectPrimitive.Popup
            className={cn(
              "min-w-[var(--anchor-width)] overflow-hidden rounded-xl shadow-xl ring-1 outline-none",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "duration-150 origin-[var(--transform-origin)]",
              "bg-white ring-slate-200 shadow-slate-300/50"
            )}
          >
            <SelectPrimitive.List className="p-1.5">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-none select-none transition-colors",
                    "text-brand-navy hover:bg-slate-50 focus:bg-slate-50",
                    "data-[selected]:bg-brand-orange/8 data-[selected]:text-brand-orange data-[selected]:font-medium"
                  )}
                >
                  <SelectPrimitive.ItemText className="flex-1 truncate">
                    {opt.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="flex shrink-0 items-center justify-center">
                    <CheckIcon className="size-3.5 text-brand-orange" aria-hidden="true" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
