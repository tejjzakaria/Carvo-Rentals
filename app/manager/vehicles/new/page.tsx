/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import VehicleNewPage from '@/app/_shared/pages/vehicles/VehicleNewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerVehicleNewPage() {
  return <VehicleNewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
