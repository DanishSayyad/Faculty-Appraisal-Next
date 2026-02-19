import { cn } from "@/lib/utils";
import React from "react";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export default function SectionCard({ title, children, className, actions }: SectionCardProps) {
  return (
    <section className={cn("bg-card rounded-xl shadow-md p-6 mb-8", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
          {title}
        </h2>
        {actions}
      </div>
      <div>{children}</div>
    </section>
  );
}
