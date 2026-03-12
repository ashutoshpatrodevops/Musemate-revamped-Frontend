import { redirect } from 'next/navigation';

interface DashboardBookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardBookingDetailPage({
  params,
}: DashboardBookingDetailPageProps) {
  const { id } = await params;

  redirect(`/bookings/${id}/confirmation`);
}
