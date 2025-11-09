/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import RentalViewPage from '@/app/_shared/pages/rentals/RentalViewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminRentalViewPage() {
  return <RentalViewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
