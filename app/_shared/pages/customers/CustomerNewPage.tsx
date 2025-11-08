'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'
import { useSettings } from '@/contexts/SettingsContext'

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface SharedPageProps {
  basePath: string
  HeaderComponent: React.ComponentType<any>
}

export default function NewCustomerPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    status: 'active'
  })
  const [requestDocument, setRequestDocument] = useState(false)
  const [documentExpiry, setDocumentExpiry] = useState('')
  const [uploadLink, setUploadLink] = useState('')
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [uploadOption, setUploadOption] = useState<'request' | 'upload'>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([])
  const [ocrConfidence, setOcrConfidence] = useState<'high' | 'medium' | 'low' | null>(null)

  const statusOptions = ['active', 'inactive']
  const locationSuggestions = [
    'Casablanca, Morocco',
    'Rabat, Morocco',
    'Marrakech, Morocco',
    'Tangier, Morocco',
    'Fes, Morocco',
    'Agadir, Morocco',
    'Meknes, Morocco',
    'Oujda, Morocco'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setToast({
        show: true,
        message: 'Please upload a valid file (JPG, PNG, or PDF)',
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

    setSelectedFile(file)

    // If upload option is 'upload', trigger OCR analysis
    console.log('Upload option:', uploadOption, 'Request document:', requestDocument)
    if (uploadOption === 'upload' && requestDocument) {
      console.log('Triggering OCR analysis...')
      await analyzeDriversLicense(file)
    }
  }

  const analyzeDriversLicense = async (file: File) => {
    console.log('analyzeDriversLicense called with file:', file.name, file.type)
    try {
      setAnalyzing(true)
      console.log('Set analyzing to true')
      setToast({
        show: true,
        message: 'Analyzing driver\'s license... This may take a few seconds.',
        type: 'info'
      })

      // Convert file to base64
      console.log('Converting file to base64...')
      const reader = new FileReader()
      reader.readAsDataURL(file)

      await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
      })

      const base64Data = (reader.result as string).split(',')[1]
      const mimeType = file.type
      console.log('File converted, mimeType:', mimeType, 'base64 length:', base64Data.length)

      // Call OCR API
      console.log('Calling OCR API...')
      const response = await fetch('/api/ocr/drivers-license', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType
        })
      })

      console.log('OCR API response status:', response.status)
      const data = await response.json()
      console.log('OCR API response data:', data)

      if (response.ok && data.success) {
        const { extractedData } = data
        const fieldsToFill: string[] = []

        // Auto-fill form fields with extracted data
        if (extractedData.name) {
          setFormData(prev => ({ ...prev, name: extractedData.name }))
          fieldsToFill.push('name')
        }

        if (extractedData.phone) {
          setFormData(prev => ({ ...prev, phone: extractedData.phone }))
          fieldsToFill.push('phone')
        }

        if (extractedData.address) {
          setFormData(prev => ({ ...prev, location: extractedData.address }))
          fieldsToFill.push('location')
        }

        if (extractedData.expiryDate) {
          setDocumentExpiry(extractedData.expiryDate)
          fieldsToFill.push('expiryDate')
        }

        setAutoFilledFields(fieldsToFill)
        setOcrConfidence(extractedData.confidence || 'medium')

        setToast({
          show: true,
          message: `Successfully extracted information! ${fieldsToFill.length} field(s) auto-filled.`,
          type: 'success'
        })
      } else {
        setToast({
          show: true,
          message: data.error || 'Could not extract information. Please fill manually.',
          type: 'warning'
        })
      }
    } catch (error) {
      console.error('OCR analysis error:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      setToast({
        show: true,
        message: 'Failed to analyze driver\'s license. Please fill the form manually.',
        type: 'error'
      })
    } finally {
      console.log('Setting analyzing to false')
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate file is selected if upload option is chosen
    if (requestDocument && uploadOption === 'upload' && !selectedFile) {
      setToast({
        show: true,
        message: 'Please select a driver\'s license file to upload',
        type: 'error'
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const customerId = data.customer.id

        // If document is requested, handle based on upload option
        if (requestDocument) {
          try {
            // If uploading directly, upload the file first
            if (uploadOption === 'upload' && selectedFile) {
              setUploading(true)
              const formDataUpload = new FormData()
              formDataUpload.append('file', selectedFile)

              const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload
              })

              const uploadData = await uploadResponse.json()

              if (!uploadResponse.ok || !uploadData.success) {
                setToast({
                  show: true,
                  message: `Customer added but failed to upload document: ${uploadData.error || 'Unknown error'}`,
                  type: 'warning'
                })
                setTimeout(() => {
                  router.push(`${basePath}/customers/${customerId}`)
                }, 2000)
                return
              }

              // Create document record with uploaded file URL
              const docResponse = await fetch(`/api/customers/${customerId}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  documentType: 'drivers_license',
                  expiryDate: documentExpiry || null,
                  fileUrl: uploadData.url
                })
              })

              const docData = await docResponse.json()

              if (docResponse.ok && docData.success) {
                setToast({
                  show: true,
                  message: 'Customer added and driver\'s license uploaded successfully!',
                  type: 'success'
                })
                setTimeout(() => {
                  router.push(`${basePath}/customers/${customerId}`)
                }, 1500)
              } else {
                setToast({
                  show: true,
                  message: `Customer added but failed to save document record: ${docData.error || 'Unknown error'}`,
                  type: 'warning'
                })
                setTimeout(() => {
                  router.push(`${basePath}/customers/${customerId}`)
                }, 2000)
              }
            } else {
              // Generate upload link for customer to upload
              const docResponse = await fetch(`/api/customers/${customerId}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  documentType: 'drivers_license',
                  expiryDate: documentExpiry || null
                })
              })

              const docData = await docResponse.json()

              if (docResponse.ok && docData.success) {
                setUploadLink(docData.uploadLink)
                setShowLinkModal(true)
                setToast({
                  show: true,
                  message: 'Customer added and upload link generated!',
                  type: 'success'
                })
              } else {
                console.error('Document request error:', docData.error, 'Status:', docResponse.status)
                const errorMsg = docData.error || 'Failed to create document request'
                setToast({
                  show: true,
                  message: `Customer added but ${errorMsg}`,
                  type: 'warning'
                })
                setTimeout(() => {
                  router.push(`${basePath}/customers/${customerId}`)
                }, 2000)
              }
            }
          } catch (docError) {
            console.error('Error handling document:', docError)
            setToast({
              show: true,
              message: 'Customer added but network error occurred while handling document',
              type: 'warning'
            })
            setTimeout(() => {
              router.push(`${basePath}/customers/${customerId}`)
            }, 2000)
          } finally {
            setUploading(false)
          }
        } else {
          setToast({
            show: true,
            message: 'Customer added successfully!',
            type: 'success'
          })
          setTimeout(() => {
            router.push(`${basePath}/customers`)
          }, 1500)
        }
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to add customer',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error adding customer:', error)
      setToast({
        show: true,
        message: 'An error occurred while adding the customer',
        type: 'error'
      })
    } finally {
      setLoading(false)
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

  return (
    <>
      <HeaderComponent title="Add New Customer" subtitle="Register a new customer" />

        <main className='p-8'>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Main Form */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Info Banner */}
                {!requestDocument && (
                  <div className='bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4'>
                    <div className='flex items-start gap-3'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className='text-sm font-semibold text-blue-900 mb-1'>💡 Pro Tip: Upload Driver's License First!</p>
                        <p className='text-xs text-blue-700'>Upload the customer's driver's license below and we'll automatically extract their information using AI. This saves you time on manual data entry!</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Document Upload (Now First) */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Driver's License {analyzing && <span className='text-sm text-blue-600 font-normal ml-2'>(Analyzing...)</span>}
                  </h2>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl'>
                      <input
                        type='checkbox'
                        id='requestDocument'
                        checked={requestDocument}
                        onChange={(e) => setRequestDocument(e.target.checked)}
                        className='w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded'
                      />
                      <label htmlFor='requestDocument' className='text-sm font-semibold text-[#000000] cursor-pointer'>
                        Add driver's license information
                      </label>
                    </div>

                    {requestDocument && (
                      <div className='pl-4 space-y-4'>
                        {/* Upload Option Selection */}
                        <div className='space-y-3'>
                          <label className='block text-sm font-semibold text-[#000000]'>
                            How would you like to add the driver's license?
                          </label>
                          <div className='grid grid-cols-2 gap-3'>
                            <button
                              type='button'
                              onClick={() => setUploadOption('upload')}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                uploadOption === 'upload'
                                  ? 'border-primary bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className='flex flex-col items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${uploadOption === 'upload' ? 'text-primary' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className={`text-sm font-semibold ${uploadOption === 'upload' ? 'text-primary' : 'text-gray-300'}`}>
                                  Upload Now
                                </span>
                              </div>
                            </button>
                            <button
                              type='button'
                              onClick={() => setUploadOption('request')}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                uploadOption === 'request'
                                  ? 'border-primary bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className='flex flex-col items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${uploadOption === 'request' ? 'text-primary' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span className={`text-sm font-semibold ${uploadOption === 'request' ? 'text-primary' : 'text-gray-300'}`}>
                                  Send Link
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>

                        {uploadOption === 'upload' ? (
                          <div className='space-y-4'>
                            <div className='bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3'>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <div>
                                <p className='text-sm text-green-800 font-semibold mb-1'>AI-Powered Auto-Fill!</p>
                                <p className='text-xs text-green-700'>Upload the driver's license and we'll automatically extract information to fill the form below.</p>
                              </div>
                            </div>

                            <div>
                              <label className='block text-sm font-semibold text-[#000000] mb-2'>
                                Upload Driver's License *
                              </label>
                              <input
                                type='file'
                                accept='image/jpeg,image/png,image/jpg,application/pdf'
                                onChange={handleFileChange}
                                disabled={analyzing}
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed'
                              />
                              <p className='text-xs text-gray-500 mt-1'>JPG, PNG, or PDF. Max size 5MB</p>
                              {selectedFile && (
                                <div className='mt-2 flex items-center gap-2 text-sm text-green-600'>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{selectedFile.name} selected</span>
                                </div>
                              )}
                              {analyzing && (
                                <div className='mt-3 flex items-center gap-3 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg'>
                                  <div className='animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full'></div>
                                  <span>Analyzing driver's license with AI... This may take 3-5 seconds.</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-4'>
                            <p className='text-sm text-yellow-800'>
                              A secure upload link will be generated after creating the customer. You can share this link with the customer to upload their driver's license.
                            </p>
                          </div>
                        )}

                        <div>
                          <label className='block text-sm font-semibold text-[#000000] mb-2 flex items-center gap-2'>
                            License Expiry Date (Optional)
                            {autoFilledFields.includes('expiryDate') && (
                              <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>Auto-filled</span>
                            )}
                          </label>
                          <input
                            type='date'
                            value={documentExpiry}
                            onChange={(e) => setDocumentExpiry(e.target.value)}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] ${
                              autoFilledFields.includes('expiryDate') ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                    {autoFilledFields.length > 0 && (
                      <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-normal'>{autoFilledFields.length} field(s) auto-filled</span>
                    )}
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2 flex items-center gap-2'>
                        Full Name *
                        {autoFilledFields.includes('name') && (
                          <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>Auto-filled</span>
                        )}
                      </label>
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400 ${
                          autoFilledFields.includes('name') ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                        }`}
                        placeholder='e.g., Ahmed Hassan'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Email Address *
                        </label>
                        <input
                          type='email'
                          name='email'
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                          placeholder='customer@example.com'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2 flex items-center gap-2'>
                          Phone Number *
                          {autoFilledFields.includes('phone') && (
                            <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>Auto-filled</span>
                          )}
                        </label>
                        <input
                          type='tel'
                          name='phone'
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400 ${
                            autoFilledFields.includes('phone') ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                          }`}
                          placeholder='+212 6 00 00 00 00'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Status */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location & Status
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2 flex items-center gap-2'>
                        Location *
                        {autoFilledFields.includes('location') && (
                          <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>Auto-filled</span>
                        )}
                      </label>
                      <input
                        type='text'
                        name='location'
                        value={formData.location}
                        onChange={handleChange}
                        required
                        list='location-suggestions'
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400 ${
                          autoFilledFields.includes('location') ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                        }`}
                        placeholder='e.g., Casablanca, Morocco'
                      />
                      <datalist id='location-suggestions'>
                        {locationSuggestions.map((loc) => (
                          <option key={loc} value={loc} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Status *
                      </label>
                      <select
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6'>Customer Summary</h2>

                  <div className='space-y-4 mb-6'>
                    <div className='flex items-center justify-center mb-6'>
                      <div className='w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                        {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Full Name</span>
                      <span className='font-semibold text-[#000000] text-right'>
                        {formData.name || '-'}
                      </span>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Email</span>
                      <span className='font-semibold text-[#000000] text-right break-all'>
                        {formData.email || '-'}
                      </span>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Phone</span>
                      <span className='font-semibold text-[#000000]'>
                        {formData.phone || '-'}
                      </span>
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-300'>Location</span>
                        <span className='text-[#000000] text-right'>
                          {formData.location || '-'}
                        </span>
                      </div>

                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-300'>Status</span>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          formData.status === 'active'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {formData.status}
                        </span>
                      </div>
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='text-center'>
                        <p className='text-sm text-gray-500 mb-1'>New Customer</p>
                        <div className='flex justify-center gap-8'>
                          <div>
                            <p className='text-2xl font-bold text-[#000000]'>0</p>
                            <p className='text-xs text-gray-300'>Rentals</p>
                          </div>
                          <div>
                            <p className='text-2xl font-bold text-primary'>{formatCurrency(0)}</p>
                            <p className='text-xs text-gray-300'>Spent</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <button
                      type='submit'
                      disabled={loading || uploading}
                      className='w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    >
                      {loading || uploading ? (uploading ? 'Uploading Document...' : 'Adding Customer...') : 'Add Customer'}
                    </button>

                    <button
                      type='button'
                      onClick={() => router.push(`${basePath}/customers`)}
                      disabled={loading}
                      className='w-full px-6 py-4 bg-white border-2 border-gray-200 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      {/* Upload Link Modal */}
      {showLinkModal && uploadLink && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6'>
            <h3 className='text-xl font-bold text-[#000000] mb-4'>Upload Link Generated</h3>

            <div className='bg-gray-50 rounded-xl p-4 mb-4'>
              <p className='text-sm text-gray-600 mb-2'>Share this link with the customer:</p>
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

            <div className='flex gap-3'>
              <button
                onClick={() => router.push(`${basePath}/customers`)}
                className='flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark'
              >
                Go to Customers
              </button>
              <button
                onClick={() => setShowLinkModal(false)}
                className='px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </>
  )
}
