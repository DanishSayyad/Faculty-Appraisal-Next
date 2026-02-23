"use client";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";

export default function AssociateDeanLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const skipHeader = pathname === "/associate-dean/appraisal";

  const header = useMemo(() => {
    switch (true) {
      case pathname === "/associate-dean/dashboard":
        return { title: "Associate Dean Dashboard", description: "Overview of your appraisal responsibilities" };
      case pathname === "/associate-dean/review":
        return { title: "Review Submissions", description: "Review faculty appraisal submissions in your department" };
      default:
        return { title: "Associate Dean Dashboard", description: "Overview of your appraisal responsibilities" };
    }
  }, [pathname]);

  if (skipHeader) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <DashboardHeader title={header.title} description={header.description} />
      {children}
    </div>
  );
}
