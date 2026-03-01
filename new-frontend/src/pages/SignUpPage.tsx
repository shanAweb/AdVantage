import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, SignupCredentials } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignupCredentials>({ email: '', password: '', firstName: '', lastName: '', company: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<SignupCredentials & { confirmPassword: string }>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signup, isLoading } = useAuth()

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupCredentials & { confirmPassword: string }> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    else if (formData.firstName.trim().length < 2) newErrors.firstName = 'First name must be at least 2 characters'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    else if (formData.lastName.trim().length < 2) newErrors.lastName = 'Last name must be at least 2 characters'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Password must contain uppercase, lowercase, and number'
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      setIsSubmitting(true)
      await signup(formData)
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof (SignupCredentials & { confirmPassword: string })]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }))
  }

  const passwordRequirements = [
    { text: 'At least 6 characters', met: formData.password.length >= 6 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'One number', met: /\d/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-teal-700 to-teal-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-16">
            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold text-lg">GA</span>
            </div>
            <span className="text-xl font-bold text-white">AdVantage</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Start growing your agency today
          </h2>
          <p className="text-teal-200 text-lg leading-relaxed max-w-md">
            Join 2,000+ agencies already using our platform to deliver exceptional results for their clients.
          </p>
        </div>
        <div className="relative z-10 space-y-4">
          {['Unlimited users on every plan', '14-day free trial, no card required', 'Cancel anytime'].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-teal-100">
              <CheckCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-md w-full space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start lg:hidden mb-6">
              <div className="h-11 w-11 rounded-lg bg-teal-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Av</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Create your account</h2>
            <p className="mt-2 text-sm text-stone-500">
              Or{' '}
              <Link to="/signin" className="font-medium text-teal-700 hover:text-teal-600 transition-colors duration-200">
                sign in to your existing account
              </Link>
            </p>
          </div>

          <Card className="border-stone-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Get started today</CardTitle>
              <CardDescription>Join thousands of agencies already using our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-stone-700">First name</Label>
                    <Input id="firstName" name="firstName" type="text" autoComplete="given-name" required value={formData.firstName} onChange={handleInputChange} className={`${errors.firstName ? 'border-red-400' : 'border-stone-300'} focus:ring-teal-500`} placeholder="John" />
                    {errors.firstName && <Alert variant="destructive"><AlertDescription>{errors.firstName}</AlertDescription></Alert>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-stone-700">Last name</Label>
                    <Input id="lastName" name="lastName" type="text" autoComplete="family-name" required value={formData.lastName} onChange={handleInputChange} className={`${errors.lastName ? 'border-red-400' : 'border-stone-300'} focus:ring-teal-500`} placeholder="Doe" />
                    {errors.lastName && <Alert variant="destructive"><AlertDescription>{errors.lastName}</AlertDescription></Alert>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-stone-700">Email address</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleInputChange} className={`${errors.email ? 'border-red-400' : 'border-stone-300'} focus:ring-teal-500`} placeholder="john@company.com" />
                  {errors.email && <Alert variant="destructive"><AlertDescription>{errors.email}</AlertDescription></Alert>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-stone-700">Company (optional)</Label>
                  <Input id="company" name="company" type="text" autoComplete="organization" value={formData.company} onChange={handleInputChange} className="border-stone-300 focus:ring-teal-500" placeholder="Your Company Inc." />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-stone-700">Password</Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.password} onChange={handleInputChange} className={`pr-10 ${errors.password ? 'border-red-400' : 'border-stone-300'} focus:ring-teal-500`} placeholder="Create a strong password" />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-stone-400" /> : <Eye className="h-4 w-4 text-stone-400" />}
                    </button>
                  </div>
                  {errors.password && <Alert variant="destructive"><AlertDescription>{errors.password}</AlertDescription></Alert>}
                  {formData.password && (
                    <div className="space-y-1 pt-1">
                      {passwordRequirements.map((req, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs">
                          <CheckCircle className={`h-3 w-3 ${req.met ? 'text-emerald-500' : 'text-stone-300'} transition-colors duration-200`} />
                          <span className={req.met ? 'text-emerald-600' : 'text-stone-400'}>{req.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-stone-700">Confirm password</Label>
                  <div className="relative">
                    <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" required value={confirmPassword} onChange={handleConfirmPasswordChange} className={`pr-10 ${errors.confirmPassword ? 'border-red-400' : 'border-stone-300'} focus:ring-teal-500`} placeholder="Confirm your password" />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-stone-400" /> : <Eye className="h-4 w-4 text-stone-400" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <Alert variant="destructive"><AlertDescription>{errors.confirmPassword}</AlertDescription></Alert>}
                </div>

                <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white transition-all duration-200 mt-2" disabled={isSubmitting || isLoading}>
                  {isSubmitting || isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>
                  ) : (
                    'Create account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-stone-400">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-teal-700 hover:text-teal-600">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-teal-700 hover:text-teal-600">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
