import { redirect } from 'next/navigation';

export default function HelpPage() {
  // Keep legacy /help URL working by redirecting to the FAQ page.
  redirect('/faq');
}
