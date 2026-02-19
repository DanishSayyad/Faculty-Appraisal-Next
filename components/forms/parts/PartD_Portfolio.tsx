"use client";

import { useState, useEffect } from "react";
import SectionCard from "../shared/SectionCard";
import ScoreCard from "../shared/ScoreCard";
import FormProgressBar from "../shared/FormProgressBar";
import FormLockedModal from "../shared/FormLockedModal";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PortfolioFormData {
    portfolioType: "institute" | "department" | "both";
    selfAwardedMarks: number;
    deanMarks: number;
    hodMarks: number;
    isMarkHOD: boolean;
    isMarkDean: boolean;
    isAdministrativeRole: boolean;
    administrativeRole: string;
    adminSelfAwardedMarks: number;
    directorMarks: number;
    adminDeanMarks: number;
}

interface PartDPortfolioProps {
    apiBase: string; department: string; userId: string; isAdminFromDesignation: boolean; userDesignation: string;
}

export default function PartDPortfolio({ apiBase, department, userId, isAdminFromDesignation, userDesignation }: PartDPortfolioProps) {
    const [formData, setFormData] = useState<PortfolioFormData>({
        portfolioType: "both", selfAwardedMarks: 0, deanMarks: 0, hodMarks: 0, isMarkHOD: false, isMarkDean: false,
        isAdministrativeRole: isAdminFromDesignation, administrativeRole: userDesignation,
        adminSelfAwardedMarks: 0, directorMarks: 0, adminDeanMarks: 0,
    });

    const [instituteLevelPortfolio, setInstituteLevelPortfolio] = useState("");
    const [departmentLevelPortfolio, setDepartmentLevelPortfolio] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState("pending");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const scores = {
        self: Math.min(60, formData.isAdministrativeRole ? formData.adminSelfAwardedMarks : formData.selfAwardedMarks),
        superior: formData.isAdministrativeRole
            ? (formData.administrativeRole === "associate_dean" ? formData.adminDeanMarks : formData.directorMarks)
            : (formData.portfolioType === "both" ? ((formData.deanMarks ?? 0) + (formData.hodMarks ?? 0)) / 2 : (formData.portfolioType === "institute" ? formData.deanMarks : formData.hodMarks))
    };
    const totalScore = Math.min(120, scores.self + scores.superior);
    const locked = formStatus !== "pending";

    // Progress Calculation
    let interactedCount = 0; let totalFields = 0;
    const selfMarksValue = formData.isAdministrativeRole ? formData.adminSelfAwardedMarks : formData.selfAwardedMarks;
    if (selfMarksValue > 0) interactedCount++;
    totalFields++;

    const showInstitute = formData.portfolioType === "both" || formData.portfolioType === "institute" || formData.isAdministrativeRole;
    const showDepartment = formData.portfolioType === "both" || formData.portfolioType === "department" || formData.isAdministrativeRole;

    if (showInstitute) { totalFields++; if (instituteLevelPortfolio.trim().length > 0) interactedCount++; }
    if (showDepartment) { totalFields++; if (departmentLevelPortfolio.trim().length > 0) interactedCount++; }
    const progressPercent = totalFields > 0 ? (interactedCount / totalFields) * 100 : 0;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${apiBase}/${department}/${userId}/D`);
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setFormData({
                            portfolioType: data.portfolioType ?? "both", selfAwardedMarks: data.selfAwardedMarks ?? 0,
                            deanMarks: data.deanMarks ?? 0, hodMarks: data.hodMarks ?? 0,
                            isMarkHOD: data.isMarkHOD ?? false, isMarkDean: data.isMarkDean ?? false,
                            isAdministrativeRole: data.isAdministrativeRole ?? isAdminFromDesignation,
                            administrativeRole: data.administrativeRole ?? userDesignation,
                            adminSelfAwardedMarks: data.adminSelfAwardedMarks ?? 0,
                            directorMarks: data.directorMarks ?? 0, adminDeanMarks: data.adminDeanMarks ?? 0,
                        });
                        setInstituteLevelPortfolio(data.instituteLevelPortfolio ?? "");
                        setDepartmentLevelPortfolio(data.departmentLevelPortfolio ?? "");
                        setIsFirstTime(false);
                    }
                }
                const sr = await fetch(`${apiBase}/${department}/${userId}/get-status`);
                if (sr.ok) { const s = await sr.json(); setFormStatus(s.status); }
            } catch { /* silent */ } finally { setIsLoading(false); }
        };
        fetchData();
    }, [apiBase, department, userId, isAdminFromDesignation, userDesignation]);

    const handleSubmit = async () => {
        if (locked) { setShowStatusModal(true); return; }
        setIsSubmitting(true); setSubmitError(null);
        try {
            const payload = {
                D: { ...formData, instituteLevelPortfolio, departmentLevelPortfolio, marks: totalScore },
                isFirstTime
            };
            const res = await fetch(`${apiBase}/${department}/${userId}/D`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error("Save Failed");
            setIsFirstTime(false); setSubmitSuccess(true);
        } catch (err) { setSubmitError((err as Error).message); } finally { setIsSubmitting(false); }
    };

    if (isLoading) return <Loader message="Loading portfolio data…" />;

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-4">
            <FormProgressBar progress={progressPercent} label="Part D Completion" />

            {!formData.isAdministrativeRole && (
                <SectionCard title="Portfolio Selection">
                    <div className="flex gap-4 mb-4">
                        {(["institute", "department", "both"] as const).map(t => (
                            <button key={t} disabled={locked} onClick={() => setFormData(p => ({ ...p, portfolioType: t }))} className={`flex-1 py-3 px-4 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${formData.portfolioType === t ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border hover:border-foreground/50"}`}>
                                {t} Level
                            </button>
                        ))}
                    </div>
                </SectionCard>
            )}

            {showInstitute && (
                <SectionCard title="Institute Level Portfolio">
                    <Textarea placeholder="Describe your institute level contributions..." value={instituteLevelPortfolio} disabled={locked} onChange={(e) => setInstituteLevelPortfolio(e.target.value)} rows={5} className="resize-none text-sm placeholder:italic" />
                </SectionCard>
            )}

            {showDepartment && (
                <SectionCard title="Department Level Portfolio">
                    <Textarea placeholder="Describe your department level contributions..." value={departmentLevelPortfolio} disabled={locked} onChange={(e) => setDepartmentLevelPortfolio(e.target.value)} rows={5} className="resize-none text-sm placeholder:italic" />
                </SectionCard>
            )}

            <SectionCard title="Self Assessment">
                <div className="flex items-center justify-between py-2">
                    <div>
                        <p className="text-sm font-medium text-foreground uppercase tracking-tight">Self-Awarded Marks</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Maximum 60 points</p>
                    </div>
                    <input
                        type="number" min={0} max={60} disabled={locked}
                        onWheel={(e) => e.currentTarget.blur()}
                        value={selfMarksValue === 0 ? "" : selfMarksValue}
                        onChange={(e) => {
                            const v = Math.min(60, Math.max(0, Number(e.target.value)));
                            setFormData(p => formData.isAdministrativeRole ? { ...p, adminSelfAwardedMarks: v } : { ...p, selfAwardedMarks: v });
                        }}
                        className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-right font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-ring transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
            </SectionCard>

            <SectionCard title="Score Summary">
                <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-xs">
                        <tbody className="divide-y divide-border">
                            <tr className="bg-muted/10">
                                <td className="px-4 py-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Self Evaluation</td>
                                <td className="px-4 py-3 text-right font-bold tabular-nums">{scores.self} / 60</td>
                            </tr>
                            <tr className="bg-muted/10">
                                <td className="px-4 py-3 font-medium uppercase tracking-wider text-[10px] text-muted-foreground">Superior Evaluation</td>
                                <td className="px-4 py-3 text-right font-bold tabular-nums">{scores.superior} / 60</td>
                            </tr>
                            <tr className="bg-foreground text-background">
                                <td className="px-4 py-4 font-black uppercase tracking-widest">Total Portfolio Score</td>
                                <td className="px-4 py-4 text-right font-black tabular-nums text-lg">{totalScore} / 120</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            {submitSuccess && <p className="text-xs text-center text-muted-foreground font-medium italic mt-2">Portfolio details saved.</p>}
            {submitError && <p className="text-xs text-center text-destructive font-bold mt-2">{submitError}</p>}

            <div className="flex justify-end pt-2">
                <Button onClick={handleSubmit} disabled={isSubmitting || locked} className="min-w-[220px] shadow-sm uppercase tracking-wider text-xs font-bold">
                    {isSubmitting ? "Saving..." : "Save Portfolio Details"}
                </Button>
            </div>

            {showStatusModal && <FormLockedModal formStatus={formStatus} onClose={() => setShowStatusModal(false)} />}
        </div>
    );
}
