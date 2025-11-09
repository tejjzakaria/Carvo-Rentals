import ManagerHeader from '@/components/ManagerHeader'
import TicketNewPage from '@/app/_shared/pages/tickets/TicketNewPage'

export default function ManagerNewTicketPage() {
  return <TicketNewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
