import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-3xl p-8 w-full transition-all duration-300 hover:border-white/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
