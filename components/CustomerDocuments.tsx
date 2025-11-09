/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import Toast from '@/components/Toast'

interface Document {
  id: string
  documentType: string
  documentUrl: string | null
  uploadToken: string
  tokenExpiresAt: string
  status: string
  expiryDate: string | null
  rejectionReason: string | null
  uploadedAt: string | null
  verifiedAt: string | null
  createdAt: string
}

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export default function CustomerDocuments({ customerId }: { customerId: string }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewDocModal, setShowNewDocModal] = useState(false)
  const [newDocType, setNewDocType] = useState('drivers_license')
  const [newDocExpiry, setNewDocExpiry] = useState('')
  const [creating, setCreating] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [uploadLink, setUploadLink] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectingDocId, setRejectingDocId] = useState<string>('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  useEffect(() => {
    fetchDocuments()
  }, [customerId])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/${customerId}/documents`)
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRequest = async () => {
    if (!newDocType) return

    setCreating(true)
    try {
      const response = await fetch(`/api/customers/${customerId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: newDocType,
          expiryDate: newDocExpiry || null
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUploadLink(data.uploadLink)
        setShowNewDocModal(false)
        setShowLinkModal(true)
        fetchDocuments()
        setToast({
          show: true,
          message: 'Upload link created successfully!',
          type: 'success'
        })
      } else {
        // More specific error handling
        if (response.status === 409) {
          setToast({
            show: true,
            message: 'A document request already exists for this type. Use "Regenerate Link" to get a new upload link.',
            type: 'warning'
          })
        } else if (response.status === 404) {
          setToast({
            show: true,
            message: 'Customer not found. Please refresh the page.',
            type: 'error'
          })
        } else {
          setToast({
            show: true,
            message: data.error || 'Failed to create document request',
            type: 'error'
          })
        }
        console.error('Document creation error:', data.error, 'Status:', response.status)
      }
    } catch (error) {
      console.error('Error creating document:', error)
      setToast({
        show: true,
        message: 'Network error. Please check your connection and try again.',
        type: 'error'
      })
    } finally {
      setCreating(false)
    }
  }

  const handleVerify = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify' })
      })

      if (response.ok) {
        setToast({
          show: true,
          message: 'Document verified successfully!',
          type: 'success'
        })
        fetchDocuments()
      }
    } catch (error) {
      console.error('Error verifying document:', error)
    }
  }

  const handleReject = (documentId: string) => {
    setRejectingDocId(documentId)
    setRejectionReason('')
    setShowRejectModal(true)
  }

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      setToast({
        show: true,
        message: 'Please enter a rejection reason',
        type: 'warning'
      })
      return
    }

    setRejecting(true)
    try {
      const response = await fetch(`/api/documents/${rejectingDocId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejectionReason: rejectionReason })
      })

      if (response.ok) {
        setToast({
          show: true,
          message: 'Document rejected',
          type: 'success'
        })
        setShowRejectModal(false)
        setRejectionReason('')
        fetchDocuments()
      } else {
        setToast({
          show: true,
          message: 'Failed to reject document',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error rejecting document:', error)
      setToast({
        show: true,
        message: 'An error occurred',
        type: 'error'
      })
    } finally {
      setRejecting(false)
    }
  }

  const handleRegenerateLink = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'regenerate' })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUploadLink(data.uploadLink)
        setShowLinkModal(true)
        fetchDocuments()
        setToast({
          show: true,
          message: 'New upload link generated!',
          type: 'success'
        })
      }
    } catch (error) {
      console.error('Error regenerating link:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setToast({
      show: true,
      message: 'Link copied to clipboard!',
      type: 'success'
    })
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'drivers_license':
        return "Driver's License"
      case 'id_card':
        return 'ID Card'
      case 'proof_of_address':
        return 'Proof of Address'
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      uploaded: 'bg-blue-100 text-blue-800 border-blue-200',
      verified: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      expired: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[status] || colors.pending
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-bold text-[#000000]'>Documents</h2>
        <button
          onClick={() => setShowNewDocModal(true)}
          className='px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center gap-2'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Request Document
        </button>
      </div>

      {loading ? (
        <div className='text-center py-8'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      ) : documents.length === 0 ? (
        <div className='text-center py-8'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className='text-gray-500'>No documents requested yet</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {documents.map((doc) => (
            <div key={doc.id} className='border-2 border-gray-200 rounded-xl p-4'>
              <div className='flex items-start justify-between mb-3'>
                <div>
                  <h3 className='font-semibold text-[#000000]'>{getDocumentTypeLabel(doc.documentType)}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(doc.status)} mt-1`}>
                    {doc.status}
                  </span>
                </div>
                {doc.documentUrl && (
                  <a
                    href={doc.documentUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline text-sm font-semibold'
                  >
                    View Document
                  </a>
                )}
              </div>

              <div className='text-sm text-gray-600 space-y-1 mb-3'>
                {doc.expiryDate && (
                  <p>Expiry: {new Date(doc.expiryDate).toLocaleDateString()}</p>
                )}
                {doc.uploadedAt && (
                  <p>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                )}
                {doc.rejectionReason && (
                  <p className='text-red-600'>Reason: {doc.rejectionReason}</p>
                )}
              </div>

              <div className='flex gap-2'>
                {doc.status === 'pending' && (
                  <button
                    onClick={() => handleRegenerateLink(doc.id)}
                    className='px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200'
                  >
                    Regenerate Link
                  </button>
                )}
                {doc.status === 'uploaded' && (
                  <>
                    <button
                      onClick={() => handleVerify(doc.id)}
                      className='px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200'
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleReject(doc.id)}
                      className='px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200'
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Document Modal */}
      {showNewDocModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl max-w-md w-full p-6'>
            <h3 className='text-xl font-bold text-[#000000] mb-4'>Request Document Upload</h3>

            <div className='space-y-4 mb-6'>
              <div>
                <label className='block text-sm font-semibold text-gray-300 mb-2'>
                  Document Type
                </label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                >
                  <option value='drivers_license'>Driver's License</option>
                  <option value='id_card'>ID Card</option>
                  <option value='proof_of_address'>Proof of Address</option>
                </select>
              </div>

              {newDocType === 'drivers_license' && (
                <div>
                  <label className='block text-sm font-semibold text-gray-300 mb-2'>
                    License Expiry Date (Optional)
                  </label>
                  <input
                    type='date'
                    value={newDocExpiry}
                    onChange={(e) => setNewDocExpiry(e.target.value)}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                  />
                </div>
              )}
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => setShowNewDocModal(false)}
                className='flex-1 px-6 py-3 border-2 border-gray-200 text-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:text-white transition-all'
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                disabled={creating}
                className='flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark disabled:opacity-50'
              >
                {creating ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Link Modal */}
      {showLinkModal && uploadLink && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6'>
            <h3 className='text-xl font-bold text-[#000000] mb-4'>Upload Link Generated</h3>

            <div className='border-2 border-black rounded-xl p-4 mb-4'>
              <p className='text-sm text-gray-300 mb-2'>Share this link with the customer:</p>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={uploadLink}
                  readOnly
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm'
                />
                <button
                  onClick={() => copyToClipboard(uploadLink)}
                  className='px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark'
                >
                  Copy
                </button>
              </div>
              <p className='text-xs text-gray-500 mt-2'>Link expires in 7 days</p>
            </div>

            <button
              onClick={() => setShowLinkModal(false)}
              className='w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark'
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Reject Document Modal */}
      {showRejectModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl max-w-md w-full p-6'>
            <h3 className='text-xl font-bold text-[#000000] mb-4'>Reject Document</h3>

            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-300 mb-2'>
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder='Please explain why this document is being rejected...'
                rows={4}
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400 resize-none'
              />
              <p className='text-xs text-gray-300 mt-1'>
                This reason will be visible to the customer
              </p>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                }}
                disabled={rejecting}
                className='flex-1 px-6 py-3 border-2 border-gray-200 text-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={rejecting || !rejectionReason.trim()}
                className='flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition-all'
              >
                {rejecting ? 'Rejecting...' : 'Reject Document'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  )
}
