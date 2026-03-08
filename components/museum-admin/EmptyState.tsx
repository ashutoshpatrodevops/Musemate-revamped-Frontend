'use client';

import { Button } from '@/components/ui/button';
import { Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl border border-dashed border-border/50 bg-background/40 backdrop-blur-sm overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Icon */}
      <div className="relative mb-5">
        {/* Rings */}
        <div className="absolute inset-0 rounded-full border border-border/30 scale-[1.6] opacity-50" />
        <div className="absolute inset-0 rounded-full border border-border/20 scale-[2.2] opacity-30" />

        <div className="relative w-14 h-14 rounded-2xl bg-muted/60 border border-border/40 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="text-muted-foreground/70 [&_svg]:w-6 [&_svg]:h-6">
            {icon || <Building2 className="w-6 h-6" />}
          </span>
        </div>
      </div>

      {/* Text */}
      <h3 className="text-base font-semibold tracking-tight mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
        {description}
      </p>

      {/* Action */}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="rounded-xl h-9 px-5 gap-1.5 text-xs font-semibold"
        >
          {actionLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      )}
    </motion.div>
  );
}