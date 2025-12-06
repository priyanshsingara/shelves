'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Button } from '@/components/ui'
import { ArrowLeft, Check } from 'lucide-react'

interface VerifyOTPFormProps {
  email: string
}

export function VerifyOTPForm({ email }: VerifyOTPFormProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!code.trim() || code.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code')
      }

      // Redirect to feed on success
      router.push('/feed')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error('Failed to resend code')
      }

      setCode('')
      // Show success message briefly
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push('/login')}
          className="mb-6 p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-beige-dark rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Verify your email</h1>
          <p className="text-text-secondary">
            We sent a 6-digit code to <span className="font-medium text-text-primary">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Verification code"
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
              setCode(value)
              setError('')
            }}
            error={error}
            autoFocus
            disabled={isLoading}
            className="text-center text-2xl tracking-widest font-mono"
            maxLength={6}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={code.length !== 6 || isLoading}
          >
            <Check className="w-4 h-4 mr-2" />
            Verify & Sign in
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-sm text-pastel-blue hover:text-pastel-blue/80 disabled:opacity-50"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    </div>
  )
}

