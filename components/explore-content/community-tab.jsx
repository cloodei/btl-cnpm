import { getCommunityDecksWithCardsCount } from '@/app/actions/deck';
import { auth } from '@clerk/nextjs/server';
import CommunityClient from './community-tab-client';

const TabException = ({ message, isCritical = false }) => {
  return (
    <div className={`text-center py-8 text-muted-foreground ${isCritical ? 'text-red-500 text-lg' : 'text-base'}`}>
      {message}
    </div>
  );
}

export default async function CommunityTab() {
  const { userId } = await auth();
  const { success, decks, error } = await getCommunityDecksWithCardsCount(userId);
  if(!success) {
    const err = error?.message || error || "Lỗi khi lấy data public";
    return <TabException message={err} isCritical />;
  }
  if(!decks?.length) {
    return <TabException message="Chưa có data public" />;
  }
  return <CommunityClient decks={decks} userId={userId} />;
}