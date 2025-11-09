/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import MaintenanceListPage from '@/app/_shared/pages/maintenance/MaintenanceListPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerMaintenancePage() {
  return <MaintenanceListPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
