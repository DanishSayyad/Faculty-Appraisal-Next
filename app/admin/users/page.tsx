"use client";

import type React from "react";

import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Edit, Users, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/app/AuthProvider";

interface User {
  name: string;
  email: string;
  role: string;
  id: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => void;
  isEditing: boolean;
  editUser?: User;
  onUpdateUser: (user: User) => void;
  token?: string;
}

function AddUserModal({
  isOpen,
  onClose,
  onAddUser,
  isEditing,
  editUser,
  onUpdateUser,
  token,
}: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    id: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (isEditing && editUser) {
        setFormData({
          name: editUser.name || "",
          email: editUser.email || "",
          password: "",
          role: editUser.role || "",
          id: editUser.id || "",
        });
      } else {
        setFormData({ name: "", email: "", password: "", role: "", id: "" });
      }
      setErrors({ name: "", email: "", password: "", role: "" });
    }
  }, [isOpen, isEditing, editUser]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      role: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        const payload = {
          id: editUser?.id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/updateUser`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );
        if (res.ok) {
          toast({
            title: "Success",
            description: "User updated successfully",
            variant: "default",
          });
          onUpdateUser({
            id: editUser!.id,
            name: formData.name,
            email: formData.email,
            role: formData.role,
          });
          handleClose();
        } else {
          toast({
            title: "Error",
            description: "Failed to update user",
            variant: "destructive",
          });
        }
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/addUser`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          },
        );
        if (res.ok) {
          toast({
            title: "Success",
            description: "User added successfully",
            variant: "default",
          });
          onAddUser(formData);
          handleClose();
        } else {
          toast({
            title: "Error",
            description: "Failed to add user",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred while ${
          isEditing ? "updating" : "adding"
        } user`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", password: "", role: "", id: "" });
    setErrors({ name: "", email: "", password: "", role: "" });
    onClose();
  };
  const { user } = useAuth();
  const userId = user ? user.id : "";
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {isEditing ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the user information."
              : "Create a new user account with the required information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter full name"
              className={errors.name ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>{" "}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email address"
              className={errors.email ? "border-red-500" : ""}
              disabled={isSubmitting || isEditing}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter password (min. 6 characters)"
                className={errors.password ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
              disabled={isSubmitting || isEditing}
            >
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="coordinator">Event Coordinator</SelectItem>
                <SelectItem value="head">Evaluator Head</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update User"
                  : "Add User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getUsers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          // console.log("Fetched users:", data);
          setUsers(data.data.users);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch users",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        toast({
          title: "Error",
          description: "An error occurred while fetching users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [token, toast]);

  if (!users || users.length === 0 && !loading) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        <Users className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-bold mb-2">No Users Found</h2>
      </div>
    );
  }
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddUser = (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };
    setUsers([...users, newUser]);
  };

  const handleDeleteUser = async (user: User) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/deleteUser`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: user.id, role: user.role }),
        },
      );
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        toast({
          title: "Deleted",
          description: "User deleted successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while deleting user",
        variant: "destructive",
      });
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsAddModalOpen(true);
  };

  return (
    <div>
      {/* Search and Add User */}
      <motion.div
        className="flex gap-4 mb-6 flex-col md:flex-row"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-3 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
          onClick={openAddModal}
        >
          <Plus size={20} />
          Add User
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-serif">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {filteredUsers.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-foreground">
                          {user.name}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(user)}
                            >
                              <Edit size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 size={18} className="text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="w-full py-12 flex flex-col justify-center items-center text-muted-foreground">
                  {loading ? (
                    <Loader className="w-8 h-8 animate-spin" />
                  ) : (
                    <>
                      <Users className="w-10 h-10 mb-2" />
                      <p className="text-sm">No users found</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditing(false);
          setSelectedUser(null);
        }}
        onAddUser={handleAddUser}
        isEditing={isEditing}
        editUser={selectedUser || undefined}
        onUpdateUser={(updated) =>
          setUsers((prev) =>
            prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)),
          )
        }
        token={token || ""}
      />
    </div>
  );
}
