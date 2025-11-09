/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import DamageNewPage from '@/app/_shared/pages/damages/DamageNewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminDamageNewPage() {
  return <DamageNewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
