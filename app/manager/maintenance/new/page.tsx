/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import MaintenanceNewPage from '@/app/_shared/pages/maintenance/MaintenanceNewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerMaintenanceNewPage() {
  return <MaintenanceNewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
