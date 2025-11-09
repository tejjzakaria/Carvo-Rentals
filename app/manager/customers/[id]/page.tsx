/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import CustomerViewPage from '@/app/_shared/pages/customers/CustomerViewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerCustomerViewPage() {
  return <CustomerViewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
