"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import { revalidateUser } from "@/app/actions/user";
import PasswordInput from "../password-input";

export default function LoginFormClient() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [finalError, setFinalError] = useState('');
  const { signIn, setActive } = useSignIn()
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    const usernameError = !(formData.username = formData.username.trim());
    const passwordError = !(formData.password = formData.password.trim());
    if(usernameError) {
      newErrors.username = "Username is required";
    }
    if(passwordError) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return (Object.keys(newErrors)).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFinalError('');
    if(validateForm()) {
      return;
    }
    setLoading(true);
    const { username, password } = formData;
    try {
      const result = await signIn.create({ identifier: username, password })
      if(result.status !== 'complete') {
        throw new Error('Login failed')
      }
      await revalidateUser();
      await setActive({ session: result.createdSessionId })
      router.push('/')
    }
    catch(err) {
      setFinalError(err?.message || err || 'An error occurred');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <LogIn className="h-12 w-12 text-gray-900 dark:text-white" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
        <p className="text-gray-500 dark:text-[#a1a1a1]">Login to access your flashcards</p>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            type="text"
            name="username"
            placeholder="Account Name"
            value={formData.username}
            onChange={handleChange}
            className={`bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#242424] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#99a3b9] ${errors.username ? 'border-red-500' : ''
              }`}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={`bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#242424] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#99a3b9] ${errors.password ? 'border-red-500' : ''
              }`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
      </div>

      {finalError && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md p-3">
          <p className="text-red-600 dark:text-red-400 text-sm">{finalError}</p>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Loading..." : "Sign in"}
      </Button>

      <div className="text-center">
        <Link
          href={loading ? "#" : "/login?tab=register"}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-[#a1a1a1] dark:hover:text-white transition-colors"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  );
}