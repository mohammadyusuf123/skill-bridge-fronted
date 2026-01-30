'use client';

import { useCategories } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategories(true); // Include inactive
  const [showCreateForm, setShowCreateForm] = useState(false);

  const categories = data?.data || [];
  const activeCategories = categories.filter(c => c.isActive);
  const inactiveCategories = categories.filter(c => !c.isActive);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground">Manage tutoring subject categories</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Categories</CardDescription>
            <CardTitle className="text-3xl">{categories.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-600">{activeCategories.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-3xl text-gray-600">{inactiveCategories.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Active Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Active Categories</CardTitle>
          <CardDescription>Currently available categories for tutors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeCategories.map((category) => (
              <div
                key={category.id}
                className="p-4 border rounded-lg hover:shadow-md transition-all"
                style={{ borderLeftColor: category.color || undefined, borderLeftWidth: '4px' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description || 'No description'}
                    </p>
                  </div>
                  {category.icon && (
                    <div className="text-2xl">{category.icon}</div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Badge variant="outline">
                    {category._count?.tutors || 0} tutors
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  Slug: {category.slug}
                </div>
              </div>
            ))}
          </div>

          {activeCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active categories</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive Categories */}
      {inactiveCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inactive Categories</CardTitle>
            <CardDescription>Disabled categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inactiveCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg opacity-60"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Badge variant="secondary">Inactive</Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        Activate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Form Placeholder */}
      {showCreateForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Create New Category</CardTitle>
            <CardDescription>Add a new subject category</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Category creation form would go here. This requires implementing the create
              category endpoint and form handling.
            </p>
            <Button className="mt-4" variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
