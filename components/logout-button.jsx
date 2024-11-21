'use client';

import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function LogoutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  }

  return (
    <Button onClick={handleSignOut} variant="outline" className="border-gray-400 dark:border-gray-700">
      Log out
    </Button>
  )
}