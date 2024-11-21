"use client";

import React, { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { ArrowLeftFromLine } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from "@/components/auth/login-form-client";
import RegisterForm from "@/components/auth/register-form-client";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getTab = searchParams.get('tab') || 'login';

  const handleTabChange = (value) => {
    router.push(`/login?tab=${value}`, {
      scroll: false,
      shallow: true
    });
  };

  return (
    <Tabs className="w-full" onValueChange={handleTabChange} value={getTab}>
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-[#1a1a1a]">
        <TabsTrigger value="login" className="text-gray-600 dark:text-[#e1e1e1] data-[state=active]:bg-white dark:data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">
          Login
        </TabsTrigger>
        <TabsTrigger value="register" className="text-gray-600 dark:text-[#e1e1e1] data-[state=active]:bg-white dark:data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden dark:bg-[#0a0b0f] bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-gray-100 to-[#f8fafc] dark:from-[#000000] dark:via-gray-800 dark:to-[#000000] opacity-85" />

      <Card className="w-full max-w-md mx-4 p-8 bg-white dark:bg-[#060708] backdrop-blur-sm shadow-2xl dark:shadow-xl relative border-gray-300 dark:border-[#2a2a2a]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/" className="absolute -top-7 left-0 text-gray-600 dark:text-[#e1e1e1] hover:text-gray-900 dark:hover:text-white transition-colors flex text-[13px] gap-1 items-center">
                <ArrowLeftFromLine className="h-5 w-5" />
                Back
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-[#e1e1e1]">
              <p>Back to Homepage</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Suspense fallback={
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-pulse text-gray-400 dark:text-[#a1a1a1]">Loading...</div>
          </div>
        }>
          <AuthContent />
        </Suspense>
      </Card>
    </div>
  );
}