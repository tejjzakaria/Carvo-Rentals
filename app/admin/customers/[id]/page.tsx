/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import CustomerViewPage from '@/app/_shared/pages/customers/CustomerViewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminCustomerViewPage() {
  return <CustomerViewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
