import MaintenanceNewPage from '@/app/_shared/pages/maintenance/MaintenanceNewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerMaintenanceNewPage() {
  return <MaintenanceNewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
