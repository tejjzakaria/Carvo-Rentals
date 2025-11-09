/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import RentalEditPage from '@/app/_shared/pages/rentals/RentalEditPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerRentalEditPage() {
  return <RentalEditPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
