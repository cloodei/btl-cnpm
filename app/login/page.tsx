export const dynamic = "force-static";

export const metadata = {
  title: 'Registration | CoinCard'
};

import Link from "next/link";
import AuthContent from "./content";
import { Card } from "@/components/ui/card";
import { ArrowLeftFromLine } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden dark:bg-[#0a0b0f] bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f1f9ff] via-[#e6e6e6] to-[#f1f9ff] dark:from-[#000000] dark:via-gray-800 dark:to-[#000000] opacity-85" />
      <Card className="w-full mt-10 max-w-md mx-4 p-8 bg-white dark:bg-[#060708] backdrop-blur-sm shadow-2xl dark:shadow-none relative border-gray-300 dark:border-[#2a2a2a]">
        <Link href="/" className="absolute -top-7 left-0 text-[13px] text-gray-700 dark:text-[#e1e1e1] transition-colors hover:text-gray-950 dark:hover:text-white flex gap-1 items-center">
          <ArrowLeftFromLine className="h-[22px] w-[22px]" />
          Back
        </Link>
        <AuthContent />
      </Card>
    </div>
  );
}