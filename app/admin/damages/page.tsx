import DamagesListPage from '@/app/_shared/pages/damages/DamagesListPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminDamagesPage() {
  return <DamagesListPage basePath="/admin" HeaderComponent={AdminHeader} />
}
