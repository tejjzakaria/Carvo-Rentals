import DamageEditPage from '@/app/_shared/pages/damages/DamageEditPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminDamageEditPage() {
  return <DamageEditPage basePath="/admin" HeaderComponent={AdminHeader} />
}
