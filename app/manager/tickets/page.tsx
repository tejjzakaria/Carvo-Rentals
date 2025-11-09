/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import ManagerHeader from '@/components/ManagerHeader'
import TicketsListPage from '@/app/_shared/pages/tickets/TicketsListPage'

export default function ManagerTicketsPage() {
  return <TicketsListPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
