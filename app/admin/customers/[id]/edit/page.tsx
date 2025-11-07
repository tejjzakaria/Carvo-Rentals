import CustomerEditPage from '@/app/_shared/pages/customers/CustomerEditPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminCustomerEditPage() {
  return <CustomerEditPage basePath="/admin" HeaderComponent={AdminHeader} />
}
