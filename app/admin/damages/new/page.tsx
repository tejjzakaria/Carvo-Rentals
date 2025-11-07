import DamageNewPage from '@/app/_shared/pages/damages/DamageNewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminDamageNewPage() {
  return <DamageNewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
