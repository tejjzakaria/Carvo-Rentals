/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import RentalEditPage from '@/app/_shared/pages/rentals/RentalEditPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminRentalEditPage() {
  return <RentalEditPage basePath="/admin" HeaderComponent={AdminHeader} />
}
