import VehiclesListPage from '@/app/_shared/pages/vehicles/VehiclesListPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerVehiclesPage() {
  return <VehiclesListPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
