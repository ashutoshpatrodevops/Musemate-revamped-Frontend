'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { museumAdminApi } from '@/lib/museum-admin';
import { Booking, Museum } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Calendar,
  Users,
  IndianRupee,
  Eye,
  Download,
  Filter,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

export default function BookingsPage() {
  const { getToken } = useAuth();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [museumFilter, setMuseumFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchQuery, statusFilter, museumFilter, allBookings]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Load museums first
      const museumsRes = await museumAdminApi.getMyMuseums(token);
      if (!museumsRes.success || !museumsRes.data) {
        setError('Failed to load museums');
        return;
      }

      const museumsData = museumsRes.data.data || [];
      setMuseums(museumsData);

      // Load bookings for all museums
      const bookingsPromises = museumsData.map((museum) =>
        museumAdminApi.getMuseumBookings(
          museum._id,
          { page: 1, limit: 100 },
          token
        )
      );

      const bookingsResults = await Promise.all(bookingsPromises);

      // Combine all bookings
      const allBookingsData = bookingsResults.flatMap((result) =>
        result.success && result.data ? result.data.data || [] : []
      );

      setAllBookings(allBookingsData);
      setFilteredBookings(allBookingsData);
    } catch (err: any) {
      console.error('Error loading bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...allBookings];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof booking.user === 'object' &&
            booking.user.username?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Museum filter
    if (museumFilter !== 'all') {
      filtered = filtered.filter(
        (booking) =>
          (typeof booking.museum === 'object'
            ? booking.museum._id
            : booking.museum) === museumFilter
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getMuseumName = (museum: any) => {
    return typeof museum === 'object' ? museum.title : 'Unknown Museum';
  };

  const getUserName = (user: any) => {
    return typeof user === 'object' ? user.username : 'Unknown User';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Calculate summary stats
  const stats = {
    total: allBookings.length,
    confirmed: allBookings.filter((b) => b.status === 'confirmed').length,
    completed: allBookings.filter((b) => b.status === 'completed').length,
    totalRevenue: allBookings
      .filter((b) => b.payment.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Bookings</h1>
        <p className="text-muted-foreground mt-2">
          Manage bookings across all your museums
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={museumFilter} onValueChange={setMuseumFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by museum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Museums</SelectItem>
                {museums.map((museum) => (
                  <SelectItem key={museum._id} value={museum._id}>
                    {museum.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Bookings ({filteredBookings.length})
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No bookings found
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Museum</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Visitors</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-mono text-sm">
                        {booking.bookingReference}
                      </TableCell>
                      <TableCell>{getMuseumName(booking.museum)}</TableCell>
                      <TableCell>{getUserName(booking.user)}</TableCell>
                      <TableCell>
                        {format(new Date(booking.visitDate), 'MMM dd, yyyy')}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {booking.totalVisitors}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{booking.totalAmount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Reference: {selectedBooking?.bookingReference}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Museum</h4>
                  <p className="text-sm">{getMuseumName(selectedBooking.museum)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Status</h4>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Visit Information</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Date:</strong>{' '}
                    {format(new Date(selectedBooking.visitDate), 'MMMM dd, yyyy')}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedBooking.timeSlot.startTime} -{' '}
                    {selectedBooking.timeSlot.endTime}
                  </p>
                  <p>
                    <strong>Total Visitors:</strong> {selectedBooking.totalVisitors}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Visitors</h4>
                <div className="space-y-2">
                  {selectedBooking.visitors.map((visitor, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <span className="text-sm">
                        {visitor.name} ({visitor.age} years)
                      </span>
                      <Badge variant="outline">{visitor.ticketType}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Contact Information</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Name:</strong> {selectedBooking.contactInfo.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedBooking.contactInfo.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedBooking.contactInfo.email}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedBooking.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>₹{selectedBooking.tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span>₹{selectedBooking.platformFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{selectedBooking.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <Badge
                      className={
                        selectedBooking.payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {selectedBooking.payment.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequirements && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Special Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.specialRequirements}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}