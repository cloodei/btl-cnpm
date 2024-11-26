import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { getCachedUserInfoWithDecks } from "../actions/user";
import { Card } from "@/components/ui/card";
import { Calendar, Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

async function PageWrapper() {
  try {
    const { userId } = await auth();
    if(!userId) {
      throw new Error("User not found");
    }
    const result = await getCachedUserInfoWithDecks(userId);
    if(!result.success) {
      throw new Error("Error fetching user data");
    }
    const { user, decks } = result;
    return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="grid gap-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Avatar className="md:h-28 md:w-28 w-24 h-24">
            <AvatarImage src={user?.imageUrl} alt={user.username} />
            <AvatarFallback className="text-3xl font-medium bg-[#d6dae2] dark:bg-gray-700">
              {user.username.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
            <p className="text-sm text-muted-foreground">Flashcard Enthusiast</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Decks</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {decks.totaldecks}
                {decks.totaldecks === '1' ? (
                  <span className="ml-[5px]"> deck</span>
                ) : (
                  <span className="ml-[5px]"> decks</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Created flashcard decks
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Study Streak</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">
                Keep it going!
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Cards Mastered</h3>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {decks.totalcards}
                {decks.totalcards === '1' ? (
                  <span className="ml-[4px]"> card</span>
                ) : (
                  <span className="ml-[4px]"> cards</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all decks
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Account Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Joined </span>
              <span>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.22)] dark:shadow-[0px_0px_7px_rgba(255,255,255,0.1)]">
          <div className="flex flex-wrap lg:gap-4 gap-3">
            <Link href={'/create'} className="lg:px-[18px] px-[10px] pt-[8px] pb-[2px] lg:pt-2 lg:pb-2 lg:text-base text-primary text-sm bg-primary-foreground rounded-lg transition hover:bg-slate-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-800">
              Create New Deck
            </Link>
            <Link href={'/my-decks'} className="lg:px-[18px] px-[10px] pt-[8px] pb-[2px] lg:pt-2 lg:pb-2 lg:text-base text-primary text-sm bg-primary-foreground rounded-lg transition hover:bg-slate-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-800">
              View {user.username}'s Decks
            </Link>
            <LogoutButton variant="destructive" className="lg:px-[18px] px-[10px] py-[4px] lg:py-2 lg:text-base text-sm">
              Sign Out
            </LogoutButton>
          </div>
        </Card>
      </div>
    </div>
    )
  }
  catch(error) {
    return (
      <div className="m-auto p-10 text-center text-4xl font-medium">
        {error.message ? error.message : (error ? error : "An error occurred")}
      </div>
    );
  }
}

export default async function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="m-auto md:py-14 py-9 text-center md:text-4xl text-3xl font-medium flex justify-center items-center">
        Loading profile...
        <Loader className="ml-1 animate-spin md:h-12 md:w-12 h-7 w-7" />
      </div>
    }>
      <PageWrapper />
    </Suspense>
  );
}