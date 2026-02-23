"use client";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";

export default function CollegeExternalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const skipHeader = pathname.startsWith("/college-external/evaluate");

  const header = useMemo(() => {
    if (pathname === "/college-external/dashboard") {
      return { title: "College External Dashboard", description: "HOD and Dean faculty assigned for your interaction evaluation" };
    }
    return { title: "College External Reviewer", description: "Interaction evaluation portal" };
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
