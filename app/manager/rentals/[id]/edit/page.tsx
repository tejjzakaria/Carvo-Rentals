import RentalEditPage from '@/app/_shared/pages/rentals/RentalEditPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerRentalEditPage() {
  return <RentalEditPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
