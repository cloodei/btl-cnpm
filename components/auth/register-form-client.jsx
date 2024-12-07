"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { revalidateUser } from "@/app/actions/user";
import PasswordInput from "@/components/password-input";

const fields = [
  { name: 'account', type: 'text', placeholder: 'Account Name' },
  { name: 'username', type: 'text', placeholder: 'Username' },
  { name: 'password', type: 'password', placeholder: 'Password' },
  { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' }
];

export default function RegisterFormClient() {
  const [formData, setFormData] = useState({ account: '', username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const { signUp } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();

  const validateForm = () => {
    let newErrors = {};
    const nameRegex = /^[\p{L}\p{N}_ ]{4,48}$/u;
    const accountError  = !(nameRegex.test(formData.account.trim().replace(/\s+/g, ' ')));
    const usernameError = !(nameRegex.test(formData.username.trim().replace(/\s+/g, ' ')));
    const passwordError = !(formData.password = formData.password.trim())
    const confirmPasswordError = !(formData.confirmPassword = formData.confirmPassword.trim())
    if(accountError) {
      newErrors.account = "Account name is invalid";
    }
    if(usernameError) {
      newErrors.username = "Username is invalid";
    }
    if(passwordError) {
      newErrors.password = "Password is required";
    }
    if(confirmPasswordError) {
      newErrors.confirmPassword = "Confirm password is required";
    }
    else if(formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setError((newErrors?.account || newErrors?.username || newErrors?.password || newErrors?.confirmPassword) ? "Please fill in all fields" : "");
    setErrors(newErrors)
    return Object.keys(newErrors).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if(validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const result = await signUp.create({ username: formData.account, password: formData.password });
      if(result.status !== "complete") {
        throw new Error("Failed to create account");
      }
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId: result.createdUserId, username: formData.username })
      });
      if(!response.ok) {
        throw new Error("Something went wrong");
      }
      const res = response.json();
      if(res.error) {
        throw new Error(res.error);
      }
      await revalidateUser();
      await setActive({ session: result.createdSessionId });
      router.push("/");
    }
    catch(error) {
      setError(error?.message || error || "An error occurred");
    }
    finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(error) {
      setError("");
    }
    if(errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <UserPlus className="h-12 w-12" />
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-gray-500">Join to start creating flashcards</p>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            {field.name === 'password' || field.name === 'confirmPassword' ? (
              <PasswordInput
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleInputChange}
                disabled={loading}
              />
            ) : (
              <Input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleInputChange}
                disabled={loading}
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded p-3">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
}