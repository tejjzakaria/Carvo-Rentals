/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import VehicleNewPage from '@/app/_shared/pages/vehicles/VehicleNewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminVehicleNewPage() {
  return <VehicleNewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
