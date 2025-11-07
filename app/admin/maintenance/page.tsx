import MaintenanceListPage from '@/app/_shared/pages/maintenance/MaintenanceListPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminMaintenancePage() {
  return <MaintenanceListPage basePath="/admin" HeaderComponent={AdminHeader} />
}
