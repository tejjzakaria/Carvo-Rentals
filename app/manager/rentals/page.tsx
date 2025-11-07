import RentalsListPage from '@/app/_shared/pages/rentals/RentalsListPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerRentalsPage() {
  return <RentalsListPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
