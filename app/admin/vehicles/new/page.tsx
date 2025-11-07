import VehicleNewPage from '@/app/_shared/pages/vehicles/VehicleNewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminVehicleNewPage() {
  return <VehicleNewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
