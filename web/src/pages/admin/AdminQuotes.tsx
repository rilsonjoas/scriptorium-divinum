import { AdminLayout } from '@/components/AdminLayout';
import { QuotesPanel } from '@/components/admin/quotes/QuotesPanel';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AdminQuotes() {
  usePageTitle('Citações');
  return (
    <AdminLayout>
      <QuotesPanel />
    </AdminLayout>
  );
}
