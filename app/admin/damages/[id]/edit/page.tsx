/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import DamageEditPage from '@/app/_shared/pages/damages/DamageEditPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminDamageEditPage() {
  return <DamageEditPage basePath="/admin" HeaderComponent={AdminHeader} />
}
