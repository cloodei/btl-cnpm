'use client';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignIn } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()

  if(!isLoaded) {
    return null;
  }

  const validateForm = () => {
    formData.username = formData.username.trim()
    formData.password = formData.password.trim()
    const newErrors = {}
    const usernameError = (!(!formData.username) ? null : "Username is required")
    const passwordError = (!(!formData.password) ? null : "Password is required")
    if(usernameError) {
      newErrors.username = usernameError
      setError(usernameError)
    }
    if(passwordError) {
      newErrors.password = passwordError
      setError(passwordError)
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if(validateForm()) {
      return;
    }
    setLoading(true)
    try {
      const result = await signIn.create({ identifier: formData.username, password: formData.password })
      if (result.status !== 'complete') {
        throw new Error('Authentication failed')
      }
      await setActive({ session: result.createdSessionId })
      router.push('/')
    }
    catch(error) {
      setError(error.message ? error.message : (error ? error : 'An error has occurred'))
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <LogIn className="h-12 w-12" />
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-500">Sign in to your account</p>
      </div>
      <div className="space-y-4">
        {[
          { name: 'username', type: 'text', placeholder: 'Username' },
          { name: 'password', type: 'password', placeholder: 'Password' }
        ].map((field) => (
          <div key={field.name}>
            <Input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, [field.name]: e.target.value }))
                if(errors[field.name]) {
                  setErrors(prev => ({ ...prev, [field.name]: '' }))
                }
              }}
              disabled={loading}
              className={errors[field.name] ? 'border-red-500' : ''}
            />
            {errors[field.name] && (
              <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  )
}