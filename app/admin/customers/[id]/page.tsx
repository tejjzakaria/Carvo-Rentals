import CustomerViewPage from '@/app/_shared/pages/customers/CustomerViewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminCustomerViewPage() {
  return <CustomerViewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
