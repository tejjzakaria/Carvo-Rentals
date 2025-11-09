/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import RentalNewPage from '@/app/_shared/pages/rentals/RentalNewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminRentalNewPage() {
  return <RentalNewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
