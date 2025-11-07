import VehicleEditPage from '@/app/_shared/pages/vehicles/VehicleEditPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerVehicleEditPage() {
  return <VehicleEditPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
