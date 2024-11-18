"use client";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { LogIn, UserPlus, ArrowLeftFromLine } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'login';

  const handleTabChange = (value) => {
    router.push(`/login?tab=${value}`, { scroll: false });
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full" onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#1a1a1a]">
        <TabsTrigger 
          value="login" 
          className="text-[#e1e1e1] data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white"
        >
          Login
        </TabsTrigger>
        <TabsTrigger 
          value="register" 
          className="text-[#e1e1e1] data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white"
        >
          Register
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="mt-0">
        <LoginForm />
      </TabsContent>
      
      <TabsContent value="register" className="mt-0">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0b0f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-gray-800 to-[#000000] opacity-85" />

      <Card className="w-full max-w-md mx-4 p-8 bg-[#060708] backdrop-blur-sm shadow-xl relative border-[#2a2a2a]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/" className="absolute -top-7 left-0 text-[#e1e1e1] hover:text-white transition-colors flex text-[13px] gap-1 items-center">
                <ArrowLeftFromLine className="h-5 w-5" />
                Back
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e1e1e1]">
              <p>Back to Homepage</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Suspense fallback={
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-pulse text-[#a1a1a1]">Loading...</div>
          </div>
        }>
          <AuthContent />
        </Suspense>
      </Card>
    </div>
  );
}

function LoginForm() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <LogIn className="h-12 w-12 text-white" />
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="text-[#a1a1a1]">Login to access your flashcards</p>
      </div>

      <div className="space-y-4">
        <Input 
          type="email" 
          placeholder="Email"
          className="bg-[#1a1a1a] border-[#242424] text-white placeholder:text-[#99a3b9]"
        />
        <Input 
          type="password" 
          placeholder="Password"
          className="bg-[#1a1a1a] border-[#242424] text-white placeholder:text-[#99a3b9]"
        />
      </div>

      <Button className="w-full bg-[#242424] hover:bg-[#3a3a3a] text-white">
        Sign In
      </Button>

      <div className="text-center">
        <Link 
          href="/forgot-password" 
          className="text-sm text-[#a1a1a1] hover:text-white transition-colors"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}

function RegisterForm() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <UserPlus className="h-12 w-12 text-white" />
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="text-[#a1a1a1]">Join to start creating flashcards</p>
      </div>

      <div className="space-y-4">
        {['Username', 'Email', 'Password', 'Confirm Password'].map((placeholder) => (
          <Input 
            key={placeholder}
            type={placeholder.toLowerCase().includes('password') ? 'password' : 'text'}
            placeholder={placeholder}
            className="bg-[#1a1a1a] border-[#242424] text-white placeholder:text-[#99a3b9]"
          />
        ))}
      </div>

      <Button className="w-full bg-[#242424] hover:bg-[#3a3a3a] text-white">
        Create Account
      </Button>
    </div>
  );
}