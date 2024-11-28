"use client";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import { Brain, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useSidebar } from "./ui/sidebar";
import { useEffect } from "react";
import { useQuiz } from '@/contexts/QuizContext';

export default function Navbar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { isQuizActive } = useQuiz();
  useEffect(() => document.querySelector('.flex.min-h-svh.w-full')?.classList.add('hidden'), []);

  if(isQuizActive || pathname === '/login' || pathname === '/register') {
    return null;
  }

  const NavLink = ({ href, children }) => (
    <Link href={href}>
      <Button variant={pathname === href ? "default" : "link"}
        className= {`${pathname === href && "pointer-events-none"} transition-all duration-300 hover:scale-[1.09] active:scale-95`}>
        {children}
      </Button>
    </Link>
  );

  return (
  <div className="h-12">
    <nav className="border-b border-gray-300 dark:border-gray-800 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 top-0 z-30">
      <div className="container mx-auto lg:px-8 md:px-6 px-4 flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span className="font-bold">CoinCard</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 ml-6">
          <NavLink href="/explore">Explore</NavLink>
          <NavLink href="/create">Create</NavLink>
          <SignedIn>
            <NavLink href="/my-decks">My Decks</NavLink>
            <NavLink href="/favorites">Favorites</NavLink>
          </SignedIn>
        </div>
        <div className="flex items-center ml-auto space-x-4">
          <ModeToggle />
          <SignedOut>
            <Link href="/login" className="hidden md:block">
              <Button variant="default">Sign In</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/profile">
              <div className="h-8 w-8 transition-all duration-200 cursor-pointer hover:opacity-80 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-full">
                <User className="h-4 w-4" />
              </div>
            </Link>
            <LogoutButton className="hidden md:flex" />
          </SignedIn>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpenMobile(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  </div>
  );
}