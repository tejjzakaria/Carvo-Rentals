import RentalViewPage from '@/app/_shared/pages/rentals/RentalViewPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminRentalViewPage() {
  return <RentalViewPage basePath="/admin" HeaderComponent={AdminHeader} />
}
