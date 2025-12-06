import { VerifyOTPForm } from './VerifyOTPForm'

export const dynamic = 'force-dynamic'

interface VerifyOTPPageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function VerifyOTPPage({ searchParams }: VerifyOTPPageProps) {
  const params = await searchParams
  const email = params.email || ''

  if (!email) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <p className="text-text-secondary mb-4">No email provided</p>
          <a href="/login" className="text-pastel-blue hover:underline">
            Go back to login
          </a>
        </div>
      </div>
    )
  }

  return <VerifyOTPForm email={email} />
}
