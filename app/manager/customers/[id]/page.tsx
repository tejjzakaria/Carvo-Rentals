import CustomerViewPage from '@/app/_shared/pages/customers/CustomerViewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerCustomerViewPage() {
  return <CustomerViewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
