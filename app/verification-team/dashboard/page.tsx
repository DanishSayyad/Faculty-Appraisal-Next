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
import { StatCard } from "@/components/stat-card";
import { Search, ClipboardList, CheckSquare, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface FacultyRecord {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  status: string;
  verificationStatus: "pending" | "in_progress" | "verified";
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  verified: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  verification_pending: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

export default function VerificationTeamDashboardPage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<FacultyRecord[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    // TODO: GET /api/verification-team/faculty
    // Faculty with status === "verification_pending"
  }, []);

  const filtered = faculty.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchDept = departmentFilter === "all" || f.department === departmentFilter;
    return matchSearch && matchDept;
  });

  const pending = faculty.filter((f) => f.verificationStatus === "pending").length;
  const inProgress = faculty.filter((f) => f.verificationStatus === "in_progress").length;
  const verified = faculty.filter((f) => f.verificationStatus === "verified").length;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Faculty"   value={faculty.length} icon={Users}         color="primary" />
        <StatCard title="Pending"         value={pending}        icon={Clock}         color="secondary" />
        <StatCard title="In Progress"     value={inProgress}     icon={ClipboardList} color="secondary" />
        <StatCard title="Verified"        value={verified}       icon={CheckSquare}   color="accent" />
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
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
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4 text-primary" />
              Faculty Pending Verification ({filtered.length})
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
                    <TableHead>Verification Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No faculty pending verification
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
                          <Badge className={statusColors[f.verificationStatus] ?? "bg-gray-100 text-gray-800"}>
                            {f.verificationStatus.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/verification-team/verification-form?facultyId=${f.id}&department=${f.department}`
                              )
                            }
                          >
                            {f.verificationStatus === "verified" ? "Review" : "Verify"}
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
