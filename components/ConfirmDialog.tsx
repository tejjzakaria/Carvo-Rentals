'use client'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const getTypeColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          bg: 'bg-red-100',
          button: 'bg-red-600 hover:bg-red-700'
        }
      case 'warning':
        return {
          icon: 'text-yellow-600',
          bg: 'bg-yellow-100',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        }
      case 'info':
        return {
          icon: 'text-blue-600',
          bg: 'bg-blue-100',
          button: 'bg-blue-600 hover:bg-blue-700'
        }
    }
  }

  const colors = getTypeColors()

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Dialog */}
      <div className='relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200'>
        {/* Icon */}
        <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className='text-xl font-bold text-[#000000] text-center mb-2'>
          {title}
        </h3>

        {/* Message */}
        <p className='text-gray-300 text-center mb-6'>
          {message}
        </p>

        {/* Actions */}
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 px-6 py-3 bg-gray-100 text-white font-semibold rounded-xl hover:bg-gray-200 transition-all'
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-6 py-3 ${colors.button} text-white font-semibold rounded-xl transition-all shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
