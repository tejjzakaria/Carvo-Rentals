/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState } from 'react'
import { HiX, HiExclamationCircle, HiCheckCircle } from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import { useSettings } from '@/contexts/SettingsContext'

interface Damage {
  id: string
  type: string
  location: string
  severity: 'minor' | 'moderate' | 'severe'
  description: string
  estimatedCost: number
  confidence: 'high' | 'medium' | 'low'
  photoIndex: number
  isNewDamage: boolean
}

interface DamageDetectionDialogProps {
  isOpen: boolean
  onClose: () => void
  rentalId: string
  vehicleId: string
  customerId: string
  basePath: string
}

export default function DamageDetectionDialog({
  isOpen,
  onClose,
  rentalId,
  vehicleId,
  customerId,
  basePath
}: DamageDetectionDialogProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [detecting, setDetecting] = useState(false)
  const [results, setResults] = useState<{
    damages: Damage[]
    totalEstimatedCost: number
    summary: string
    overallSeverity: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creatingReports, setCreatingReports] = useState(false)

  if (!isOpen) return null

  const handleDetect = async () => {
    setDetecting(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/ai/detect-damage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rentalId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to detect damage')
      }

      setResults({
        damages: data.damages,
        totalEstimatedCost: data.totalEstimatedCost,
        summary: data.summary,
        overallSeverity: data.overallSeverity
      })
    } catch (err: any) {
      setError(err.message || 'An error occurred during damage detection')
    } finally {
      setDetecting(false)
    }
  }

  const handleCreateReports = async () => {
    if (!results || results.damages.length === 0) return

    setCreatingReports(true)

    try {
      // Create damage reports for each detected damage
      const createdReports = []
      for (const damage of results.damages) {
        const reportData = {
          vehicleId,
          rentalId,
          damageType: damage.type,
          severity: damage.severity,
          location: damage.location,
          description: damage.description,
          estimatedCost: damage.estimatedCost,
          reportedDate: new Date().toISOString(),
          status: 'pending'
        }

        const response = await fetch('/api/damages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData)
        })

        if (response.ok) {
          const data = await response.json()
          createdReports.push(data.damage)
        }
      }

      // Navigate to damages page
      router.push(`${basePath}/damages`)
      onClose()
    } catch (err) {
      console.error('Failed to create damage reports:', err)
      setError('Failed to create damage reports')
    } finally {
      setCreatingReports(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'moderate':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10'>
          <div>
            <h2 className='text-2xl font-bold text-gray-300'>AI Damage Detection</h2>
            <p className='text-sm text-gray-500 mt-1'>Compare check-in and check-out photos</p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            disabled={detecting || creatingReports}
          >
            <HiX size={24} className='text-gray-500' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {!results && !error && (
            <div className='text-center py-12'>
              <div className='w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-300 mb-2'>Ready to Detect Damage</h3>
              <p className='text-gray-300 mb-8 max-w-md mx-auto'>
                Click the button below to analyze check-in and check-out photos using AI. The system will identify any new damage.
              </p>
              <button
                onClick={handleDetect}
                disabled={detecting}
                className='px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed'
              >
                {detecting ? (
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
                    Analyzing Photos...
                  </span>
                ) : (
                  'Start AI Detection'
                )}
              </button>
            </div>
          )}

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
              <HiExclamationCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-bold text-red-900 mb-2'>Detection Failed</h3>
              <p className='text-red-700'>{error}</p>
              <button
                onClick={() => {
                  setError(null)
                  handleDetect()
                }}
                className='mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all'
              >
                Try Again
              </button>
            </div>
          )}

          {results && (
            <div>
              {/* Summary */}
              <div className={`rounded-lg p-6 mb-6 ${results.damages.length > 0 ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                {results.damages.length > 0 ? (
                  <HiExclamationCircle className='h-8 w-8 text-orange-500 mb-3' />
                ) : (
                  <HiCheckCircle className='h-8 w-8 text-green-500 mb-3' />
                )}
                <h3 className='text-lg font-bold text-gray-300 mb-2'>Detection Complete</h3>
                <p className='text-gray-300 mb-4'>{results.summary}</p>
                {results.damages.length > 0 && (
                  <div className='flex items-center gap-4 text-sm'>
                    <span className='font-semibold'>Total Damages: {results.damages.length}</span>
                    <span className='font-semibold'>Estimated Cost: {formatCurrency(results.totalEstimatedCost)}</span>
                    <span className={`px-3 py-1 rounded-full border font-semibold ${getSeverityColor(results.overallSeverity)}`}>
                      {results.overallSeverity.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Damage List */}
              {results.damages.length > 0 && (
                <div className='space-y-4 mb-6'>
                  <h3 className='text-lg font-bold text-gray-300'>Detected Damages:</h3>
                  {results.damages.map((damage, index) => (
                    <div key={damage.id} className='border border-gray-200 rounded-lg p-4'>
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                          <span className='text-2xl font-bold text-gray-400'>#{index + 1}</span>
                          <div>
                            <h4 className='font-bold text-gray-300'>{damage.type.replace('_', ' ').toUpperCase()}</h4>
                            <p className='text-sm text-gray-300'>{damage.location}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(damage.severity)}`}>
                          {damage.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className='text-gray-300 mb-3'>{damage.description}</p>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-300'>Estimated Cost: <span className='font-bold text-gray-300'>{formatCurrency(damage.estimatedCost)}</span></span>
                        <span className='text-gray-300'>Confidence: <span className='font-bold text-gray-300'>{damage.confidence.toUpperCase()}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
                <button
                  onClick={onClose}
                  className='px-6 py-2.5 border border-gray-300 text-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
                  disabled={creatingReports}
                >
                  Close
                </button>
                {results.damages.length > 0 && (
                  <button
                    onClick={handleCreateReports}
                    disabled={creatingReports}
                    className='px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed'
                  >
                    {creatingReports ? 'Creating Reports...' : 'Create Damage Reports'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
