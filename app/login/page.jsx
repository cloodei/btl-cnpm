"use client";
export const dynamic = "force-static";

import Link from "next/link";
import LoginForm from "@/components/auth/login-form-client";
import RegisterForm from "@/components/auth/register-form-client";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftFromLine } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";

function AuthContent({ router }) {
  const tab = useSearchParams().get('tab') || 'login';

  const handleTabChange = (value) => {
    router.push(`/login?tab=${value}`, { scroll: false, shallow: true });
  };

  return (
    <Tabs className="w-full" onValueChange={handleTabChange} value={tab}>
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
  const router = useRouter();
  const { isSignedIn } = useAuth();

  if(isSignedIn) {
    router.push("/");
    return;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden dark:bg-[#0a0b0f] bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f1f9ff] via-[#e6e6e6] to-[#f1f9ff] dark:from-[#000000] dark:via-gray-800 dark:to-[#000000] opacity-85" />
      <Card className="w-full mt-10 max-w-md mx-4 p-8 bg-white dark:bg-[#060708] backdrop-blur-sm shadow-2xl dark:shadow-none relative border-gray-300 dark:border-[#2a2a2a]">
        <Link href="/" className="absolute -top-7 left-0 text-[13px] text-gray-700 dark:text-[#e1e1e1] transition-colors hover:text-gray-950 dark:hover:text-white flex gap-1 items-center">
          <ArrowLeftFromLine className="h-[22px] w-[22px]" />
          Back
        </Link>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthContent router={router} />
        </Suspense>
      </Card>
    </div>
  );
}