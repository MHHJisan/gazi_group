"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { supabase } from "@/lib/supabase-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users as UsersIcon,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Shield,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { getUsers } from "@/lib/actions/users";
import type { User } from "@/lib/actions/users";
import { UserForm } from "@/components/users/user-form";
import { EditUserForm } from "@/components/users/edit-user-form";
import { DeleteUser } from "@/components/users/delete-user";
import { UserActionsMenu } from "@/components/users/user-actions-menu";
import { ChangePasswordModal } from "@/components/users/change-password-modal";
import { ForgotPasswordModal } from "@/components/users/forgot-password-modal";

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [changePasswordUserId, setChangePasswordUserId] = useState<
    string | null
  >(null);
  const [changePasswordUserName, setChangePasswordUserName] =
    useState<string>("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const usersResult = await getUsers();
      if (usersResult.success) {
        setUsers(usersResult.data || []);
      } else {
        console.error("Failed to fetch users:", usersResult.error);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const managerUsers = users.filter((user) => user.role === "manager").length;
  const regularUsers = users.filter((user) => user.role === "user").length;

  // Calculate new users this month
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const newUsersThisMonth = users.filter(
    (user) => user.created_at && user.created_at.startsWith(currentMonth),
  ).length;

  const handleUserUpdated = () => {
    console.log("User updated - refreshing user list");
    // Refetch users when a user is updated
    const fetchUsers = async () => {
      const usersResult = await getUsers();
      if (usersResult.success) {
        setUsers(usersResult.data || []);
      }
    };
    fetchUsers();
  };

  const handleUserCreated = () => {
    console.log("User created - refreshing user list");
    // Refetch users when a new user is created
    const fetchUsers = async () => {
      const usersResult = await getUsers();
      if (usersResult.success) {
        setUsers(usersResult.data || []);
      }
    };
    fetchUsers();
  };

  const handleUserDeleted = () => {
    console.log("Delete user clicked - refreshing user list");
    // Refetch users when a user is deleted
    const fetchUsers = async () => {
      console.log("Fetching users after delete...");
      const usersResult = await getUsers();
      if (usersResult.success) {
        setUsers(usersResult.data || []);
      } else {
        console.error("Failed to fetch users:", usersResult.error);
      }
    };
    fetchUsers();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "default" : "secondary";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <UserForm onUserCreated={handleUserCreated} />
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{newUsersThisMonth} new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalUsers > 0
                  ? ((activeUsers / totalUsers) * 100).toFixed(1)
                  : 0}
                % active rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {adminUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalUsers > 0
                  ? ((adminUsers / totalUsers) * 100).toFixed(1)
                  : 0}
                % of total users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New This Week
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {newUsersThisMonth}
              </div>
              <p className="text-xs text-muted-foreground">
                +25% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter Users</CardTitle>
            <CardDescription>
              Find users by name, email, role, or status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              All registered users and their access levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UsersIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No users found</p>
                  <p className="text-sm">
                    Get started by adding your first user account
                  </p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {getInitials(user.name)}
                      </div>

                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>

                        <div className="flex items-center gap-4 mt-1">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Badge>
                          <Badge variant={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone || "N/A"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.department || "N/A"}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined{" "}
                            {user.created_at
                              ? new Date(user.created_at).toLocaleDateString()
                              : "N/A"}
                          </div>
                          <div className="flex items-center gap-1">
                            <UserCheck className="h-3 w-3" />
                            Last login{" "}
                            {user.last_login
                              ? new Date(user.last_login).toLocaleDateString()
                              : "Never"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <EditUserForm
                        userId={user.id}
                        onUserUpdated={handleUserUpdated}
                      />
                      <DeleteUser
                        userId={user.id}
                        userName={user.name}
                        onUserDeleted={handleUserDeleted}
                      />
                      <UserActionsMenu
                        userId={user.id}
                        userName={user.name}
                        onPasswordChanged={() => {
                          console.log(
                            "Opening change password modal for:",
                            user.name,
                          );
                          setChangePasswordUserId(user.id);
                          setChangePasswordUserName(user.name);
                        }}
                        onPasswordReset={() => {
                          console.log("Opening forgot password modal");
                          setForgotPasswordOpen(true);
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={!!changePasswordUserId}
          onClose={() => {
            setChangePasswordUserId(null);
            setChangePasswordUserName("");
          }}
          userId={changePasswordUserId || ""}
          userName={changePasswordUserName}
          onSuccess={() => {
            console.log(
              "Password actually changed - closing modal and refreshing",
            );
            setChangePasswordUserId(null);
            setChangePasswordUserName("");
            // Refresh user list after password change
            const fetchUsers = async () => {
              const usersResult = await getUsers();
              if (usersResult.success) {
                setUsers(usersResult.data || []);
              }
            };
            fetchUsers();
          }}
        />

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          isOpen={forgotPasswordOpen}
          onClose={() => setForgotPasswordOpen(false)}
          onSuccess={() => {
            console.log(
              "Password reset completed - closing modal and refreshing",
            );
            setForgotPasswordOpen(false);
            // Refresh user list after password reset
            const fetchUsers = async () => {
              const usersResult = await getUsers();
              if (usersResult.success) {
                setUsers(usersResult.data || []);
              }
            };
            fetchUsers();
          }}
        />
      </div>
    </DashboardLayout>
  );
}
