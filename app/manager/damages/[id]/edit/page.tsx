import DamageEditPage from '@/app/_shared/pages/damages/DamageEditPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerDamageEditPage() {
  return <DamageEditPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
