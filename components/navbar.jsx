"use client";

import Link from "next/link";
import { Brain, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import LogoutButton from "@/components/logout-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "./ui/sidebar";

export function NavbarComponent({ dbUser }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar()

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const isActiveLink = (path) => {
    return pathname === path;
  };

  const NavLink = ({ href, children }) => (
    <Link href={href}>
      <Button variant={isActiveLink(href) ? "default" : "ghost"}
        className={`${isActiveLink(href) && "pointer-events-none"} transition-all duration-300 hover:scale-105 active:scale-95`}>
        {children}
      </Button>
    </Link>
  );

  const UserAvatar = () => (
    <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
      <AvatarImage src={dbUser?.image || ''} alt={dbUser?.name || ""} />
      <AvatarFallback>
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );

  const DesktopNav = () => (
    <div className="hidden md:flex items-center space-x-6 ml-6">
      <NavLink href="/explore">Explore</NavLink>
      <NavLink href="/create">Create</NavLink>
      <SignedIn>
        <NavLink href="/my-decks">My Decks</NavLink>
      </SignedIn>
    </div>
  );

  return (
  <div className="h-12">
    <nav className="border-b border-gray-300 dark:border-gray-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 top-0 z-30">
      <div className="container mx-auto lg:px-8 md:px-6 px-4 flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span className="font-bold">CoinCard</span>
        </Link>

        <DesktopNav />

        <div className="flex items-center ml-auto space-x-4">
          <ModeToggle />
          <SignedOut>
            <Link href="/login" className="hidden md:block">
              <Button variant="default">Sign In</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/profile">
              <UserAvatar />
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