/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import DamageEditPage from '@/app/_shared/pages/damages/DamageEditPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerDamageEditPage() {
  return <DamageEditPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
