/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import AdminHeader from '@/components/AdminHeader'
import TicketNewPage from '@/app/_shared/pages/tickets/TicketNewPage'

export default function AdminNewTicketPage() {
  return <TicketNewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
