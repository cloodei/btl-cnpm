'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';

interface RegisterFormProps {
  createUser: (userId: string | null, username: string) => Promise<{ success: boolean; error?: string; }>;
}

export function RegisterForm({ createUser }: RegisterFormProps) {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isLoaded, signUp } = useSignUp()
  const router = useRouter()
  const { setActive } = useClerk()

  if(!isLoaded)
    return null

  const validateForm = () => {
    formData.username = formData.username.trim()
    formData.password = formData.password.trim()
    formData.confirmPassword = formData.confirmPassword.trim()
    const newErrors = {} as Record<string, string>
    const usernameError = (!(!formData.username) ? null : "Username is required")
    const passwordError = (!(!formData.password) ? null : "Password is required")
    const confirmPasswordError = (!(!formData.confirmPassword) ? null : "Confirm Password is required")
    if(usernameError) {
      newErrors.username = usernameError
      setError(usernameError)
    }
    if(passwordError) {
      newErrors.password = passwordError
      setError(passwordError)
    }
    if(confirmPasswordError && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = confirmPasswordError
      setError(confirmPasswordError)
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if(!validateForm())
      return

    try {
      const result = await signUp.create({ username: formData.username, password: formData.password })
      if(result.status !== "complete") {
        throw new Error("Failed to create account")
      }
      const dbResult = await createUser(result.createdUserId, formData.username)
      if (!dbResult.success) {
        throw new Error(dbResult.error || "Failed to create user")
      }
      if(setActive) {
        await setActive({ session: result.createdSessionId })
      }
      router.push('/')
    }
    catch(err: any) {
      setError(err.message || "Something went wrong")
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <UserPlus className="h-12 w-12" />
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-gray-500">Join to start creating flashcards</p>
      </div>

      <div className="space-y-4">
        {[
          { name: 'username', type: 'text', placeholder: 'Username' },
          { name: 'password', type: 'password', placeholder: 'Password' },
          { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' }
        ].map((field) => (
          <div key={field.name}>
            <Input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name as keyof typeof formData]}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, [field.name]: e.target.value }))
                if (errors[field.name]) {
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

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </form>
  )
}
// components/auth/register-form.tsx
// 'use client'

// import { useFormState, useFormStatus } from 'react-dom'
// import { register } from '@/app/actions/auth'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { UserPlus } from 'lucide-react'

// function SubmitButton() {
//   const { pending } = useFormStatus()
  
//   return (
//     <Button 
//       type="submit" 
//       disabled={pending}
//       className="w-full"
//     >
//       {pending ? 'Creating Account...' : 'Sign Up'}
//     </Button>
//   )
// }

// export function RegisterForm() {
//   const initialState = { message: null, errors: {} }
//   const [state, formAction] = useFormState(register, initialState)

//   return (
//     <form action={formAction} className="space-y-6">
//       <div className="flex flex-col items-center space-y-2">
//         <UserPlus className="h-12 w-12" />
//         <h1 className="text-3xl font-bold">Create Account</h1>
//         <p className="text-gray-500">Join to start creating flashcards</p>
//       </div>

//       <div className="space-y-4">
//         {[
//           { name: 'username', type: 'text', placeholder: 'Username' },
//           { name: 'password', type: 'password', placeholder: 'Password' },
//           { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' }
//         ].map((field) => (
//           <div key={field.name}>
//             <Input
//               type={field.type}
//               name={field.name}
//               placeholder={field.placeholder}
//               className={state.errors?.[field.name] ? 'border-red-500' : ''}
//               aria-describedby={
//                 state.errors?.[field.name] ? `${field.name}-error` : undefined
//               }
//             />
//             {state.errors?.[field.name] && (
//               <p 
//                 className="text-sm text-red-500 mt-1"
//                 id={`${field.name}-error`}
//               >
//                 {state.errors[field.name]?.[0]}
//               </p>
//             )}
//           </div>
//         ))}
//       </div>

//       {state.errors?._form && (
//         <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded p-3">
//           <p className="text-sm text-red-600 dark:text-red-400">
//             {state.errors._form[0]}
//           </p>
//         </div>
//       )}

//       {state.message && (
//         <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded p-3">
//           <p className="text-sm text-green-600 dark:text-green-400">
//             {state.message}
//           </p>
//         </div>
//       )}

//       <SubmitButton />
//     </form>
//   )
// } 