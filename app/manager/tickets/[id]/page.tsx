import ManagerHeader from '@/components/ManagerHeader'
import TicketViewPage from '@/app/_shared/pages/tickets/TicketViewPage'

export default function ManagerTicketDetailPage() {
  return <TicketViewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
