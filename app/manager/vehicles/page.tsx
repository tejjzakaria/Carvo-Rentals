/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import VehiclesListPage from '@/app/_shared/pages/vehicles/VehiclesListPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerVehiclesPage() {
  return <VehiclesListPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
