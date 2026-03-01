import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { forgotPassword, isLoading } = useAuth()

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Email is required'); return }
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return }
    try {
      setIsSubmitting(true)
      await forgotPassword({ email })
      setIsSubmitted(true)
    } catch (error) {
      console.error('Forgot password error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  const handleResend = () => {
    setIsSubmitted(false)
    setEmail('')
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in-up">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-stone-900">Check your email</h2>
            <p className="mt-2 text-sm text-stone-500">
              We've sent a password reset link to{' '}
              <span className="font-medium text-stone-900">{email}</span>
            </p>
          </div>

          <Card className="border-stone-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-medium text-stone-900">Next steps</h3>
                  <p className="mt-2 text-sm text-stone-500">
                    1. Check your email inbox (and spam folder)<br />
                    2. Click the reset link in the email<br />
                    3. Create a new password
                  </p>
                </div>
                <div className="space-y-3">
                  <Button onClick={handleResend} variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-100" disabled={isSubmitting || isLoading}>
                    {isSubmitting || isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>) : 'Resend email'}
                  </Button>
                  <Link to="/signin">
                    <Button variant="ghost" className="w-full text-stone-600 hover:text-stone-900">
                      <ArrowLeft className="mr-2 h-4 w-4" />Back to sign in
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-stone-400">
            Didn't receive the email? Check your spam folder or{' '}
            <button onClick={handleResend} className="text-teal-700 hover:text-teal-600 font-medium">try again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-11 w-11 rounded-lg bg-teal-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Av</span>
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-stone-900">Forgot your password?</h2>
          <p className="mt-2 text-sm text-stone-500">No worries, we'll send you reset instructions.</p>
        </div>

        <Card className="border-stone-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Reset your password</CardTitle>
            <CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-stone-700">Email address</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={handleEmailChange} className={`${error ? 'border-red-400' : 'border-stone-300'} focus:ring-teal-500`} placeholder="Enter your email address" />
                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              </div>
              <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white transition-all duration-200" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending reset link...</>) : 'Send reset link'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/signin" className="inline-flex items-center text-sm font-medium text-teal-700 hover:text-teal-600 transition-colors duration-200">
            <ArrowLeft className="mr-1 h-4 w-4" />Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
