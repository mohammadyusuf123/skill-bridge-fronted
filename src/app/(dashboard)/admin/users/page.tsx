'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/user.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Loader2, 
  Search, 
  Edit, 
  Trash2,
  Users,
  GraduationCap,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  UserCheck,
  Calendar,
  Mail
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editUser, setEditUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter, statusFilter],
    queryFn: () => userApi.getAllUsers({
      role: roleFilter === 'ALL' ? undefined : roleFilter,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
    }),
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      userApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
      setEditUser(null);
    },
    onError: () => {
      toast.error('Failed to update role');
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      userApi.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated successfully');
      setEditUser(null);
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
      setDeleteUser(null);
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });

  const users = data?.data || [];
  const usersArray = Array.isArray(users) ? users : [];
  
  const filteredUsers = usersArray.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: usersArray.length,
    students: usersArray.filter(u => u.role === 'STUDENT').length,
    tutors: usersArray.filter(u => u.role === 'TUTOR').length,
    admins: usersArray.filter(u => u.role === 'ADMIN').length,
    active: usersArray.filter(u => u.status === 'ACTIVE').length,
    suspended: usersArray.filter(u => u.status === 'SUSPENDED').length,
    banned: usersArray.filter(u => u.status === 'BANNED').length,
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'TUTOR': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'STUDENT': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'BANNED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return Shield;
      case 'TUTOR': return GraduationCap;
      case 'STUDENT': return Users;
      default: return Users;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-white/80">Manage all platform users and their permissions</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Total Users</CardDescription>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold">{stats.total}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">All registered users</p>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Students</CardDescription>
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-green-600">{stats.students}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{((stats.students / stats.total) * 100).toFixed(0)}% of users</p>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Tutors</CardDescription>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-blue-600">{stats.tutors}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{((stats.tutors / stats.total) * 100).toFixed(0)}% of users</p>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Active Users</CardDescription>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-emerald-600">{stats.active}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{((stats.active / stats.total) * 100).toFixed(0)}% active</p>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Filters</CardTitle>
                <CardDescription className="mt-1">Search and filter users by criteria</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" />
                  Search Users
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Filter by Role
                </Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles ({stats.total})</SelectItem>
                    <SelectItem value="STUDENT">Students ({stats.students})</SelectItem>
                    <SelectItem value="TUTOR">Tutors ({stats.tutors})</SelectItem>
                    <SelectItem value="ADMIN">Admins ({stats.admins})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Filter by Status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status ({stats.total})</SelectItem>
                    <SelectItem value="ACTIVE">Active ({stats.active})</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended ({stats.suspended})</SelectItem>
                    <SelectItem value="BANNED">Banned ({stats.banned})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription className="mt-1">
                  Showing {filteredUsers.length} of {stats.total} users
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {filteredUsers.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {filteredUsers.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-16"
                >
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold">No users found</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Try adjusting your search or filters
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((user, index) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group"
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-2 hover:border-primary/20">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              <div className="relative">
                                <Avatar className="h-14 w-14 border-2 border-background shadow-lg group-hover:scale-110 transition-transform">
                                  <AvatarImage src={user.image || ''} />
                                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-lg font-semibold">
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-background rounded-full flex items-center justify-center border-2 border-background">
                                  <RoleIcon className="h-3 w-3 text-primary" />
                                </div>
                              </div>
                              
                              {/* User Info */}
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                    {user.name}
                                  </p>
                                  {user.status === 'ACTIVE' && (
                                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <p className="truncate">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <p>Joined {formatDate(user.createdAt)}</p>
                                </div>
                              </div>

                              {/* Badges */}
                              <div className="flex flex-col gap-2 items-end">
                                <Badge className={`${getRoleBadgeStyle(user.role)} border font-semibold`}>
                                  {user.role}
                                </Badge>
                                <Badge className={`${getStatusBadgeStyle(user.status)} border font-semibold`}>
                                  {user.status}
                                </Badge>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditUser(user)}
                                    className="h-9 w-9 p-0 hover:bg-primary/10 hover:border-primary/30"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteUser(user)}
                                    className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Edit className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Edit User</DialogTitle>
                <DialogDescription className="mt-1">
                  Update user role and account status
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {editUser && (
            <div className="space-y-6 py-4">
              {/* User Info Display */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                  <AvatarImage src={editUser.image || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-lg">
                    {editUser.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg truncate">{editUser.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{editUser.email}</p>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  User Role
                </Label>
                <Select
                  value={editUser.role}
                  onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Student
                      </div>
                    </SelectItem>
                    <SelectItem value="TUTOR">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Tutor
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Account Status
                </Label>
                <Select
                  value={editUser.status}
                  onValueChange={(value) => setEditUser({ ...editUser, status: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="SUSPENDED">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        Suspended
                      </div>
                    </SelectItem>
                    <SelectItem value="BANNED">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Banned
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditUser(null)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editUser) {
                  updateRoleMutation.mutate({ userId: editUser.id, role: editUser.role });
                  updateStatusMutation.mutate({ userId: editUser.id, status: editUser.status });
                }
              }}
              disabled={updateRoleMutation.isPending || updateStatusMutation.isPending}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90"
            >
              {(updateRoleMutation.isPending || updateStatusMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl text-red-600">Delete User</DialogTitle>
                <DialogDescription className="mt-1">
                  This action cannot be undone. This will permanently delete the user account.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {deleteUser && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                  <AvatarImage src={deleteUser.image || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-red-200 to-red-100 text-lg">
                    {deleteUser.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg truncate">{deleteUser.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{deleteUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={`${getRoleBadgeStyle(deleteUser.role)} border text-xs`}>
                      {deleteUser.role}
                    </Badge>
                    <Badge className={`${getStatusBadgeStyle(deleteUser.status)} border text-xs`}>
                      {deleteUser.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-yellow-900 dark:text-yellow-100">
                      Warning: This will delete
                    </p>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 list-disc list-inside">
                      <li>User account and profile</li>
                      <li>All associated bookings</li>
                      <li>Reviews and ratings</li>
                      <li>All user data permanently</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteUser(null)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteUser && deleteMutation.mutate(deleteUser.id)}
              disabled={deleteMutation.isPending}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}