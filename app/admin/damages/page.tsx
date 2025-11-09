/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import DamagesListPage from '@/app/_shared/pages/damages/DamagesListPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminDamagesPage() {
  return <DamagesListPage basePath="/admin" HeaderComponent={AdminHeader} />
}
