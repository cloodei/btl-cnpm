import { getCommunityDecksWithCardsCount } from '@/app/actions/deck';
import { auth } from '@clerk/nextjs/server';
import CommunityClient from './community-tab-client';

const TabException = ({ message = "Lỗi khi lấy data community", isCritical = false }) => {
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
    return <TabException message={error?.message || error} isCritical />;
  }
  if(!decks?.length) {
    return <TabException message="Chưa có data community" />;
  }
  return <CommunityClient decks={decks} userId={userId} />;
}