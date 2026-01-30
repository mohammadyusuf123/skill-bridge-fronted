'use client';

import { useOwnAvailability, useAddAvailability, useDeleteAvailability, useBulkAddAvailability } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import type { DayOfWeek } from '@/types';

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function TutorAvailabilityPage() {
  const { data, isLoading } = useOwnAvailability();
  const addAvailability = useAddAvailability();
  const deleteAvailability = useDeleteAvailability();
  const bulkAdd = useBulkAddAvailability();

  const [isAdding, setIsAdding] = useState(false);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [newSlot, setNewSlot] = useState<{
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }>({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '17:00',
  });

  const [bulkSlots, setBulkSlots] = useState({
    days: [] as DayOfWeek[],
    startTime: '09:00',
    endTime: '17:00',
  });

  const handleAdd = () => {
    addAvailability.mutate(newSlot, {
      onSuccess: () => {
        setIsAdding(false);
        setNewSlot({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' });
      },
    });
  };

  const handleBulkAdd = () => {
    const slots = bulkSlots.days.map(day => ({
      dayOfWeek: day,
      startTime: bulkSlots.startTime,
      endTime: bulkSlots.endTime,
    }));

    bulkAdd.mutate({ slots }, {
      onSuccess: () => {
        setIsBulkAdding(false);
        setBulkSlots({ days: [], startTime: '09:00', endTime: '17:00' });
      },
    });
  };

  const toggleBulkDay = (day: DayOfWeek) => {
    setBulkSlots(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const getTotalSlots = () => {
    if (!data?.data) return 0;
    return Object.values(data.data).reduce((sum, slots) => sum + slots.length, 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Availability</h1>
          <p className="text-muted-foreground">Manage your weekly tutoring schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBulkAdding(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Bulk Add
          </Button>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Slots</CardDescription>
            <CardTitle className="text-3xl">{getTotalSlots()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Days Available</CardDescription>
            <CardTitle className="text-3xl">
              {data?.data ? Object.keys(data.data).filter(day => data.data[day].length > 0).length : 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-lg">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Add Single Slot Form */}
      {isAdding && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Add Availability Slot</CardTitle>
            <CardDescription>Add a specific time slot for one day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Day of Week</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newSlot.dayOfWeek}
                  onChange={(e) => setNewSlot({...newSlot, dayOfWeek: e.target.value as DayOfWeek})}
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={addAvailability.isPending}>
                {addAvailability.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Slot
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Add Form */}
      {isBulkAdding && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Bulk Add Availability</CardTitle>
            <CardDescription>Add the same time slot to multiple days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <Badge
                    key={day}
                    variant={bulkSlots.days.includes(day) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleBulkDay(day)}
                  >
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={bulkSlots.startTime}
                  onChange={(e) => setBulkSlots({...bulkSlots, startTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={bulkSlots.endTime}
                  onChange={(e) => setBulkSlots({...bulkSlots, endTime: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleBulkAdd} 
                disabled={bulkAdd.isPending || bulkSlots.days.length === 0}
              >
                {bulkAdd.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add to {bulkSlots.days.length} Days
              </Button>
              <Button variant="outline" onClick={() => setIsBulkAdding(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Schedule */}
      <div className="grid gap-4">
        {DAYS.map(day => {
          const slots = data?.data?.[day] || [];
          
          return (
            <Card key={day} className={slots.length === 0 ? 'opacity-50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {day.toLowerCase()}
                  </CardTitle>
                  <Badge variant="secondary">
                    {slots.length} {slots.length === 1 ? 'slot' : 'slots'}
                  </Badge>
                </div>
              </CardHeader>
              {slots.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    {slots.map((slot: any) => (
                      <div 
                        key={slot.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          {slot.isActive && (
                            <Badge variant="outline" className="text-xs">Active</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAvailability.mutate(slot.id)}
                          disabled={deleteAvailability.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* No Availability State */}
      {getTotalSlots() === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No availability set</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Add your available time slots so students can book sessions with you.
            </p>
            <Button onClick={() => setIsBulkAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Availability
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
