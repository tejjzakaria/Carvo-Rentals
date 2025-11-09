/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import ManagerHeader from '@/components/ManagerHeader'
import TicketViewPage from '@/app/_shared/pages/tickets/TicketViewPage'

export default function ManagerTicketDetailPage() {
  return <TicketViewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
