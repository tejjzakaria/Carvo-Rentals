import AdminHeader from '@/components/AdminHeader'
import TicketNewPage from '@/app/_shared/pages/tickets/TicketNewPage'

export default function AdminNewTicketPage() {
  return <TicketNewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
