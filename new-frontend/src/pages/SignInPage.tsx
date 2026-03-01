import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, LoginCredentials } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function SignInPage() {
  const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, isLoading } = useAuth()

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      setIsSubmitting(true)
      await login(formData)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof LoginCredentials]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-700 to-teal-900 p-12 flex-col justify-between relative overflow-hidden">
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
            Your agency's command center for SEO & ads
          </h2>
          <p className="text-teal-200 text-lg leading-relaxed max-w-md">
            Monitor websites, optimize campaigns, and impress clients with proactive insights -- all from one platform.
          </p>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-teal-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">HK</span>
            </div>
            <div>
              <p className="text-teal-100 text-sm italic">"The best investment we made for our agency's growth."</p>
              <p className="text-teal-300 text-xs mt-1">Herman Krabbendam, Vuurwerk Agency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-md w-full space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start lg:hidden mb-6">
              <div className="h-11 w-11 rounded-lg bg-teal-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Av</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-stone-500">
              Or{' '}
              <Link to="/signup" className="font-medium text-teal-700 hover:text-teal-600 transition-colors duration-200">
                create a new account
              </Link>
            </p>
          </div>

          <Card className="border-stone-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Welcome back</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-stone-700">Email address</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleInputChange} className={`${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-stone-300 focus:ring-teal-500'} transition-all duration-200`} placeholder="Enter your email" />
                  {errors.email && <Alert variant="destructive"><AlertDescription>{errors.email}</AlertDescription></Alert>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-stone-700">Password</Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={formData.password} onChange={handleInputChange} className={`pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-stone-300 focus:ring-teal-500'} transition-all duration-200`} placeholder="Enter your password" />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-stone-400" /> : <Eye className="h-4 w-4 text-stone-400" />}
                    </button>
                  </div>
                  {errors.password && <Alert variant="destructive"><AlertDescription>{errors.password}</AlertDescription></Alert>}
                </div>

                <div className="flex items-center justify-end">
                  <Link to="/forgot-password" className="text-sm font-medium text-teal-700 hover:text-teal-600 transition-colors duration-200">
                    Forgot your password?
                  </Link>
                </div>

                <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white transition-all duration-200" disabled={isSubmitting || isLoading}>
                  {isSubmitting || isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
