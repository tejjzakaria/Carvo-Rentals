import RentalNewPage from '@/app/_shared/pages/rentals/RentalNewPage'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerRentalNewPage() {
  return <RentalNewPage basePath="/manager" HeaderComponent={ManagerHeader} />
}
