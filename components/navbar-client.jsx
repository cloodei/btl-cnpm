"use client";
import Link from "next/link";
import { Brain, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "./ui/sidebar";
import { useEffect } from "react";
import { useQuiz } from '@/contexts/QuizContext';
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { isQuizActive } = useQuiz();
  
  useEffect(() => {
    document.querySelector('.flex.min-h-svh.w-full')?.classList.add('hidden');
    router.prefetch('/explore');
    router.prefetch('/my-decks');
    router.prefetch('/favorites');
    router.prefetch('/profile');
  }, []);

  if(isQuizActive || pathname === '/login') {
    return null;
  }

  const NavLink = ({ href, children }) => (
    <Button
      variant={pathname === href ? "default" : "linkHover2"}
      className={`${pathname === href && "pointer-events-none "} transition-all duration-300 hover:scale-[1.12] active:scale-95`}
      onMouseEnter={() => router.prefetch(href)}
      onMouseDown={(e) => {
        e.preventDefault();
        router.push(href);
      }}
    >
      {children}
    </Button>
  )

  return (
  <div className="h-12">
    <nav className="border-b border-gray-300 dark:border-gray-800 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 top-0 z-30">
      <div className="container mx-auto lg:px-8 md:px-6 px-4 flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2" prefetch={true}>
          <Brain className="h-6 w-6" />
          <span className="font-bold">CoinCard</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 ml-6">
          <NavLink href="/explore">Explore</NavLink>
          <NavLink href="/create">Create</NavLink>
          <NavLink href="/my-decks">My Decks</NavLink>
          <NavLink href="/favorites">Favorites</NavLink>
        </div>

        <div className="flex items-center ml-auto space-x-4">
          <ModeToggle />
          <SignedOut>
            <Button
              onMouseEnter={() => router.prefetch('/login')}
              onMouseDown={(e) => {
                e.preventDefault();
                router.push('/login');
              }}
            >
              Sign In
            </Button>
          </SignedOut>
          <SignedIn>
            <div
              className="h-[30px] w-[30px] transition-all duration-200 cursor-pointer hover:opacity-80 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-full"
              onMouseEnter={() => router.prefetch('/profile')}
              onMouseDown={(e) => {
                e.preventDefault();
                router.push('/profile');
              }}
            >
              <User className="h-4 w-4" />
            </div>
          </SignedIn>
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setOpenMobile(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  </div>
  );
}