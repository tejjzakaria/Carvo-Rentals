/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import RentalNewPage from '@/app/_shared/pages/rentals/RentalNewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerRentalNewPage() {
  return <RentalNewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
