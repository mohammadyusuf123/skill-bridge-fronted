'use client';

import { useCategories } from '@/hooks/useApi';
import { categoryApi } from '@/services/category.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// The set of colours the admin can pick from when creating / editing
const COLOR_OPTIONS = [
  { label: 'Blue',   value: '#3b82f6' },
  { label: 'Green',  value: '#22c55e' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Red',    value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Pink',   value: '#ec4899' },
  { label: 'Teal',   value: '#14b8a6' },
  { label: 'Yellow', value: '#eab308' },
];

const ICON_OPTIONS = ['📚', '🔬', '🎨', '💻', '🎵', '⚽', '🌍', '🧮', '✍️', '🎭'];

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCategories(true);

  // ── create state ──
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', color: COLOR_OPTIONS[0].value, icon: ICON_OPTIONS[0] });

  // ── edit state ──
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', color: '', icon: '' });

  // ── mutations ──
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
      toast.success('Category created');
      setShowCreate(false);
      setCreateForm({ name: '', description: '', color: COLOR_OPTIONS[0].value, icon: ICON_OPTIONS[0] });
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateMut = useMutation({
    mutationFn: (id: string) => categoryApi.updateCategory(id, {
      name: editForm.name,
      description: editForm.description || undefined,
      color: editForm.color,
      icon: editForm.icon,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated');
      setEditId(null);
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
    },
    onError: () => toast.error('Failed to delete category'),
  });

  const toggleMut = useMutation({
    mutationFn: (id: string) => categoryApi.toggleCategoryStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category status toggled');
    },
    onError: () => toast.error('Failed to toggle status'),
  });

  const categories = Array.isArray(data?.data) ? data.data : [];
  const activeCategories   = categories.filter(c => c.isActive);
  const inactiveCategories = categories.filter(c => !c.isActive);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // shared colour + icon picker row
  const ColorIconPicker = ({ color, icon, onChange }: {
    color: string; icon: string;
    onChange: (patch: { color?: string; icon?: string }) => void;
  }) => (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>Colour</Label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange({ color: c.value })}
              className={`w-7 h-7 rounded-full border-2 transition-all ${color === c.value ? 'border-gray-800 scale-110' : 'border-gray-300'}`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <Label>Icon</Label>
        <div className="flex flex-wrap gap-2">
          {ICON_OPTIONS.map(i => (
            <button
              key={i}
              type="button"
              onClick={() => onChange({ icon: i })}
              className={`text-xl w-9 h-9 rounded-md border flex items-center justify-center transition-all ${icon === i ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground">Manage tutoring subject categories</p>
        </div>
        <Button onClick={() => setShowCreate(true)} disabled={showCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-3"><CardDescription>Total</CardDescription><CardTitle className="text-3xl">{categories.length}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-3"><CardDescription>Active</CardDescription><CardTitle className="text-3xl text-green-600">{activeCategories.length}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-3"><CardDescription>Inactive</CardDescription><CardTitle className="text-3xl text-gray-500">{inactiveCategories.length}</CardTitle></CardHeader></Card>
      </div>

      {/* ── CREATE FORM ── */}
      {showCreate && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>New Category</CardTitle>
            <CardDescription>Fill in the details and pick a colour and icon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Name *</Label>
                <Input value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} placeholder="Mathematics" />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} placeholder="Algebra, geometry…" />
              </div>
            </div>
            <ColorIconPicker
              color={createForm.color}
              icon={createForm.icon}
              onChange={patch => setCreateForm(p => ({ ...p, ...patch }))}
            />
            <div className="flex gap-2 pt-2">
              <Button onClick={() => createMut.mutate()} disabled={createMut.isPending || !createForm.name.trim()}>
                {createMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Check className="h-4 w-4 mr-1" /> Create
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── ACTIVE CATEGORIES ── */}
      <Card>
        <CardHeader>
          <CardTitle>Active Categories</CardTitle>
          <CardDescription>Currently available for tutors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeCategories.map(cat => (
              editId === cat.id ? (
                // inline edit card
                <div key={cat.id} className="p-4 border border-primary rounded-lg space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Name</Label>
                    <Input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} className="h-8 text-sm" />
                  </div>
                  <ColorIconPicker
                    color={editForm.color}
                    icon={editForm.icon}
                    onChange={patch => setEditForm(p => ({ ...p, ...patch }))}
                  />
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" onClick={() => updateMut.mutate(cat.id)} disabled={updateMut.isPending}>
                      {updateMut.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                      <Check className="h-3 w-3 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditId(null)}>
                      <X className="h-3 w-3 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  key={cat.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all"
                  style={{ borderLeftColor: cat.color || undefined, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{cat.description || 'No description'}</p>
                    </div>
                    {cat.icon && <div className="text-2xl ml-2">{cat.icon}</div>}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline">{cat._count?.tutors || 0} tutors</Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditId(cat.id); setEditForm({ name: cat.name, description: cat.description || '', color: cat.color || COLOR_OPTIONS[0].value, icon: cat.icon || ICON_OPTIONS[0] }); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => deleteMut.mutate(cat.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">slug: {cat.slug}</p>
                </div>
              )
            ))}
            {activeCategories.length === 0 && <p className="text-muted-foreground py-4">No active categories</p>}
          </div>
        </CardContent>
      </Card>

      {/* ── INACTIVE CATEGORIES ── */}
      {inactiveCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inactive Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inactiveCategories.map(cat => (
                <div key={cat.id} className="p-4 border rounded-lg opacity-60">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{cat.description || 'No description'}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="secondary">Inactive</Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toggleMut.mutate(cat.id)}>Activate</Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => deleteMut.mutate(cat.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
