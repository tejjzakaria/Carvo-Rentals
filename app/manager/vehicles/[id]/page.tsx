/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import VehicleViewPage from '@/app/_shared/pages/vehicles/VehicleViewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerVehicleViewPage() {
  return <VehicleViewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
