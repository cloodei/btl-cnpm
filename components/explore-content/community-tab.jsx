import { getRecentDecksWithCardsCount } from '@/app/actions/deck';
import { auth } from '@clerk/nextjs/server';
import CommunityClient from './community-tab-client';

function TabException(message, isCritical = false) {
  return (
    <div className={`text-center py-8 text-muted-foreground ${isCritical ? 'text-red-500 text-lg' : 'text-base'}`}>
      {message}
    </div>
  );
}

export default async function CommunityTab() {
  const { userId } = await auth();
  const { success, decks } = await getRecentDecksWithCardsCount(userId);
  if(!success) {
    return TabException('Lỗi khi lấy data community', true);
  }
  if(!decks?.length) {
    return TabException('Chưa có data community');
  }
  return <CommunityClient decks={decks} userId={userId} />;
}