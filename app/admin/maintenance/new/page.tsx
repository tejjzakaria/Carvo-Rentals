import MaintenanceNewPage from '@/app/_shared/pages/maintenance/MaintenanceNewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminMaintenanceNewPage() {
  return <MaintenanceNewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
