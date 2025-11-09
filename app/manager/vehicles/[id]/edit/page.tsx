/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import VehicleEditPage from '@/app/_shared/pages/vehicles/VehicleEditPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerVehicleEditPage() {
  return <VehicleEditPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
