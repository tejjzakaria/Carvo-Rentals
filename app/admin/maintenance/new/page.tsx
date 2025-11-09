/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import MaintenanceNewPage from '@/app/_shared/pages/maintenance/MaintenanceNewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminMaintenanceNewPage() {
  return <MaintenanceNewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
