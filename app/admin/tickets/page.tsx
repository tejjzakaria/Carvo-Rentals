/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import AdminHeader from '@/components/AdminHeader'
import TicketsListPage from '@/app/_shared/pages/tickets/TicketsListPage'

export default function AdminTicketsPage() {
  return <TicketsListPage basePath="/admin" HeaderComponent={AdminHeader} />
}
