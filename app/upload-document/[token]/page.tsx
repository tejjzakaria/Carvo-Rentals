'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Toast from '@/components/Toast'

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface DocumentInfo {
  documentType: string
  customer: {
    name: string
    email: string
  }
  expiryDate: string | null
}

export default function UploadDocumentPage() {
  const params = useParams()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expiryDate, setExpiryDate] = useState('')
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/documents/upload?token=${token}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setDocumentInfo(data.document)
        if (data.document.expiryDate) {
          setExpiryDate(new Date(data.document.expiryDate).toISOString().split('T')[0])
        }
      } else {
        setError(data.error || 'Invalid or expired upload link')
      }
    } catch (err) {
      console.error('Token verification error:', err)
      setError('Failed to verify upload link')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setToast({
        show: true,
        message: 'Please upload a valid file (JPG, PNG, GIF, WebP, or PDF)',
        type: 'error'
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({
        show: true,
        message: 'File size must be less than 5MB',
        type: 'error'
      })
      return
    }

    setUploading(true)

    try {
      // Upload file to S3
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload file')
      }

      // Submit document URL with token
      const submitResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          documentUrl: uploadData.url
        })
      })

      const submitData = await submitResponse.json()

      if (submitResponse.ok && submitData.success) {
        setUploadSuccess(true)
        setToast({
          show: true,
          message: 'Document uploaded successfully! You can close this page now.',
          type: 'success'
        })
      } else {
        throw new Error(submitData.error || 'Failed to submit document')
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setToast({
        show: true,
        message: err.message || 'Failed to upload document',
        type: 'error'
      })
    } finally {
      setUploading(false)
    }
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

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4'></div>
          <p className='text-gray-300'>Verifying upload link...</p>
        </div>
      </div>
    )
  }

  if (error || !documentInfo) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-[#000000] mb-2'>Invalid Upload Link</h1>
          <p className='text-gray-300 mb-6'>{error}</p>
          <p className='text-sm text-gray-300'>
            Please contact the company to request a new upload link.
          </p>
        </div>
      </div>
    )
  }

  if (uploadSuccess) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-[#000000] mb-2'>Upload Successful!</h1>
          <p className='text-gray-300 mb-6'>
            Your {getDocumentTypeLabel(documentInfo.documentType)} has been successfully uploaded and submitted for verification.
          </p>
          <p className='text-sm text-gray-300'>
            You will be notified once your document is reviewed. You can safely close this page now.
          </p>
        </div>

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

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-[#000000] mb-2'>Upload Document</h1>
          <p className='text-gray-300'>
            Hello, <span className='font-semibold text-[#000000]'>{documentInfo.customer.name}</span>
          </p>
        </div>

        {/* Document Info */}
        <div className='border-2 border-black rounded-xl p-6 mb-6'>
          <h2 className='text-lg font-bold text-[#000000] mb-4'>Document Information</h2>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-300 mb-1'>Document Type</p>
              <p className='font-semibold text-[#000000]'>{getDocumentTypeLabel(documentInfo.documentType)}</p>
            </div>
            <div>
              <p className='text-sm text-gray-300 mb-1'>Customer Email</p>
              <p className='font-semibold text-[#000000]'>{documentInfo.customer.email}</p>
            </div>
            {documentInfo.expiryDate && (
              <div className='col-span-2'>
                <p className='text-sm text-gray-300 mb-1'>Document Expiry Date</p>
                <p className='font-semibold text-[#000000]'>
                  {new Date(documentInfo.expiryDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <h3 className='text-lg font-bold text-[#000000] mb-2'>
            {uploading ? 'Uploading...' : 'Upload Your Document'}
          </h3>
          <p className='text-sm text-gray-300 mb-4'>
            Supported formats: JPG, PNG, GIF, WebP, PDF (Max 5MB)
          </p>
          <input
            type='file'
            id='document-upload'
            accept='image/jpeg,image/png,image/gif,image/webp,application/pdf'
            onChange={handleFileUpload}
            disabled={uploading}
            className='hidden'
          />
          <label
            htmlFor='document-upload'
            className={`inline-block px-8 py-3 bg-primary text-white rounded-xl font-semibold transition-all cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
            }`}
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </label>
        </div>

        {/* Instructions */}
        <div className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
          <h4 className='font-semibold text-blue-900 mb-2 flex items-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Important Instructions
          </h4>
          <ul className='text-sm text-blue-800 space-y-1 list-disc list-inside'>
            <li>Make sure the document is clear and readable</li>
            <li>All information should be visible in the photo</li>
            <li>Ensure the document is not expired</li>
            <li>File size should not exceed 5MB</li>
          </ul>
        </div>
      </div>

      {/* Toast Notifications */}
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
