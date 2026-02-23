"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface FacultyRecord {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  status: string;
  grandTotal: number | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  done: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  verification_pending: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  authority_verification_pending: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  interaction_pending: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  SentToDirector: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
};

const STATUS_OPTIONS = ["all", "SentToDirector", "interaction_pending", "done", "verification_pending"];
const DESIGNATION_OPTIONS = ["all", "Faculty", "Assistant Professor", "Associate Professor", "Professor"];

export default function DirectorFacultyFormsPage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<FacultyRecord[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    // TODO: GET /api/director/faculty-forms  (status === "SentToDirector" && designation === "Faculty")
    // setFaculty(data);
    // setDepartments([...new Set(data.map(f => f.department))]);
  }, []);

  const filtered = faculty.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchDept = departmentFilter === "all" || f.department === departmentFilter;
    const matchStatus = statusFilter === "all" || f.status === statusFilter;
    const matchDesignation = designationFilter === "all" || f.designation === designationFilter;
    return matchSearch && matchDept && matchStatus && matchDesignation;
  });

  const counts: Record<string, number> = {};
  STATUS_OPTIONS.filter((s) => s !== "all").forEach((s) => {
    counts[s] = faculty.filter((f) => f.status === s).length;
  });

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Status summary pills */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              statusFilter === status
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/50"
            }`}
          >
            {status.replace(/_/g, " ")}: {count}
          </button>
        ))}
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary">
          Total: {faculty.length}
        </span>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={designationFilter} onValueChange={setDesignationFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Designation" />
          </SelectTrigger>
          <SelectContent>
            {DESIGNATION_OPTIONS.map((d) => (
              <SelectItem key={d} value={d}>{d === "all" ? "All Designations" : d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" />
              Faculty Appraisals ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Grand Total</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        No faculty records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-medium">{f.name}</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">{f.employeeId}</TableCell>
                        <TableCell>{f.department}</TableCell>
                        <TableCell>{f.designation}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[f.status] ?? "bg-gray-100 text-gray-800"}>
                            {f.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          {f.grandTotal ?? "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/director/director-verify?facultyId=${f.id}&department=${f.department}`)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
