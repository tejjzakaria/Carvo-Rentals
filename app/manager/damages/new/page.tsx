import DamageNewPage from '@/app/_shared/pages/damages/DamageNewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerDamageNewPage() {
  return <DamageNewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
