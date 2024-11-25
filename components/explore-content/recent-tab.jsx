import { Suspense } from 'react';
import { getRecentDecksWithCardsCount } from '@/app/actions/deck';
import { auth } from '@clerk/nextjs/server';
import { FancySpinner } from '@/components/ui/fancy-spinner';
import RecentTabClient from './recent-tab-client';

async function TabWrapper() {
  try {
    const { userId } = await auth();
    if(!userId) {
      throw new Error("User not found!");
    }
    const result = await getRecentDecksWithCardsCount(userId);
    if(!result.success) {
      throw new Error("Failed to fetch recent decks");
    }
    const { decks } = result;
    if(!decks.length) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có data Recent
        </div>
      );
    }
    return (
      <RecentTabClient decks={decks} userId={userId} />
    )
  }
  catch(error) {
    return (
      <div className="m-auto py-14 pb-8 text-center text-4xl font-medium text-red-500">
        {error.message ? error.message : (error ? error : "An error occurred")}
      </div>
    );
  }
}

export default function RecentTab() {
  return (
    <Suspense fallback={(
      <div className="m-auto lg:pt-20 md:pt-16 pt-12 pb-8 text-center lg:text-4xl text-3xl font-medium">
        <FancySpinner text="Loading recent decks..." size={26} />
      </div>
    )}>
      <TabWrapper />
    </Suspense>
  );
}