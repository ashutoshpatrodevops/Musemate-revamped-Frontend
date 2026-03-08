import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // ── Base ──
  // Shared foundation: font, transition, focus ring, disabled, svg sizing
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-semibold tracking-wide text-sm",
    "transition-all duration-300 ease-out",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    // Shimmer pseudo-element (opt-in via group)
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        // ── Primary — the hero CTA ──
        // Glassy deep-primary fill, shimmer sweep on hover, subtle glow
        default: [
          "bg-primary text-primary-foreground",
          "shadow-[0_0_0_1px_rgba(var(--primary-rgb),0.3),0_4px_24px_rgba(var(--primary-rgb),0.25)]",
          "hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(var(--primary-rgb),0.5),0_6px_32px_rgba(var(--primary-rgb),0.4)]",
          "hover:-translate-y-[1px] active:translate-y-0 active:brightness-95",
          // shimmer layer
          "before:absolute before:inset-0 before:-translate-x-full",
          "before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent",
          "hover:before:translate-x-full before:transition-transform before:duration-500 before:ease-in-out",
        ].join(" "),

        // ── Destructive ──
        destructive: [
          "bg-destructive text-white",
          "shadow-[0_2px_16px_rgba(239,68,68,0.3)]",
          "hover:bg-destructive/90 hover:shadow-[0_4px_24px_rgba(239,68,68,0.45)]",
          "hover:-translate-y-[1px] active:translate-y-0",
          "focus-visible:ring-destructive/40",
          "before:absolute before:inset-0 before:-translate-x-full",
          "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
          "hover:before:translate-x-full before:transition-transform before:duration-500",
        ].join(" "),

        // ── Outline — secondary actions ──
        // Frosted glass border, faint background, glows on hover
        outline: [
          "border border-border/60 bg-background/60 text-foreground",
          "backdrop-blur-sm",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
          "hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
          "hover:shadow-[0_0_0_1px_rgba(var(--primary-rgb),0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
          "hover:-translate-y-[1px] active:translate-y-0",
          "dark:bg-white/[0.03] dark:border-white/10 dark:hover:border-primary/40 dark:hover:bg-primary/8",
        ].join(" "),

        // ── Secondary ──
        secondary: [
          "bg-secondary text-secondary-foreground",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_3px_rgba(0,0,0,0.12)]",
          "hover:bg-secondary/70 hover:-translate-y-[1px] active:translate-y-0",
          "before:absolute before:inset-0 before:-translate-x-full",
          "before:bg-gradient-to-r before:from-transparent before:via-white/8 before:to-transparent",
          "hover:before:translate-x-full before:transition-transform before:duration-500",
        ].join(" "),

        // ── Ghost — minimal, for nav/icon buttons ──
        ghost: [
          "text-foreground/70",
          "hover:bg-primary/8 hover:text-primary",
          "active:bg-primary/12",
          "dark:hover:bg-primary/10",
        ].join(" "),

        // ── Link ──
        link: [
          "text-primary underline-offset-4",
          "hover:underline hover:text-primary/80",
          "p-0 h-auto shadow-none",
        ].join(" "),

        // ── Gold — prestige/premium actions (MuseMate-specific) ──
        gold: [
          "text-amber-950 font-bold tracking-wider",
          "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500",
          "shadow-[0_2px_0_rgba(180,120,0,0.6),0_6px_24px_rgba(245,158,11,0.3)]",
          "hover:from-amber-200 hover:via-yellow-300 hover:to-amber-400",
          "hover:shadow-[0_2px_0_rgba(180,120,0,0.7),0_8px_32px_rgba(245,158,11,0.45)]",
          "hover:-translate-y-[2px] active:translate-y-0",
          "active:shadow-[0_1px_0_rgba(180,120,0,0.5)]",
          "before:absolute before:inset-0 before:-translate-x-full",
          "before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
          "hover:before:translate-x-full before:transition-transform before:duration-600",
        ].join(" "),

        // ── Glass — for dark/image backgrounds (hero, collab section) ──
        glass: [
          "text-white font-medium",
          "bg-white/10 border border-white/20",
          "backdrop-blur-md",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_16px_rgba(0,0,0,0.2)]",
          "hover:bg-white/18 hover:border-white/35",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_24px_rgba(0,0,0,0.3)]",
          "hover:-translate-y-[1px] active:translate-y-0",
        ].join(" "),
      },

      size: {
        default: "h-10 px-5 py-2 rounded-xl has-[>svg]:px-4",
        sm:      "h-8 rounded-lg gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg:      "h-12 rounded-xl px-8 text-base has-[>svg]:px-6",
        xl:      "h-14 rounded-2xl px-10 text-base tracking-widest has-[>svg]:px-8",
        icon:    "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }