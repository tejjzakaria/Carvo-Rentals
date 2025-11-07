import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import ManagerSidebar from '@/components/ManagerSidebar'

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Redirect if not logged in
  if (!session?.user) {
    redirect('/admin/signin')
  }

  // Redirect if not a manager
  if (session.user.role !== 'manager') {
    redirect('/admin/dashboard')
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      <ManagerSidebar />
      <div className='flex-1 overflow-auto bg-[#F5F5F5]'>
        {children}
      </div>
    </div>
  )
}
