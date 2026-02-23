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
import { Search, UserCheck, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";

interface FacultyRecord {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  status: string;
  directorMarks: number | null;
}

const statusColors: Record<string, string> = {
  interaction_pending: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  done: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export default function DirectorAssignExternalPage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<FacultyRecord[]>([]);
  const [search, setSearch] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    // TODO: GET /api/director/assign-external-faculty
    // (role === "HOD" || role === "Dean") && (status === "Interaction_pending" || status === "done")
  }, []);

  const filtered = faculty.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchDept = departmentFilter === "all" || f.department === departmentFilter;
    const matchDesig =
      designationFilter === "all" || f.designation === designationFilter;
    return matchSearch && matchDept && matchDesig;
  });

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
        <Select value={designationFilter} onValueChange={setDesignationFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Designation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="HOD">HOD</SelectItem>
            <SelectItem value="Dean">Dean</SelectItem>
          </SelectContent>
        </Select>
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
              <UserCheck className="h-4 w-4 text-primary" />
              Faculty Pending Interaction Evaluation ({filtered.length})
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
                    <TableHead className="text-right">Director Marks</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        No faculty pending interaction evaluation
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
                        <TableCell className="text-right">
                          {f.directorMarks !== null ? (
                            <span className="font-mono font-semibold text-green-600">{f.directorMarks}</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not evaluated</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() =>
                              router.push(`/director/interaction-evaluation/${f.id}?department=${f.department}`)
                            }
                          >
                            <ClipboardList className="h-3.5 w-3.5 mr-1" />
                            {f.directorMarks !== null ? "Re-evaluate" : "Evaluate"}
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
