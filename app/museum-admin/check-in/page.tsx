'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { museumAdminApi } from '@/lib/museum-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  Camera,
  Users,
  Calendar,
  Clock,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function CheckInPage() {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('qr');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualReference, setManualReference] = useState('');
  const [checkInResult, setCheckInResult] = useState<any>(null);

  // QR Code Scanner
  const startQRScanner = async () => {
    setScanning(true);
    setCheckInResult(null);

    try {
      // Check if browser supports camera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Camera not supported on this device');
        setScanning(false);
        return;
      }

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.play();

      // For demo purposes, we'll simulate QR scanning
      // In production, use a library like html5-qrcode or jsQR
      toast.info('QR Scanner started. Use manual check-in for now.');

      // Clean up
      setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop());
        setScanning(false);
      }, 5000);
    } catch (error: any) {
      console.error('Camera error:', error);
      toast.error('Failed to access camera: ' + error.message);
      setScanning(false);
    }
  };

  // Manual check-in
  const handleManualCheckIn = async () => {
    if (!manualReference.trim()) {
      toast.error('Please enter a booking reference');
      return;
    }

    try {
      setLoading(true);
      setCheckInResult(null);

      const token = await getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await museumAdminApi.checkInBooking(
        manualReference.trim(),
        token
      );

      if (response.success) {
        setCheckInResult({
          success: true,
          booking: response.data,
        });
        toast.success('Check-in successful! ✅');
        setManualReference('');
      } else {
        setCheckInResult({
          success: false,
          message: response.message || 'Check-in failed',
        });
        toast.error(response.message || 'Check-in failed');
      }
    } catch (error: any) {
      console.error('Check-in error:', error);
      setCheckInResult({
        success: false,
        message: error.message || 'Check-in failed',
      });
      toast.error(error.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQRCheckIn = async (qrCode: string) => {
    try {
      setLoading(true);
      setCheckInResult(null);

      const token = await getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await museumAdminApi.checkInBooking(qrCode, token);

      if (response.success) {
        setCheckInResult({
          success: true,
          booking: response.data,
        });
        toast.success('Check-in successful! ✅');
      } else {
        setCheckInResult({
          success: false,
          message: response.message || 'Check-in failed',
        });
        toast.error(response.message || 'Check-in failed');
      }
    } catch (error: any) {
      console.error('Check-in error:', error);
      setCheckInResult({
        success: false,
        message: error.message || 'Check-in failed',
      });
      toast.error(error.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Visitor Check-in</h1>
        <p className="text-muted-foreground mt-2">
          Scan QR code or enter booking reference to check in visitors
        </p>
      </div>

      {/* Check-in Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Check-in Method</CardTitle>
          <CardDescription>Choose how to check in visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr">
                <QrCode className="mr-2 h-4 w-4" />
                QR Code Scanner
              </TabsTrigger>
              <TabsTrigger value="manual">
                <Search className="mr-2 h-4 w-4" />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            {/* QR Code Scanner Tab */}
            <TabsContent value="qr" className="space-y-4">
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                {!scanning ? (
                  <>
                    <div className="p-8 rounded-full bg-primary/10">
                      <Camera className="h-16 w-16 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">
                        Scan Visitor's QR Code
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Click the button below to start scanning
                      </p>
                    </div>
                    <Button size="lg" onClick={startQRScanner}>
                      <Camera className="mr-2 h-5 w-5" />
                      Start Camera
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="p-8 rounded-lg border-2 border-dashed border-primary animate-pulse">
                      <QrCode className="h-16 w-16 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">Scanning...</h3>
                      <p className="text-sm text-muted-foreground">
                        Position the QR code within the frame
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setScanning(false)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>

              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> For full QR scanning functionality, Use better camera systems supported to{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    html5-qrcode
                  </code>{' '}
                  or{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">jsQR</code>
                  Use manual entry for now.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Manual Entry Tab */}
            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">Booking Reference</Label>
                  <Input
                    id="reference"
                    placeholder="Enter booking reference (e.g., BKG-12345)"
                    value={manualReference}
                    onChange={(e) => setManualReference(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleManualCheckIn();
                      }
                    }}
                  />
                </div>

                <Button
                  onClick={handleManualCheckIn}
                  disabled={loading || !manualReference.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking in...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Check In Visitor
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Check-in Result */}
      {checkInResult && (
        <Card className={checkInResult.success ? 'border-green-500' : 'border-red-500'}>
          <CardHeader>
            <div className="flex items-center gap-3">
              {checkInResult.success ? (
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <div className="p-3 rounded-full bg-red-100">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              )}
              <div>
                <CardTitle>
                  {checkInResult.success ? 'Check-in Successful!' : 'Check-in Failed'}
                </CardTitle>
                <CardDescription>
                  {checkInResult.success
                    ? 'Visitor has been checked in'
                    : checkInResult.message}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {checkInResult.success && checkInResult.booking && (
            <CardContent>
              <div className="space-y-4">
                {/* Booking Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Booking Reference
                    </div>
                    <div className="font-mono font-semibold">
                      {checkInResult.booking.bookingReference}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      Checked In
                    </Badge>
                  </div>
                </div>

                {/* Museum & Visit Info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Museum
                      </div>
                      <div className="font-medium">
                        {typeof checkInResult.booking.museum === 'object'
                          ? checkInResult.booking.museum.title
                          : 'Museum'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Customer
                      </div>
                      <div className="font-medium">
                        {checkInResult.booking.contactInfo?.name ||
                          (typeof checkInResult.booking.user === 'object'
                            ? checkInResult.booking.user.username
                            : 'Customer')}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Visit Date</div>
                        <div className="font-medium">
                          {format(
                            new Date(checkInResult.booking.visitDate),
                            'MMM dd, yyyy'
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Time Slot</div>
                        <div className="font-medium">
                          {checkInResult.booking.timeSlot?.startTime} -{' '}
                          {checkInResult.booking.timeSlot?.endTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visitors */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="font-semibold">
                      Visitors ({checkInResult.booking.totalVisitors})
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {checkInResult.booking.visitors?.map(
                      (visitor: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 border rounded"
                        >
                          <span className="text-sm">
                            {visitor.name} ({visitor.age}y)
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {visitor.ticketType}
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Check-in Time */}
                <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                  Checked in at {format(new Date(), 'hh:mm a')}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to Check In</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold">1.</span>
              <span>Ask visitor for their booking QR code or reference number</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">2.</span>
              <span>
                Scan the QR code or manually enter the booking reference
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">3.</span>
              <span>Verify visitor details and confirm check-in</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">4.</span>
              <span>Welcome the visitor and provide any necessary information</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}