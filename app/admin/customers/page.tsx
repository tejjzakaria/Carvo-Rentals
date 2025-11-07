import CustomersListPage from '@/app/_shared/pages/customers/CustomersListPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminCustomersPage() {
  return <CustomersListPage basePath="/admin" HeaderComponent={AdminHeader} />
}
