"use client";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const header = useMemo(() => {
    switch (pathname) {
      case "/admin/users":
        return {
          title: "User Management",
          description: "Manage all platform users and their roles",
        };
      case "/admin/dashboard":
        return {
          title: "Super Admin Dashboard",
          description: "Manage your hackathon platform and monitor activities",
        };
      default:
        return {
          title: "Super Admin Dashboard",
          description: "Manage your hackathon platform and monitor activities",
        };
    }
  }, [pathname]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="admin" />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-4 md:p-8">
          <DashboardHeader
            title={header.title}
            description={header.description}
          />
          {children}
        </div>
      </main>
    </div>
  );
}