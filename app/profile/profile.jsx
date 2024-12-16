import EditProfileModal from "@/components/edit-profile";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import { auth } from "@clerk/nextjs/server";
import { getCachedUserInfoWithDecks } from "../actions/user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const generateNameInitials = (name) => {
  let initials = (name[0]).toUpperCase();
  for(let i = 1; i < name.length; i++) {
    if(name[i] === ' ' && name[i + 1] !== ' ') {
      initials += (name[++i]).toUpperCase();
    }
  }
  return initials;
}

const ProfileException = ({ message }) => {
  return (
    <div className="m-auto pt-12 pb-8">
      <p className="text-center text-3xl sm:text-4xl font-medium text-red-500">
        {message}
      </p>
      <div className="flex items-center justify-center gap-3 mt-4 sm:mt-7">
        <Link href="/my-decks" prefetch={true}>
          <Button>Back to Decks</Button>
        </Link>
        <Link href="/" prefetch={true}>
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default async function Profile() {
  const { userId } = await auth();
  const { success, user, decks, countFav, error } = await getCachedUserInfoWithDecks(userId);
  if(!success) {
    const err = error?.message || error || "An error has occurred";
    return <ProfileException message={err} />;
  }
  
  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 grid gap-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Avatar className="md:h-32 md:w-32 w-24 h-24 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            <AvatarImage src={user.imageurl} alt={user.username} />
            <AvatarFallback className="text-3xl font-medium bg-[#d6dae2] dark:bg-gray-700">
              {generateNameInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <EditProfileModal currentUsername={user.username} currentImageUrl={user.imageurl} userId={userId} className="absolute md:-bottom-[10px] -bottom-[11px] md:-right-[10px] -right-[11px]" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">
            {user.username}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Flashcard Enthusiast</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="text-center shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
          <CardHeader className="text-center pb-0">
            <h3 className="text-sm font-medium">Total Decks</h3>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2 font-bold">
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

        <Card className="text-center shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
          <CardHeader className="text-center pb-0">
            <h3 className="text-sm font-medium">Decks Saved</h3>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2 font-bold">
              {countFav}
              {countFav === '1' ? (
                <span className="ml-[4px]"> deck</span>
              ) : (
                <span className="ml-[4px]"> decks</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {countFav > 0 ? "Keep it going!" : "There's always time to start!"}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
          <CardHeader className="text-center pb-0">
            <h3 className="text-sm font-medium">Total Cards</h3>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2 font-bold">
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

      <Card className="shadow-[0_4px_8px_rgba(0,0,0,0.2)] pl-2">
        <CardHeader className="pb-0">
          <h2 className="text-lg sm:text-xl font-semibold">Account Information</h2>
        </CardHeader>
        <CardContent className="mt-3 sm:mt-4">
          <div className="flex items-center space-x-[12px] text-xs sm:text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Joined </span>
            <span>{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

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