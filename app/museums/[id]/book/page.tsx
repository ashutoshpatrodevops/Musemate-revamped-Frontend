// app/museums/[id]/book/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, endpoints } from '@/lib/api';
import { Museum, Visitor, TimeSlot } from '@/types';
import { DateTimeSelector } from '@/components/booking/DateTimeSelector';
import { VisitorForm } from '@/components/booking/VisitorForm';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { PaymentButton } from '@/components/booking/PaymentButton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();

  const [museum, setMuseum] = useState<Museum | null>(null);
  const [loading, setLoading] = useState(true);

  // Step 1: Date & Time
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  // Step 2: Visitors
  const [visitors, setVisitors] = useState<Visitor[]>([
    { name: '', age: 0, ticketType: 'adult' },
  ]);

  // Contact Info
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Identity
  const [identityType, setIdentityType] = useState('aadhaar');
  const [identityNumber, setIdentityNumber] = useState('');

  // Additional Options
  const [hasAudioGuide, setHasAudioGuide] = useState(false);
  const [audioGuideQuantity, setAudioGuideQuantity] = useState(1);
  const [wheelchairAccess, setWheelchairAccess] = useState(false);
  const [specialRequirements, setSpecialRequirements] = useState('');

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    if (params.id) {
      fetchMuseum();
    }
  }, [params.id, isSignedIn]);

  const fetchMuseum = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await api.get<Museum>(
        endpoints.museums.detail(params.id as string),
        token || undefined
      );

      if (response.success && response.data) {
        setMuseum(response.data);
      } else {
        toast.error('Museum not found');
        router.push('/museums');
      }
    } catch (error) {
      console.error('Error fetching museum:', error);
      toast.error('Failed to load museum details');
      router.push('/museums');
    } finally {
      setLoading(false);
    }
  };

  const handleIdentityChange = (type: string, number: string) => {
    setIdentityType(type);
    setIdentityNumber(number);
  };

  const handleAudioGuideChange = (has: boolean, quantity: number) => {
    setHasAudioGuide(has);
    setAudioGuideQuantity(quantity);
  };

  const validateForm = () => {
    if (!selectedDate) {
      toast.error('Please select a visit date');
      return false;
    }

    if (!selectedTimeSlot) {
      toast.error('Please select a time slot');
      return false;
    }

    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone || !contactInfo.address) {
      toast.error('Please fill in all contact information');
      return false;
    }

    if (!/^\d{10}$/.test(contactInfo.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (visitors.length === 0) {
      toast.error('Please add at least one visitor');
      return false;
    }

    for (let i = 0; i < visitors.length; i++) {
      const visitor = visitors[i];
      if (!visitor.name || !visitor.age || visitor.age <= 0) {
        toast.error(`Please fill in all details for Visitor ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const calculateTicketBreakdown = () => {
    if (!museum) return [];

    const breakdown = visitors.reduce((acc, visitor) => {
      const existing = acc.find((item) => item.type === visitor.ticketType);
      if (existing) {
        existing.quantity += 1;
      } else {
        const ticketType = museum.ticketTypes.find((t) => t.type === visitor.ticketType);
        if (ticketType) {
          acc.push({
            type: visitor.ticketType,
            quantity: 1,
            pricePerTicket: ticketType.price,
            subtotal: ticketType.price,
          });
        }
      }
      return acc;
    }, [] as Array<{ type: string; quantity: number; pricePerTicket: number; subtotal: number }>);

    breakdown.forEach((item) => {
      item.subtotal = item.quantity * item.pricePerTicket;
    });

    return breakdown;
  };

  const calculateTotal = () => {
    const ticketBreakdown = calculateTicketBreakdown();
    const subtotal = ticketBreakdown.reduce((sum, item) => sum + item.subtotal, 0);
    const audioGuideTotal =
      hasAudioGuide && museum?.audioGuidePrice
        ? museum.audioGuidePrice * audioGuideQuantity
        : 0;
    const tax = (subtotal + audioGuideTotal) * 0.18;
    const platformFee = (subtotal + audioGuideTotal) * 0.02;
    return subtotal + audioGuideTotal + tax + platformFee;
  };

  const prepareBookingData = () => {
    if (!museum || !selectedDate || !selectedTimeSlot) return null;

    const ticketBreakdown = calculateTicketBreakdown();
    const subtotal = ticketBreakdown.reduce((sum, item) => sum + item.subtotal, 0);
    const audioGuideTotal =
      hasAudioGuide && museum.audioGuidePrice
        ? museum.audioGuidePrice * audioGuideQuantity
        : 0;
    const tax = (subtotal + audioGuideTotal) * 0.18;
    const platformFee = (subtotal + audioGuideTotal) * 0.02;
    const totalAmount = subtotal + audioGuideTotal + tax + platformFee;

    return {
      museumId: museum._id,
      visitDate: selectedDate.toISOString(),
      timeSlot: {
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
      },
      visitors,
      ticketBreakdown,
      contactInfo,
      identityType,
      identityNumber,
      subtotal,
      tax,
      platformFee,
      totalAmount,
      hasAudioGuide,
      audioGuideQuantity,
      wheelchairAccess,
      specialRequirements,
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!museum) {
    return null;
  }

  const bookingData = prepareBookingData();
  
  // Check basic requirements for enabling the button (without validation toasts)
  const canProceed = 
    selectedDate && 
    selectedTimeSlot && 
    contactInfo.name && 
    contactInfo.email && 
    contactInfo.phone && 
    contactInfo.address &&
    visitors.length > 0 &&
    visitors.every(v => v.name && v.age > 0);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push(`/museums/${params.id}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Museum
      </Button>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book Your Visit</h1>
        <p className="text-muted-foreground">
          Complete the form below to book your museum tickets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Date & Time */}
          <DateTimeSelector
            timeSlots={museum.timeSlots}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onDateChange={setSelectedDate}
            onTimeSlotChange={setSelectedTimeSlot}
          />

          {/* Step 2: Visitor Form */}
          {selectedDate && selectedTimeSlot && (
            <VisitorForm
              ticketTypes={museum.ticketTypes}
              visitors={visitors}
              onVisitorsChange={setVisitors}
              contactInfo={contactInfo}
              onContactInfoChange={setContactInfo}
              identityType={identityType}
              identityNumber={identityNumber}
              onIdentityChange={handleIdentityChange}
              hasAudioGuide={hasAudioGuide}
              audioGuideQuantity={audioGuideQuantity}
              onAudioGuideChange={handleAudioGuideChange}
              wheelchairAccess={wheelchairAccess}
              onWheelchairAccessChange={setWheelchairAccess}
              specialRequirements={specialRequirements}
              onSpecialRequirementsChange={setSpecialRequirements}
              audioGuidePrice={museum.audioGuidePrice}
            />
          )}
        </div>

        {/* Right Column - Summary & Payment */}
        <div className="space-y-6">
          <BookingSummary
            museumTitle={museum.title}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            visitors={visitors}
            ticketTypes={museum.ticketTypes}
            hasAudioGuide={hasAudioGuide}
            audioGuideQuantity={audioGuideQuantity}
            audioGuidePrice={museum.audioGuidePrice}
          />

          {/* Payment Button */}
          {selectedDate && selectedTimeSlot && bookingData && (
            <PaymentButton
              bookingData={bookingData}
              totalAmount={calculateTotal()}
              disabled={!canProceed}
              onValidate={validateForm}
            />
          )}
        </div>
      </div>
    </div>
  );
}