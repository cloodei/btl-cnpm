"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

export default function RegisterFormClient() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useSignUp();
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const { setActive } = useClerk();

  const validateForm = () => {
    formData.username = formData.username.trim()
    formData.password = formData.password.trim()
    formData.confirmPassword = formData.confirmPassword.trim()
    const newErrors = {}
    const usernameError = (!(!formData.username) ? null : "Username is required")
    const passwordError = (!(!formData.password) ? null : "Password is required")
    const confirmPasswordError = (!(!formData.confirmPassword) ? null : "Confirm Password is required")
    if(usernameError)
      newErrors.username = usernameError
    if(passwordError)
      newErrors.password = passwordError
    if(confirmPasswordError && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = confirmPasswordError

    setError(usernameError || passwordError || confirmPasswordError)
    setErrors(newErrors)
    return Object.keys(newErrors).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if(validateForm())
      return
    try {
      const result = await signUp.create({ username: formData.username, password: formData.password });
      if(result.status !== "complete") {
        throw new Error("Failed to create account");
      }
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId: result.createdUserId, username: formData.username })
      });
      if(!response.ok) {
        throw new Error(response.json().error || "Something went wrong");
      }
      const res = response.json();
      if(res.error) {
        throw new Error(res.error);
      }
      await setActive({ session: result.createdSessionId });
      router.push("/");
    }
    catch(err) {
      setError(err.message || "Something went wrong");
    }
    finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(error)
      setError("");
    if(errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <UserPlus className="h-12 w-12" />
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-gray-500">Join to start creating flashcards</p>
      </div>

      <div className="space-y-4">
        {[
          { name: "username", type: "text", placeholder: "Username" },
          { name: "password", type: "password", placeholder: "Password" },
          { name: "confirmPassword", type: "password", placeholder: "Confirm Password" }
        ].map((field) => (
          <div key={field.name}>
            <Input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleInputChange}
              disabled={loading}
            />
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

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
}