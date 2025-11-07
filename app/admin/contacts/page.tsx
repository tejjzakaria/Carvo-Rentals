'use client'
import { useState, useEffect } from 'react'
import AdminHeader from '@/components/AdminHeader'
import ConfirmDialog from '@/components/ConfirmDialog'

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
  updatedAt: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; contactId: string | null; contactName: string }>({
    isOpen: false,
    contactId: null,
    contactName: ''
  })

  useEffect(() => {
    fetchContacts()
  }, [statusFilter])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const url = statusFilter === 'all'
        ? '/api/contacts'
        : `/api/contacts?status=${statusFilter}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setContacts(data.contacts)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setContacts(contacts.map(c =>
          c.id === id ? { ...c, status: newStatus as Contact['status'] } : c
        ))

        // Update selected contact if it's the one being updated
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status: newStatus as Contact['status'] })
        }
      }
    } catch (error) {
      console.error('Error updating contact status:', error)
    }
  }

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      contactId: id,
      contactName: name
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.contactId) return

    try {
      const response = await fetch(`/api/contacts?id=${deleteDialog.contactId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setContacts(contacts.filter(c => c.id !== deleteDialog.contactId))
        if (selectedContact?.id === deleteDialog.contactId) {
          setShowDetailsModal(false)
          setSelectedContact(null)
        }
        setDeleteDialog({ isOpen: false, contactId: null, contactName: '' })
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const contact = contacts.find(c => c.id === id)
    if (contact?.status === 'read') return // Already read

    try {
      const response = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status: 'read' })
      })

      const data = await response.json()

      if (data.success) {
        setContacts(contacts.map(c =>
          c.id === id ? { ...c, status: 'read' as Contact['status'] } : c
        ))
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const openDetailsModal = (contact: Contact) => {
    setSelectedContact(contact)
    setShowDetailsModal(true)

    // Mark as read if it's new
    if (contact.status === 'new') {
      updateStatus(contact.id, 'read')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      read: 'bg-gray-100 text-gray-800 border-gray-200',
      replied: 'bg-green-100 text-green-800 border-green-200',
      archived: 'bg-purple-100 text-purple-800 border-purple-200'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
    archived: contacts.filter(c => c.status === 'archived').length
  }

  return (
    <>
      <AdminHeader
        title="Contact Messages"
        subtitle="Manage customer inquiries and messages"
      />
      <main className='p-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-6'>
          <div className='bg-white rounded-xl p-6 border-2 border-gray-200'>
            <div className='text-sm text-gray-300 mb-1'>Total</div>
            <div className='text-3xl font-bold text-gray-300'>{stats.total}</div>
          </div>
          <div className='bg-blue-50 rounded-xl p-6 border-2 border-blue-200'>
            <div className='text-sm text-blue-600 mb-1'>New</div>
            <div className='text-3xl font-bold text-blue-900'>{stats.new}</div>
          </div>
          <div className='bg-gray-900 rounded-xl p-6 border-2 border-gray-200'>
            <div className='text-sm text-gray-300 mb-1'>Read</div>
            <div className='text-3xl font-bold text-gray-300'>{stats.read}</div>
          </div>
          <div className='bg-green-50 rounded-xl p-6 border-2 border-green-200'>
            <div className='text-sm text-green-600 mb-1'>Replied</div>
            <div className='text-3xl font-bold text-green-900'>{stats.replied}</div>
          </div>
          <div className='bg-purple-50 rounded-xl p-6 border-2 border-purple-200'>
            <div className='text-sm text-purple-600 mb-1'>Archived</div>
            <div className='text-3xl font-bold text-purple-900'>{stats.archived}</div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-xl p-6 border-2 border-gray-200 mb-6'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-semibold text-gray-300'>Filter by status:</span>
            <div className='flex gap-2'>
              {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className='bg-white rounded-xl border-2 border-gray-200 overflow-hidden'>
          {loading ? (
            <div className='p-12 text-center'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary mb-4'></div>
              <p className='text-gray-300'>Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className='p-12 text-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className='text-gray-300'>No contact messages found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200'>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>
                      Name
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>
                      Contact Info
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>
                      Subject
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>
                      Date
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className='cursor-pointer'
                      onClick={() => openDetailsModal(contact)}
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='h-10 w-10 flex-shrink-0 bg-primary rounded-full flex items-center justify-center'>
                            <span className='text-white font-semibold'>
                              {contact.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className='ml-4'>
                            <div className='text-sm font-semibold text-gray-300'>{contact.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-300'>{contact.email}</div>
                        {contact.phone && (
                          <div className='text-sm text-gray-500'>{contact.phone}</div>
                        )}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-300 max-w-xs truncate'>{contact.subject}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {getStatusBadge(contact.status)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => markAsRead(contact.id, e)}
                            className={`p-2 rounded-lg transition-colors ${
                              contact.status === 'read'
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            title='Mark as Read'
                            disabled={contact.status === 'read'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClick(contact.id, contact.name)
                            }}
                            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                            title='Delete'
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {showDetailsModal && selectedContact && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            {/* Background overlay */}
            <div
              className='fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75'
              onClick={() => setShowDetailsModal(false)}
            ></div>

            {/* Modal panel */}
            <div className='inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full'>
              {/* Header */}
              <div className='bg-gradient-to-r from-primary to-primary-light px-6 py-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-bold text-white'>Contact Message Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className='text-white hover:text-gray-200 transition-colors'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className='px-6 py-6'>
                {/* Contact Info */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                  <div>
                    <label className='text-sm font-semibold text-gray-300'>Name</label>
                    <p className='text-lg text-gray-300 mt-1'>{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className='text-sm font-semibold text-gray-300'>Status</label>
                    <div className='mt-1'>{getStatusBadge(selectedContact.status)}</div>
                  </div>
                  <div>
                    <label className='text-sm font-semibold text-gray-300'>Email</label>
                    <p className='text-lg text-gray-300 mt-1'>
                      <a href={`mailto:${selectedContact.email}`} className='text-primary hover:underline'>
                        {selectedContact.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-semibold text-gray-300'>Phone</label>
                    <p className='text-lg text-gray-300 mt-1'>
                      {selectedContact.phone ? (
                        <a href={`tel:${selectedContact.phone}`} className='text-primary hover:underline'>
                          {selectedContact.phone}
                        </a>
                      ) : (
                        <span className='text-gray-400'>Not provided</span>
                      )}
                    </p>
                  </div>
                  <div className='md:col-span-2'>
                    <label className='text-sm font-semibold text-gray-300'>Subject</label>
                    <p className='text-lg text-gray-300 mt-1'>{selectedContact.subject}</p>
                  </div>
                </div>

                {/* Message */}
                <div className='mb-6'>
                  <label className='text-sm font-semibold text-gray-300'>Message</label>
                  <div className='mt-2 p-4 bg-gray-50 rounded-lg border-2 border-gray-200'>
                    <p className='text-gray-300 whitespace-pre-wrap'>{selectedContact.message}</p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg'>
                  <div>
                    <label className='text-xs font-semibold text-gray-300'>Received At</label>
                    <p className='text-sm text-gray-300 mt-1'>{formatDate(selectedContact.createdAt)}</p>
                  </div>
                  <div>
                    <label className='text-xs font-semibold text-gray-300'>Last Updated</label>
                    <p className='text-sm text-gray-300 mt-1'>{formatDate(selectedContact.updatedAt)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className='border-t-2 border-gray-200 pt-6'>
                  <label className='text-sm font-semibold text-gray-300 block mb-3'>Change Status</label>
                  <div className='flex flex-wrap gap-2'>
                    {['new', 'read', 'replied', 'archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedContact.id, status)}
                        disabled={selectedContact.status === status}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedContact.status === status
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                      >
                        Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className='bg-gray-50 px-6 py-4 flex justify-between items-center'>
                <button
                  onClick={() => {
                    handleDeleteClick(selectedContact.id, selectedContact.name)
                    setShowDetailsModal(false)
                  }}
                  className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all'
                >
                  Delete Message
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className='px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, contactId: null, contactName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact Message"
        message={`Are you sure you want to delete the message from "${deleteDialog.contactName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  )
}
