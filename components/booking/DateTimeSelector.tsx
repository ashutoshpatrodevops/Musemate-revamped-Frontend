// components/booking/DateTimeSelector.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { TimeSlot as TimeSlotType } from '@/types';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

interface DateTimeSelectorProps {
  timeSlots: TimeSlotType[];
  selectedDate: Date | undefined;
  selectedTimeSlot: TimeSlotType | null;
  onDateChange: (date: Date | undefined) => void;
  onTimeSlotChange: (slot: TimeSlotType) => void;
}

export function DateTimeSelector({
  timeSlots,
  selectedDate,
  selectedTimeSlot,
  onDateChange,
  onTimeSlotChange,
}: DateTimeSelectorProps) {
  // Disable past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Select Date & Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Picker */}
        <div className="space-y-2">
          <Label>Visit Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => date < today}
            className="rounded-md border"
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Select Time Slot
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots
                .filter((slot) => slot.isAvailable)
                .map((slot, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={
                      selectedTimeSlot?.startTime === slot.startTime
                        ? 'default'
                        : 'outline'
                    }
                    className="flex flex-col items-center py-4 h-auto"
                    onClick={() => onTimeSlotChange(slot)}
                  >
                    <span className="font-semibold">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <span className="text-xs">
                      {slot.capacity} spots left
                    </span>
                  </Button>
                ))}
            </div>
            {timeSlots.filter((slot) => slot.isAvailable).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No available time slots for this date
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}