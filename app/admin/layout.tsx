import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import AdminSidebar from '@/components/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Redirect if not logged in
  if (!session?.user) {
    redirect('/admin/signin')
  }

  // Redirect if not an admin
  if (session.user.role !== 'admin') {
    redirect('/manager/dashboard')
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      <AdminSidebar />
      <div className='flex-1 overflow-auto bg-[#F5F5F5]'>
        {children}
      </div>
    </div>
  )
}
