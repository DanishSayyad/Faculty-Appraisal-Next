"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { UserPlus, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExternalReviewer {
  id: string;
  full_name: string;
  mail: string;
  mob: string;
  designation: string;
  specialization: string;
  organization: string;
  address: string;
}

const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Industry Expert",
  "Researcher",
  "Consultant",
];

export default function DirectorAddExternalPage() {
  const { toast } = useToast();
  const [externals, setExternals] = useState<ExternalReviewer[]>([]);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    mail: "",
    mob: "",
    designation: "",
    specialization: "",
    organization: "",
    address: "",
  });

  useEffect(() => {
    // TODO: GET /api/get-externals
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.mail || !form.designation) {
      toast({ title: "Required fields missing", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      // TODO: POST /api/create-external  body: form
      toast({ title: "External reviewer added successfully" });
      setForm({ full_name: "", mail: "", mob: "", designation: "", specialization: "", organization: "", address: "" });
      // refresh list
    } catch {
      toast({ title: "Failed to add external reviewer", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = externals.filter(
    (e) =>
      e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      e.mail.toLowerCase().includes(search.toLowerCase()) ||
      e.organization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Add form */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="h-4 w-4 text-primary" />
              Register New External Reviewer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    placeholder="Dr. Jane Smith"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mail">Email *</Label>
                  <Input
                    id="mail"
                    type="email"
                    placeholder="reviewer@example.com"
                    value={form.mail}
                    onChange={(e) => setForm({ ...form, mail: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mob">Mobile</Label>
                  <Input
                    id="mob"
                    placeholder="+91 98765 43210"
                    value={form.mob}
                    onChange={(e) => setForm({ ...form, mob: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="designation">Designation *</Label>
                  <Select value={form.designation} onValueChange={(v) => setForm({ ...form, designation: v })}>
                    <SelectTrigger id="designation">
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGNATIONS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    placeholder="e.g. Machine Learning"
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    placeholder="University / Company"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="City, State"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Reviewer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Existing list */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-base">Registered External Reviewers ({externals.length})</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No external reviewers registered
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((ext) => (
                      <TableRow key={ext.id}>
                        <TableCell className="font-medium">{ext.full_name}</TableCell>
                        <TableCell className="text-muted-foreground">{ext.mail}</TableCell>
                        <TableCell className="text-muted-foreground">{ext.mob || "—"}</TableCell>
                        <TableCell>{ext.designation}</TableCell>
                        <TableCell>{ext.organization || "—"}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              // TODO: DELETE /api/external/${ext.id}
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
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
