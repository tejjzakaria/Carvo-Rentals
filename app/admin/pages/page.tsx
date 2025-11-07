'use client'
import { useState, useEffect } from 'react'
import AdminHeader from '@/components/AdminHeader'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'
import RichTextEditor from '@/components/RichTextEditor'

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface Page {
  id: string
  title: string
  slug: string
  content: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function PagesAdminPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    order: 0,
    isActive: true
  })
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<string | null>(null)
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState<{ isOpen: boolean; count: number }>({
    isOpen: false,
    count: 0
  })
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages')
      const data = await res.json()
      if (data.success) {
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
      showToast('Failed to fetch pages', 'error')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingId ? formData.slug : generateSlug(title)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/pages/${editingId}` : '/api/pages'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        showToast(
          editingId ? 'Page updated successfully!' : 'Page created successfully!',
          'success'
        )
        fetchPages()
        resetForm()
      } else {
        showToast(data.error || 'Failed to save page', 'error')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      showToast('Failed to save page', 'error')
    }
  }

  const handleEdit = (page: Page) => {
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      order: page.order,
      isActive: page.isActive
    })
    setEditingId(page.id)
    setShowForm(true)
  }

  const handleDeleteClick = (id: string) => {
    setPageToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return

    try {
      const response = await fetch(`/api/pages/${pageToDelete}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showToast('Page deleted successfully!', 'success')
        fetchPages()
      } else {
        const data = await response.json()
        showToast(data.error || 'Failed to delete page', 'error')
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      showToast('Failed to delete page', 'error')
    } finally {
      setDeleteConfirmOpen(false)
      setPageToDelete(null)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPages(pages.map(p => p.id))
    } else {
      setSelectedPages([])
    }
  }

  const handleSelectPage = (pageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPages(prev => [...prev, pageId])
    } else {
      setSelectedPages(prev => prev.filter(id => id !== pageId))
    }
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialog({
      isOpen: true,
      count: selectedPages.length
    })
  }

  const handleBulkDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/pages/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageIds: selectedPages })
      })

      const data = await response.json()

      if (response.ok) {
        showToast(data.message || `Successfully deleted ${selectedPages.length} page(s)`, 'success')
        setSelectedPages([])
        setBulkDeleteDialog({ isOpen: false, count: 0 })
        fetchPages()
      } else {
        showToast(data.error || 'Failed to delete pages', 'error')
      }
    } catch (error) {
      console.error('Failed to bulk delete pages:', error)
      showToast('An error occurred while deleting pages', 'error')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      order: 0,
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <>
      <AdminHeader title='Content Pages' subtitle='Manage Terms, Privacy Policy, and other pages' />

      <main className='flex-1 overflow-y-auto p-6'>
          {/* Header with Add Button */}
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-[#000000]'>Manage Pages</h2>
              <p className='text-gray-500 mt-1'>Create and manage content pages</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Page
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
              <div className='bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-xl font-bold text-[#000000]'>
                    {editingId ? 'Edit Page' : 'Add New Page'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className='text-gray-400 hover:text-gray-600'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-[#000000] mb-2'>
                        Page Title *
                      </label>
                      <input
                        type='text'
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all'
                        placeholder='e.g., Terms and Conditions'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-[#000000] mb-2'>
                        URL Slug *
                      </label>
                      <input
                        type='text'
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all'
                        placeholder='e.g., terms-and-conditions'
                        required
                      />
                      <p className='text-xs text-gray-500 mt-1'>
                        URL will be: /pages/{formData.slug || 'your-slug'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[#000000] mb-2'>
                      Content *
                    </label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      placeholder='Start writing your page content...'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      Use the toolbar to format your content
                    </p>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-[#000000] mb-2'>
                        Display Order
                      </label>
                      <input
                        type='number'
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all'
                        min='0'
                      />
                    </div>

                    <div className='flex items-end'>
                      <div className='flex items-center gap-3'>
                        <input
                          type='checkbox'
                          id='isActive'
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                        />
                        <label htmlFor='isActive' className='text-sm font-medium text-[#000000]'>
                          Active (visible on website)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-3 pt-4'>
                    <button
                      type='button'
                      onClick={resetForm}
                      className='flex-1 px-4 py-2 border-2 border-gray-200 text-gray-300 rounded-lg hover:bg-gray-50 hover:text-white transition-colors'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors'
                    >
                      {editingId ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Bulk Actions Bar */}
          {selectedPages.length > 0 && (
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold'>
                  {selectedPages.length}
                </div>
                <span className='text-gray-300 font-medium'>
                  {selectedPages.length} page{selectedPages.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setSelectedPages([])}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleBulkDeleteClick}
                  className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Pages Table */}
          {loading ? (
            <div className='text-center py-12'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary'></div>
              <p className='mt-4 text-lg text-gray-500'>Loading pages...</p>
            </div>
          ) : pages.length === 0 ? (
            <div className='text-center py-12 bg-white rounded-2xl border-2 border-gray-200'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className='text-lg text-gray-500 mb-4'>No pages added yet</p>
              <button
                onClick={() => setShowForm(true)}
                className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors'
              >
                Add Your First Page
              </button>
            </div>
          ) : (
            <div className='bg-white rounded-2xl border-2 border-gray-200 overflow-hidden'>
              <table className='w-full'>
                <thead className='bg-white border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 w-12'>
                      <input
                        type='checkbox'
                        checked={pages.length > 0 && selectedPages.length === pages.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                      />
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Title</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Slug</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Order</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Status</th>
                    <th className='px-6 py-4 text-right text-sm font-semibold text-gray-300'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {pages.map((page) => (
                    <tr key={page.id} className='hover:bg-blue-50/30 transition-colors'>
                      <td className='px-6 py-4'>
                        <input
                          type='checkbox'
                          checked={selectedPages.includes(page.id)}
                          onChange={(e) => handleSelectPage(page.id, e.target.checked)}
                          className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                        />
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <span className='font-medium text-[#000000]'>{page.title}</span>
                            <p className='text-xs text-gray-500 mt-1'>
                              {page.content.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <code className='text-sm bg-gray-100 px-2 py-1 rounded text-primary'>
                          /{page.slug}
                        </code>
                      </td>
                      <td className='px-6 py-4 text-gray-600'>{page.order}</td>
                      <td className='px-6 py-4'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          page.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => handleEdit(page)}
                            className='p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors'
                            title='Edit'
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(page.id)}
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
      </main>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Delete Page'
        message='Are you sure you want to delete this page? This action cannot be undone.'
        confirmText='Delete'
        type='danger'
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={bulkDeleteDialog.isOpen}
        onClose={() => setBulkDeleteDialog({ isOpen: false, count: 0 })}
        onConfirm={handleBulkDeleteConfirm}
        title='Delete Multiple Pages'
        message={`Are you sure you want to delete ${bulkDeleteDialog.count} page${bulkDeleteDialog.count > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText='Delete All'
        type='danger'
      />

      {/* Toast Notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  )
}
