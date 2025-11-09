import ManagerHeader from '@/components/ManagerHeader'
import TicketsListPage from '@/app/_shared/pages/tickets/TicketsListPage'

export default function ManagerTicketsPage() {
  return <TicketsListPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
