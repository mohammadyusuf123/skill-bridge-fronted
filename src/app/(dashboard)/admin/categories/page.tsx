'use client';

import { useCategories } from '@/hooks/useApi';
import { categoryApi } from '@/services/category.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3,
  GraduationCap,
  Layers,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Tag
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';

// Color options with better labels
const COLOR_OPTIONS = [
  { label: 'Blue', value: '#3b82f6', bg: 'bg-blue-500' },
  { label: 'Green', value: '#22c55e', bg: 'bg-green-500' },
  { label: 'Purple', value: '#a855f7', bg: 'bg-purple-500' },
  { label: 'Red', value: '#ef4444', bg: 'bg-red-500' },
  { label: 'Orange', value: '#f97316', bg: 'bg-orange-500' },
  { label: 'Pink', value: '#ec4899', bg: 'bg-pink-500' },
  { label: 'Teal', value: '#14b8a6', bg: 'bg-teal-500' },
  { label: 'Yellow', value: '#eab308', bg: 'bg-yellow-500' },
  { label: 'Indigo', value: '#6366f1', bg: 'bg-indigo-500' },
  { label: 'Cyan', value: '#06b6d4', bg: 'bg-cyan-500' },
];

const ICON_OPTIONS = ['📚', '🔬', '🎨', '💻', '🎵', '⚽', '🌍', '🧮', '✍️', '🎭', '🎯', '🏆', '🎪', '🎬', '📖', '🔭'];

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCategories(true);

  // Dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  // Form states
  const [createForm, setCreateForm] = useState({ 
    name: '', 
    description: '', 
    color: COLOR_OPTIONS[0].value, 
    icon: ICON_OPTIONS[0] 
  });
  const [editForm, setEditForm] = useState({ 
    id: '',
    name: '', 
    description: '', 
    color: '', 
    icon: '' 
  });
  const [deleteCategory, setDeleteCategory] = useState<any>(null);

  // Mutations
  const createMut = useMutation({
    mutationFn: () => categoryApi.createCategory({
      name: createForm.name,
      slug: createForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: createForm.description || undefined,
      color: createForm.color,
      icon: createForm.icon,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      setCreateDialog(false);
      setCreateForm({ name: '', description: '', color: COLOR_OPTIONS[0].value, icon: ICON_OPTIONS[0] });
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateMut = useMutation({
    mutationFn: () => categoryApi.updateCategory(editForm.id, {
      name: editForm.name,
      description: editForm.description || undefined,
      color: editForm.color,
      icon: editForm.icon,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      setEditDialog(false);
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
      setDeleteDialog(false);
      setDeleteCategory(null);
    },
    onError: () => toast.error('Failed to delete category'),
  });

  const toggleMut = useMutation({
    mutationFn: (id: string) => categoryApi.toggleCategoryStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category status updated');
    },
    onError: () => toast.error('Failed to toggle status'),
  });

  const categories = Array.isArray(data?.data) ? data.data : [];
  const activeCategories = categories.filter(c => c.isActive);
  const inactiveCategories = categories.filter(c => !c.isActive);

  // Color & Icon Picker Component
  const ColorIconPicker = ({ 
    color, 
    icon, 
    onChange 
  }: {
    color: string; 
    icon: string;
    onChange: (patch: { color?: string; icon?: string }) => void;
  }) => (
    <div className="space-y-5">
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Color Theme
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {COLOR_OPTIONS.map(c => (
            <motion.button
              key={c.value}
              type="button"
              onClick={() => onChange({ color: c.value })}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative h-12 rounded-lg border-2 transition-all ${
                color === c.value 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            >
              {color === c.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-gray-800" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          Category Icon
        </Label>
        <div className="grid grid-cols-8 gap-2">
          {ICON_OPTIONS.map(i => (
            <motion.button
              key={i}
              type="button"
              onClick={() => onChange({ icon: i })}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`text-2xl h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                icon === i 
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {i}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading categories...</p>
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Categories Management</h1>
                <p className="text-white/80">Organize and manage tutoring subject categories</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => setCreateDialog(true)} 
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" /> 
                Add Category
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Total Categories</CardDescription>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold">{categories.length}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">All categories</p>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Active</CardDescription>
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-green-600">{activeCategories.length}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Visible to users</p>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Inactive</CardDescription>
              <div className="h-10 w-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                <EyeOff className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-gray-600">{inactiveCategories.length}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Hidden from users</p>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Active Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Active Categories</CardTitle>
                <CardDescription className="mt-1">Currently available for tutors to select</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {activeCategories.length === 0 ? (
                <motion.div
                  key="empty-active"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-16"
                >
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Layers className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold">No active categories</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Create your first category to get started
                  </p>
                </motion.div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeCategories.map((cat, index) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card 
                        className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 group"
                        style={{ borderLeftColor: cat.color || '#3b82f6' }}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                                {cat.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {cat.description || 'No description provided'}
                              </p>
                            </div>
                            {cat.icon && (
                              <div className="text-3xl ml-3 group-hover:scale-110 transition-transform">
                                {cat.icon}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" />
                                {cat._count?.tutors || 0} tutors
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                
                              style={{ 
  backgroundColor: `${cat.color ?? '#3b82f6'}15`,
  borderColor: cat.color ?? '#3b82f6',
  color: cat.color ?? '#3b82f6'
}}
                              >
                                {cat.slug}
                              </Badge>
                            </div>
                            
                            <div className="flex gap-1">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-primary/10"
                                  onClick={() => {
                                    setEditForm({
                                      id: cat.id,
                                      name: cat.name,
                                      description: cat.description || '',
                                      color: cat.color || COLOR_OPTIONS[0].value,
                                      icon: cat.icon || ICON_OPTIONS[0]
                                    });
                                    setEditDialog(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                                  onClick={() => {
                                    setDeleteCategory(cat);
                                    setDeleteDialog(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-yellow-100"
                                  onClick={() => toggleMut.mutate(cat.id)}
                                  title="Deactivate"
                                >
                                  <EyeOff className="h-4 w-4 text-yellow-600" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inactive Categories */}
      {inactiveCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-500/5 to-transparent">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                  <EyeOff className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle>Inactive Categories</CardTitle>
                  <CardDescription className="mt-1">Hidden from public view</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inactiveCategories.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden opacity-60 hover:opacity-100 transition-all border-2 border-dashed">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{cat.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {cat.description || 'No description'}
                            </p>
                          </div>
                          {cat.icon && <div className="text-2xl ml-2">{cat.icon}</div>}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <Badge variant="secondary">Inactive</Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleMut.mutate(cat.id)}
                              className="text-xs hover:bg-green-100 hover:text-green-700"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Activate
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                              onClick={() => {
                                setDeleteCategory(cat);
                                setDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Create New Category</DialogTitle>
                <DialogDescription className="mt-1">
                  Add a new subject category for tutors
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Category Name *</Label>
              <Input
                placeholder="e.g., Mathematics, Science, Art..."
                value={createForm.name}
                onChange={(e) => setCreateForm(p => ({ ...p, name: e.target.value }))}
                className="h-11"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Description</Label>
              <Textarea
                placeholder="Brief description of what this category includes..."
                value={createForm.description}
                onChange={(e) => setCreateForm(p => ({ ...p, description: e.target.value }))}
                rows={3}
              />
            </div>
            <ColorIconPicker
              color={createForm.color}
              icon={createForm.icon}
              onChange={(patch) => setCreateForm(p => ({ ...p, ...patch }))}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreateDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => createMut.mutate()}
              disabled={createMut.isPending || !createForm.name.trim()}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90"
            >
              {createMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Edit Category</DialogTitle>
                <DialogDescription className="mt-1">
                  Update category details and appearance
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Category Name *</Label>
              <Input
                placeholder="Category name"
                value={editForm.name}
                onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                className="h-11"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Description</Label>
              <Textarea
                placeholder="Category description"
                value={editForm.description}
                onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                rows={3}
              />
            </div>
            <ColorIconPicker
              color={editForm.color}
              icon={editForm.icon}
              onChange={(patch) => setEditForm(p => ({ ...p, ...patch }))}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => updateMut.mutate()}
              disabled={updateMut.isPending || !editForm.name.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500"
            >
              {updateMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl text-red-600">Delete Category</DialogTitle>
                <DialogDescription className="mt-1">
                  This action cannot be undone
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {deleteCategory && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                <div className="text-4xl">{deleteCategory.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{deleteCategory.name}</p>
                  <p className="text-sm text-muted-foreground">{deleteCategory.description || 'No description'}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {deleteCategory._count?.tutors || 0} tutors
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-yellow-900 dark:text-yellow-100">
                      Warning
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                      Deleting this category will remove it from all associated tutors. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteCategory && deleteMut.mutate(deleteCategory.id)}
              disabled={deleteMut.isPending}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500"
            >
              {deleteMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}