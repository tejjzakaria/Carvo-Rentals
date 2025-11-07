'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Settings {
  companyName: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  website: string | null
  taxId: string | null
  language: string
  timezone: string
  currency: string
  dateFormat: string
  timeFormat: string
}

interface SettingsContextType {
  settings: Settings | null
  loading: boolean
  refreshSettings: () => Promise<void>
  formatCurrency: (amount: number) => string
  getCurrencySymbol: () => string
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const currencySymbols: { [key: string]: string } = {
  MAD: 'MAD',
  USD: '$',
  EUR: '€',
  GBP: '£'
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const refreshSettings = async () => {
    await fetchSettings()
  }

  const getCurrencySymbol = () => {
    if (!settings) return '$'
    return currencySymbols[settings.currency] || settings.currency
  }

  const formatCurrency = (amount: number) => {
    if (!settings) return `$${amount.toLocaleString()}`

    const symbol = getCurrencySymbol()
    const formattedAmount = amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })

    // For MAD, put symbol after the amount
    if (settings.currency === 'MAD') {
      return `${formattedAmount} ${symbol}`
    }

    // For other currencies, put symbol before
    return `${symbol}${formattedAmount}`
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings, formatCurrency, getCurrencySymbol }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
