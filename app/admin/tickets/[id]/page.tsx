/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import AdminHeader from '@/components/AdminHeader'
import TicketViewPage from '@/app/_shared/pages/tickets/TicketViewPage'

export default function AdminTicketDetailPage() {
  return <TicketViewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
