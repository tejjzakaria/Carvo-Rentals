/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import CustomerNewPage from '@/app/_shared/pages/customers/CustomerNewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerCustomerNewPage() {
  return <CustomerNewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
