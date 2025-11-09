/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import AdminHeader from '@/components/AdminHeader'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const FAQ_CATEGORIES = ['General', 'Pricing', 'Insurance', 'Booking', 'Vehicles', 'Documents']

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    isActive: true
  })
  const [selectedFaqs, setSelectedFaqs] = useState<string[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null)
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
    fetchFAQs()
  }, [filterCategory])

  const fetchFAQs = async () => {
    try {
      const params = new URLSearchParams()
      if (filterCategory !== 'All') {
        params.append('category', filterCategory)
      }

      const res = await fetch(`/api/faqs?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setFaqs(data.faqs)
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      showToast('Failed to fetch FAQs', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/faqs/${editingId}` : '/api/faqs'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        showToast(
          editingId ? 'FAQ updated successfully!' : 'FAQ created successfully!',
          'success'
        )
        fetchFAQs()
        resetForm()
      } else {
        showToast(data.error || 'Failed to save FAQ', 'error')
      }
    } catch (error) {
      console.error('Error saving FAQ:', error)
      showToast('Failed to save FAQ', 'error')
    }
  }

  const handleEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      isActive: faq.isActive
    })
    setEditingId(faq.id)
    setShowForm(true)
  }

  const handleDeleteClick = (id: string) => {
    setFaqToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return

    try {
      const response = await fetch(`/api/faqs/${faqToDelete}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showToast('FAQ deleted successfully!', 'success')
        fetchFAQs()
      } else {
        const data = await response.json()
        showToast(data.error || 'Failed to delete FAQ', 'error')
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      showToast('Failed to delete FAQ', 'error')
    } finally {
      setDeleteConfirmOpen(false)
      setFaqToDelete(null)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFaqs(faqs.map(f => f.id))
    } else {
      setSelectedFaqs([])
    }
  }

  const handleSelectFaq = (faqId: string, checked: boolean) => {
    if (checked) {
      setSelectedFaqs(prev => [...prev, faqId])
    } else {
      setSelectedFaqs(prev => prev.filter(id => id !== faqId))
    }
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialog({
      isOpen: true,
      count: selectedFaqs.length
    })
  }

  const handleBulkDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/faqs/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ faqIds: selectedFaqs })
      })

      const data = await response.json()

      if (response.ok) {
        showToast(data.message || `Successfully deleted ${selectedFaqs.length} FAQ(s)`, 'success')
        setSelectedFaqs([])
        setBulkDeleteDialog({ isOpen: false, count: 0 })
        fetchFAQs()
      } else {
        showToast(data.error || 'Failed to delete FAQs', 'error')
      }
    } catch (error) {
      console.error('Failed to bulk delete FAQs:', error)
      showToast('An error occurred while deleting FAQs', 'error')
    }
  }

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      order: 0,
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <>
      <AdminHeader title='FAQs' subtitle='Manage frequently asked questions' />

      <main className='flex-1 overflow-y-auto p-6'>
          {/* Header with Add Button and Filters */}
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-[#000000]'>Manage FAQs</h2>
              <p className='text-gray-500 mt-1'>Add and manage frequently asked questions</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add FAQ
            </button>
          </div>

          {/* Category Filter */}
          <div className='mb-6 flex gap-2 flex-wrap'>
            {['All', ...FAQ_CATEGORIES].map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
              <div className='bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-xl font-bold text-[#000000]'>
                    {editingId ? 'Edit FAQ' : 'Add New FAQ'}
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
                  <div>
                    <label className='block text-sm font-medium text-[#000000] mb-2'>
                      Question *
                    </label>
                    <input
                      type='text'
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all'
                      placeholder='e.g., What documents do I need to rent a car?'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[#000000] mb-2'>
                      Answer *
                    </label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[120px]'
                      placeholder='Detailed answer to the question...'
                      required
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-[#000000] mb-2'>
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all'
                      >
                        {FAQ_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

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
                  </div>

                  <div className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      id='isActive'
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                    <label htmlFor='isActive' className='text-sm font-medium text-[#000000]'>
                      Show on website
                    </label>
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
          {selectedFaqs.length > 0 && (
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold'>
                  {selectedFaqs.length}
                </div>
                <span className='text-gray-300 font-medium'>
                  {selectedFaqs.length} FAQ{selectedFaqs.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setSelectedFaqs([])}
                  className='px-4 py-2 text-gray-300 hover:text-gray-700 font-medium transition-colors'
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleBulkDeleteClick}
                  className='px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center gap-2'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* FAQs Table */}
          {loading ? (
            <div className='text-center py-12'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary'></div>
              <p className='mt-4 text-lg text-gray-500'>Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className='text-center py-12 bg-white rounded-2xl border-2 border-gray-200'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className='text-lg text-gray-500 mb-4'>No FAQs added yet</p>
              <button
                onClick={() => setShowForm(true)}
                className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors'
              >
                Add Your First FAQ
              </button>
            </div>
          ) : (
            <div className='bg-white rounded-2xl border-2 border-gray-200 overflow-hidden'>
              <table className='w-full'>
                <thead className='bg-white border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left'>
                      <input
                        type='checkbox'
                        checked={selectedFaqs.length === faqs.length && faqs.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                      />
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Question</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Category</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Order</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Status</th>
                    <th className='px-6 py-4 text-right text-sm font-semibold text-gray-300'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {faqs.map((faq) => (
                    <tr key={faq.id} className='hover:bg-blue-50/30 transition-colors'>
                      <td className='px-6 py-4'>
                        <input
                          type='checkbox'
                          checked={selectedFaqs.includes(faq.id)}
                          onChange={(e) => handleSelectFaq(faq.id, e.target.checked)}
                          className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                        />
                      </td>
                      <td className='px-6 py-4'>
                        <div className='max-w-md'>
                          <p className='font-medium text-[#000000] mb-1'>{faq.question}</p>
                          <p className='text-sm text-gray-500 line-clamp-2'>{faq.answer}</p>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                          {faq.category}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-gray-600'>{faq.order}</td>
                      <td className='px-6 py-4'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          faq.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => handleEdit(faq)}
                            className='p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors'
                            title='Edit'
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(faq.id)}
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
        title='Delete FAQ'
        message='Are you sure you want to delete this FAQ? This action cannot be undone.'
        confirmText='Delete'
        type='danger'
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={bulkDeleteDialog.isOpen}
        onClose={() => setBulkDeleteDialog({ isOpen: false, count: 0 })}
        onConfirm={handleBulkDeleteConfirm}
        title='Bulk Delete FAQs'
        message={`Are you sure you want to delete ${bulkDeleteDialog.count} FAQ${bulkDeleteDialog.count > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText='Delete All'
        cancelText='Cancel'
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
