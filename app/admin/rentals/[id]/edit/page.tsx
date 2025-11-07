import RentalEditPage from '@/app/_shared/pages/rentals/RentalEditPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminRentalEditPage() {
  return <RentalEditPage basePath="/admin" HeaderComponent={AdminHeader} />
}
