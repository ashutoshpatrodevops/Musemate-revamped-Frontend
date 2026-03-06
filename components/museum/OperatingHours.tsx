// components/museum/OperatingHours.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OperatingHours as OperatingHoursType } from '@/types';
import { Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface OperatingHoursProps {
  hours: OperatingHoursType;
}

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function OperatingHours({ hours }: OperatingHoursProps) {
  const today = dayOrder[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>Operating Hours</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dayOrder.map((day) => {
            const dayHours = hours[day];
            const isToday = day === today;

            return (
              <div
                key={day}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isToday ? 'bg-primary/10 border border-primary/20' : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`font-medium capitalize ${isToday ? 'text-primary' : ''}`}>
                    {day}
                  </span>
                  {isToday && (
                    <Badge variant="default" className="text-xs">
                      Today
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  {dayHours.isClosed ? (
                    <span className="text-muted-foreground">Closed</span>
                  ) : (
                    <span className={isToday ? 'font-medium text-primary' : 'text-muted-foreground'}>
                      {formatTime(dayHours.open)} - {formatTime(dayHours.close)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}