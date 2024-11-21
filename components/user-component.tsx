'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardHeader } from "@/components/ui/card";

type UserData = {
  id: string;
  username: string;
  imageUrl: string;
  created_at: string;
};

export default function ProfileComponent({ userData }: { userData: UserData }) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
    <div className="grid gap-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Avatar className="h-28 w-28">
          <AvatarImage src={userData.imageUrl} alt={userData.username} />
          <AvatarFallback className="lg:text-3xl text-2xl font-medium bg-[#e3e6ec] dark:bg-gray-700">
            {userData.username.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1">{userData.username}</h1>
          <p className="text-sm text-muted-foreground">Flashcard Enthusiast</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Decks</h3>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
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
            <div className="text-2xl font-bold">89</div>
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
            <span>{new Date(userData.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-3 p-6 shadow-[0_4px_16px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.12)]">
        <div className="flex flex-wrap lg:gap-4 gap-3">
          <Button onClick={() => router.push('/create')} className="lg:px-[18px] px-[10px] lg:py-2 py-[4px] lg:text-base text-sm">
            Create New Deck
          </Button>
          <Button onClick={() => router.push('/my-decks')} className="lg:px-[18px] px-[10px] lg:py-2 py-[4px] lg:text-base text-sm">
            View {userData.username}'s Decks
          </Button>
          <Button variant="destructive" onClick={handleSignOut} className="lg:px-[18px] px-[10px] lg:py-2 py-[4px] lg:text-base text-sm">
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  </div>
  );
}