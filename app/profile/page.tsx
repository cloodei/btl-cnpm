import Link from 'next/link';
import Profile from './profile';
import LogoutButton from '@/components/logout-button';
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata = {
  title: "Profile | CoinCard"
};

const ProfileSkeleton = () => (
  <>
    <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
      <div className="md:h-32 md:w-32 w-24 h-24 rounded-full bg-gray-300 dark:bg-[#2a2d31]" />
      <div className="h-8 w-52 bg-gray-300 dark:bg-[#2a2d31] rounded" />
    </div>

    <div className="grid gap-5 md:grid-cols-3 animate-pulse">
      <Card className="text-center shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
        <CardHeader className="p-6">
          <div className="h-8 w-32 bg-gray-300 dark:bg-[#2a2d31] rounded mx-auto mb-2" />
          <div className="h-3 w-28 bg-gray-300 dark:bg-[#2a2d31] rounded mx-auto" />
        </CardHeader>
      </Card>
      <Card className="text-center shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
        <CardHeader className="p-6">
          <div className="h-8 w-32 bg-gray-300 dark:bg-[#2a2d31] rounded mx-auto mb-2" />
          <div className="h-3 w-28 bg-gray-300 dark:bg-[#2a2d31] rounded mx-auto" />
        </CardHeader>
      </Card>
      <Card className="text-center shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
        <CardHeader className="p-6">
          <div className="h-8 w-32 bg-gray-300 dark:bg-[#2a2d31] rounded mx-auto mb-2" />
          <div className="h-3 w-28 bg-gray-300 dark:bg-[#2a2d31] rounded mx-auto" />
        </CardHeader>
      </Card>
    </div>

    <Card className="shadow-[0_4px_8px_rgba(0,0,0,0.2)] animate-pulse">
      <CardHeader>
        <div className="h-6 w-48 bg-gray-300 dark:bg-[#2a2d31] rounded" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="h-5 w-44 bg-gray-300 dark:bg-[#2a2d31] rounded" />
        </div>
      </CardContent>
    </Card>

    <Card className="p-6 shadow-[0_4px_8px_rgba(0,0,0,0.2)] animate-pulse">
      <div className="flex flex-wrap lg:gap-4 gap-3">
        <div className="h-10 w-32 bg-gray-300 dark:bg-[#2a2d31] rounded" />
        <div className="h-10 w-32 bg-gray-300 dark:bg-[#2a2d31] rounded" />
        <div className="h-10 w-32 bg-gray-300 dark:bg-[#2a2d31] rounded" />
      </div>
    </Card>
  </>
);

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 grid gap-6">
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile />
      </Suspense>

      <Card className="p-6 shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
        <div className="flex flex-wrap lg:gap-4 gap-3">
          <Link href="/create" className="px-[18px] pt-2 pb-2 text-base text-primary bg-primary-foreground rounded-lg transition hover:bg-slate-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-800">
            Create New Deck
          </Link>
          <Link href="/my-decks" prefetch={true} className="px-[18px] pt-2 pb-2 text-base text-primary bg-primary-foreground rounded-lg transition hover:bg-slate-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-800">
            View your Decks
          </Link>
          <LogoutButton size="lg" className="text-base px-5 transition-all ease-out hover:gap-2" />
        </div>
      </Card>
    </div>
  );
}