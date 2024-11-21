import { auth } from '@clerk/nextjs/server';
import { NavbarComponent } from './navbar';
import { getCachedUser } from '@/app/actions/user';

export default async function Navbar() {
  const { userId } = await auth();
  const user = await getCachedUser(userId);

  return <NavbarComponent dbUser={user} />;
}