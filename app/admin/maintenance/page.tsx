/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import MaintenanceListPage from '@/app/_shared/pages/maintenance/MaintenanceListPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminMaintenancePage() {
  return <MaintenanceListPage basePath="/admin" HeaderComponent={AdminHeader} />
}
