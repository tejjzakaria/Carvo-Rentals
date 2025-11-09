/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import VehicleViewPage from '@/app/_shared/pages/vehicles/VehicleViewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminVehicleViewPage() {
  return <VehicleViewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
