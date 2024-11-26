import { getRecentDecksWithCardsCount } from '@/app/actions/deck';
import { auth } from '@clerk/nextjs/server';
import RecentTabClient from './recent-tab-client';

function TabException(message, isCritical = false) {
  return (
    <div className={`text-center py-8 text-muted-foreground ${isCritical ? 'text-red-500 text-lg' : 'text-base'}`}>
      {message}
    </div>
  );
}

export default async function RecentTab() {
  const { userId } = await auth();
  const { success, decks } = await getRecentDecksWithCardsCount(userId);
  if(!success) {
    return TabException('Lỗi khi lấy data recent', true);
  }
  if(!decks?.length) {
    return TabException('Chưa có data recent');
  }
  return <RecentTabClient decks={decks} userId={userId} />;
}