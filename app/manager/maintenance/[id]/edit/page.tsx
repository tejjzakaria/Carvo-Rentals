import MaintenanceEditPage from '@/app/_shared/pages/maintenance/MaintenanceEditPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerMaintenanceEditPage() {
  return <MaintenanceEditPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
