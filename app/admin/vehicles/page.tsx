/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import VehiclesListPage from '@/app/_shared/pages/vehicles/VehiclesListPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminVehiclesPage() {
  return <VehiclesListPage basePath="/admin" HeaderComponent={AdminHeader} />
}
