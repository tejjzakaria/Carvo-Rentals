import MaintenanceListPage from '@/app/_shared/pages/maintenance/MaintenanceListPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerMaintenancePage() {
  return <MaintenanceListPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
