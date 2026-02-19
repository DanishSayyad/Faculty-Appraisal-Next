"use client";
import React, { useState } from "react";
import SectionCard from "./SectionCard";
import FormField from "./FormField";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TeachingFormData {
  subject: string;
  semester: string;
  hours: string;
  remarks: string;
}

const initialData: TeachingFormData = {
  subject: "",
  semester: "",
  hours: "",
  remarks: "",
};

export default function FormPartA() {
  const [form, setForm] = useState<TeachingFormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1200));
      toast({ title: "Saved!", description: "Teaching performance saved successfully." });
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard title="Part A: Teaching Performance">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Subject Name"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
        />
        <FormField
          label="Semester"
          name="semester"
          value={form.semester}
          onChange={handleChange}
          required
        />
        <FormField
          label="Total Hours"
          name="hours"
          type="number"
          value={form.hours}
          onChange={handleChange}
          required
        />
        <FormField
          label="Remarks"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          textarea
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader variant="inline" className="mr-2" /> : null}
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
