import VehicleEditPage from '@/app/_shared/pages/vehicles/VehicleEditPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminVehicleEditPage() {
  return <VehicleEditPage basePath="/admin" HeaderComponent={AdminHeader} />
}
