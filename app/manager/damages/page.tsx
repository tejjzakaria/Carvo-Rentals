import DamagesListPage from '@/app/_shared/pages/damages/DamagesListPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerDamagesPage() {
  return <DamagesListPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
