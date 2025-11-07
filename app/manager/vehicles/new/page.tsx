import VehicleNewPage from '@/app/_shared/pages/vehicles/VehicleNewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerVehicleNewPage() {
  return <VehicleNewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
