/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import CustomersListPage from '@/app/_shared/pages/customers/CustomersListPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerCustomersPage() {
  return <CustomersListPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
