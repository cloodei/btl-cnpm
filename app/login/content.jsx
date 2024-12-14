"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/login-form-client";
import RegisterForm from "@/components/auth/register-form-client";

export default function AuthContent() {
  const router = useRouter();
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