import MaintenanceEditPage from '@/app/_shared/pages/maintenance/MaintenanceEditPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminMaintenanceEditPage() {
  return <MaintenanceEditPage basePath="/admin" HeaderComponent={AdminHeader} />
}
