import RentalsListPage from '@/app/_shared/pages/rentals/RentalsListPage'
import AdminHeader from '@/components/AdminHeader'

export default function AdminRentalsPage() {
  return <RentalsListPage basePath="/admin" HeaderComponent={AdminHeader} />
}
