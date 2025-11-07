import CustomerEditPage from '@/app/_shared/pages/customers/CustomerEditPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerCustomerEditPage() {
  return <CustomerEditPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
