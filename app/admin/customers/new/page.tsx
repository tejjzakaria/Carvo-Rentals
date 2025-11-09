/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import CustomerNewPage from '@/app/_shared/pages/customers/CustomerNewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminCustomerNewPage() {
  return <CustomerNewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
