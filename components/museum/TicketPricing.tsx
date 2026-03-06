// components/museum/TicketPricing.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TicketTypeInfo } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Users, User, GraduationCap, Baby, UserPlus } from 'lucide-react';

interface TicketPricingProps {
  ticketTypes: TicketTypeInfo[];
}

const ticketIcons = {
  adult: User,
  child: Baby,
  senior: Users,
  student: GraduationCap,
  group: UserPlus,
};

export function TicketPricing({ ticketTypes }: TicketPricingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ticketTypes.map((ticket) => {
            const Icon = ticketIcons[ticket.type] || User;
            return (
              <div
                key={ticket.type}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium capitalize">{ticket.type}</p>
                    {ticket.description && (
                      <p className="text-sm text-muted-foreground">
                        {ticket.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{formatCurrency(ticket.price)}</p>
                  <p className="text-xs text-muted-foreground">per person</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}