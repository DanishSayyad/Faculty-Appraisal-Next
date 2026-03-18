"use client";

import { useCallback, useState } from "react";
import Dashboard from "@/components/dashboard";
import { useAuth } from "@/app/AuthProvider";
import {
  User,
  BookOpen,
  FileText,
  Building2,
  FileDown,
  CheckSquare,
} from "lucide-react";

export default function FacultyDashboardPage() {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAppraisal = useCallback(async () => {
    if (!user?.id) return;

    setIsDownloading(true);
    try {
      const filename = encodeURIComponent(`${user.name || `appraisal-${user.id}`}.pdf`);
      window.open(
        `/api/appraisal/${user.id}/pdf/${filename}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error("[DownloadAppraisal]", err);
    } finally {
      setIsDownloading(false);
    }
  }, [user]);

  return (
    <>
      <Dashboard
        userName="Faculty"
        quickLinks={[
          {
            href: "/faculty/profile",
            icon: <User className="w-6 h-6 text-indigo-600" />,
            label: "Profile",
            description: "View and update your profile",
          },
          {
            href: "/faculty/teaching",
            icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
            label: "Teaching Performance",
            description: "Manage your teaching activities",
          },
          {
            href: "/faculty/research",
            icon: <FileText className="w-6 h-6 text-indigo-600" />,
            label: "Research",
            description: "Track your research work",
          },
          {
            href: "/faculty/self-development",
            icon: <Building2 className="w-6 h-6 text-indigo-600" />,
            label: "Self Development",
            description: "Monitor your personal growth",
          },
          {
            onClick: handleDownloadAppraisal,
            icon: (
              <FileDown
                className={`w-6 h-6 text-indigo-600 ${isDownloading ? "animate-bounce" : ""}`}
              />
            ),
            label: isDownloading ? "Opening…" : "Open Appraisal PDF",
            description: "Open your appraisal in the browser PDF viewer",
          },
          {
            href: "/faculty/review",
            icon: <CheckSquare className="w-6 h-6 text-indigo-600" />,
            label: "Review",
            description: "Complete your evaluation",
          },
        ]}
        showWelcomeInfo={true}
      />
    </>
  );
}

