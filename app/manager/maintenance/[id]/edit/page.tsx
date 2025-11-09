/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import MaintenanceEditPage from '@/app/_shared/pages/maintenance/MaintenanceEditPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerMaintenanceEditPage() {
  return <MaintenanceEditPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
