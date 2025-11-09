/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState } from 'react'
import { HiX, HiUpload, HiCheckCircle } from 'react-icons/hi'

interface RentalPhotoUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (photos: File[]) => Promise<void>
  type: 'checkIn' | 'checkOut'
  rentalId: string
}

const photoLabels = {
  front: 'Front View',
  back: 'Back View',
  left: 'Left Side',
  right: 'Right Side'
}

export default function RentalPhotoUploadDialog({
  isOpen,
  onClose,
  onSubmit,
  type,
  rentalId
}: RentalPhotoUploadDialogProps) {
  const [photos, setPhotos] = useState<{
    front: File | null
    back: File | null
    left: File | null
    right: File | null
  }>({
    front: null,
    back: null,
    left: null,
    right: null
  })
  const [previews, setPreviews] = useState<{
    front: string | null
    back: string | null
    left: string | null
    right: string | null
  }>({
    front: null,
    back: null,
    left: null,
    right: null
  })
  const [uploading, setUploading] = useState(false)

  if (!isOpen) return null

  const handleFileChange = (position: 'front' | 'back' | 'left' | 'right', file: File) => {
    setPhotos(prev => ({ ...prev, [position]: file }))

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [position]: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = (position: 'front' | 'back' | 'left' | 'right') => {
    setPhotos(prev => ({ ...prev, [position]: null }))
    setPreviews(prev => ({ ...prev, [position]: null }))
  }

  const handleSubmit = async () => {
    const photoArray = [photos.front, photos.back, photos.left, photos.right].filter(
      (p): p is File => p !== null
    )

    if (photoArray.length !== 4) {
      alert('Please upload all 4 photos (front, back, left, right)')
      return
    }

    setUploading(true)
    try {
      await onSubmit(photoArray)
      onClose()
      // Reset state
      setPhotos({ front: null, back: null, left: null, right: null })
      setPreviews({ front: null, back: null, left: null, right: null })
    } catch (error) {
      console.error('Failed to upload photos:', error)
    } finally {
      setUploading(false)
    }
  }

  const allPhotosUploaded = photos.front && photos.back && photos.left && photos.right

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              {type === 'checkIn' ? 'Check-In Photos' : 'Check-Out Photos'}
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Upload photos from all 4 sides of the vehicle
            </p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            disabled={uploading}
          >
            <HiX size={24} className='text-gray-500' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {/* Photo Upload Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            {Object.entries(photoLabels).map(([position, label]) => (
              <div key={position} className='border-2 border-dashed border-gray-300 rounded-xl p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <label className='text-sm font-semibold text-gray-300'>{label}</label>
                  {photos[position as keyof typeof photos] && (
                    <HiCheckCircle className='text-green-500' size={20} />
                  )}
                </div>

                {previews[position as keyof typeof previews] ? (
                  <div className='relative'>
                    <img
                      src={previews[position as keyof typeof previews]!}
                      alt={label}
                      className='w-full h-48 object-cover rounded-lg'
                    />
                    <button
                      onClick={() => handleRemovePhoto(position as keyof typeof photos)}
                      className='absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                      disabled={uploading}
                    >
                      <HiX size={16} />
                    </button>
                  </div>
                ) : (
                  <label className='flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors'>
                    <HiUpload size={32} className='text-gray-400 mb-2' />
                    <span className='text-sm text-gray-500'>Click to upload</span>
                    <span className='text-xs text-gray-400 mt-1'>JPG, PNG (max 5MB)</span>
                    <input
                      type='file'
                      accept='image/jpeg,image/png'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert('File size must be less than 5MB')
                            return
                          }
                          handleFileChange(position as keyof typeof photos, file)
                        }
                      }}
                      className='hidden'
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <h3 className='text-sm font-semibold text-blue-900 mb-2'>Photo Guidelines:</h3>
            <ul className='text-sm text-blue-800 space-y-1'>
              <li>• Take clear photos in good lighting</li>
              <li>• Capture the entire vehicle in each shot</li>
              <li>• Ensure all damage/conditions are visible</li>
              <li>• Photos will be used for damage comparison</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-end gap-3'>
            <button
              onClick={onClose}
              className='px-6 py-2.5 border border-gray-300 text-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!allPhotosUploaded || uploading}
              className={`px-6 py-2.5 font-semibold rounded-lg transition-all ${
                allPhotosUploaded && !uploading
                  ? 'bg-primary hover:bg-primary-dark text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {uploading ? (
                <span className='flex items-center gap-2'>
                  <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                      fill='none'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Uploading...
                </span>
              ) : (
                `Upload & ${type === 'checkIn' ? 'Start Rental' : 'Complete Rental'}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
