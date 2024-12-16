"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import { revalidateUser } from "@/app/actions/user";

export default function LoginFormClient() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [finalError, setFinalError] = useState("");
  const { signIn, setActive } = useSignIn()
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(finalError) {
      setFinalError("");
    }
    if(errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
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
    setFinalError((newErrors?.username || newErrors?.password) ? "Please fill in all fields" : "");
    return (Object.keys(newErrors)).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFinalError("");
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
      await revalidateUser()
      await setActive({ session: result.createdSessionId })
      router.prefetch('/my-decks')
      router.prefetch('/explore')
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
      <div className="flex flex-col items-center sm:gap-2 gap-[5px]">
        <LogIn className="sm:h-12 h-10 sm:w-12 w-10" />
        <h1 className="sm:text-3xl text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground max-sm:text-[13px]">Login to access your flashcards</p>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          name="username"
          placeholder="Account Name"
          value={formData.username}
          onChange={handleChange}
          className={`${errors.username ? "border-rose-300/90 dark:border-rose-950 " : ""} max-sm:text-sm h-[38px] sm:h-10 max-sm:placeholder:text-sm`}
        />
        {errors?.username ? (
          <p className="text-red-500 dark:text-red-500/90 text-sm pl-2" style={{ marginTop: "3px" }}>
            {errors.username}
          </p>
        ) : null}
        
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className={`${errors.password ? "border-rose-300/90 dark:border-rose-950 " : ""} max-sm:text-sm h-[38px] sm:h-10 max-sm:placeholder:text-sm`}
        />
        {errors?.password ? (
          <p className="text-red-500 dark:text-red-500/90 text-sm pl-2" style={{ marginTop: "3px" }}>
            {errors.password}
          </p>
        ) : null}
      </div>

      {finalError && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md px-5 py-[10px]">
          <p className="text-red-600 dark:text-red-400 text-sm">{finalError}</p>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Logging in..." : "Sign in"}
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