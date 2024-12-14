import Link from "next/link";
import Profile from './profile';
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { getCachedUserInfoWithDecks } from "../actions/user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Profile | CoinCard"
};

const ProfileException = ({ message }) => {
  return (
    <div className="m-auto pt-12 pb-8">
      <p className="text-center text-4xl font-medium text-red-500">
        {message}
      </p>
      <div className="flex items-center justify-center gap-3 mt-7">
        <Link href="/my-decks">
          <Button>Back to Decks</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}

const ProfileSkeleton = () => (
  <div className="container mx-auto max-w-6xl py-8 px-4 grid gap-6 animate-pulse">
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="md:h-32 md:w-32 w-24 h-24 rounded-full bg-gray-300 dark:bg-[#2a2d31]" />
      <div className="h-8 w-52 bg-gray-300 dark:bg-[#2a2d31] rounded" />
    </div>

    <div className="grid gap-5 md:grid-cols-3">
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

    <Card className="shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
      <CardHeader>
        <div className="h-6 w-48 bg-gray-300 dark:bg-[#2a2d31] rounded" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="h-5 w-44 bg-gray-300 dark:bg-[#2a2d31] rounded" />
        </div>
      </CardContent>
    </Card>

    <Card className="p-6 shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
      <div className="flex flex-wrap lg:gap-4 gap-3">
        <div className="h-10 w-32 bg-gray-300 dark:bg-[#2a2d31] rounded" />
        <div className="h-10 w-32 bg-gray-300 dark:bg-[#2a2d31] rounded" />
        <div className="h-10 w-32 bg-gray-300 dark:bg-[#2a2d31] rounded" />
      </div>
    </Card>
  </div>
);

const PageWrapper = async () => {
  const { userId } = await auth();
  if(!userId) {
    return <ProfileException message="Please sign in to view your profile" />;
  }
  const { success, user, decks, countFav, error } = await getCachedUserInfoWithDecks(userId);
  if(!success) {
    const err = error?.message || error || "An error has occurred";
    return <ProfileException message={err} />;
  }
  
  return (
    <Profile user={user} decks={decks} countFav={countFav} userId={userId} />
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <PageWrapper />
    </Suspense>
  );
}