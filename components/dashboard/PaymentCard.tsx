// components/dashboard/PaymentCard.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreditCard, Check, Clock, X } from 'lucide-react';

interface Payment {
  _id: string;
  bookingReference: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
  razorpayPaymentId: string;
  createdAt: string;
  museumName?: string;
}

interface PaymentCardProps {
  payment: Payment;
}

const statusConfig = {
  success: {
    icon: Check,
    color: 'bg-green-100 text-green-700 border-green-200',
    label: 'Success',
  },
  pending: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    label: 'Pending',
  },
  failed: {
    icon: X,
    color: 'bg-red-100 text-red-700 border-red-200',
    label: 'Failed',
  },
};

export function PaymentCard({ payment }: PaymentCardProps) {
  const config = statusConfig[payment.status];
  const Icon = config.icon;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{payment.museumName || 'Museum Visit'}</p>
              <p className="text-sm text-muted-foreground">
                Ref: {payment.bookingReference}
              </p>
            </div>
          </div>
          <Badge className={config.color}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Amount</p>
            <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Date</p>
            <p className="text-sm font-medium">
              {formatDate(payment.createdAt, 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground mb-1">Payment ID</p>
            <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
              {payment.razorpayPaymentId}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}