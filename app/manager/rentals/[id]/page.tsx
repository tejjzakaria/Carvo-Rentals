/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import RentalViewPage from '@/app/_shared/pages/rentals/RentalViewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerRentalViewPage() {
  return <RentalViewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
