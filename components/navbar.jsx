"use client";

import Link from "next/link";
import { Brain, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import LogoutButton from "@/components/logout-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Navbar({ dbUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  if(pathname === '/login' || pathname === '/register') {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActiveLink = (path) => {
    return pathname === path;
  };

  const NavLink = ({ href, children }) => (
    <Link href={href}>
      <Button variant={isActiveLink(href) ? "default" : "ghost"} className={`${isActiveLink(href) && "pointer-events-none"}`}>
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

  const MobileSidebar = () => (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-8">
            <Brain className="h-6 w-6" />
            <span className="font-bold">CoinCard</span>
          </div>
          <div className="flex flex-col space-y-4">
            <NavLink href="/explore">Explore</NavLink>
            <NavLink href="/create">Create</NavLink>
            <SignedIn>
              <NavLink href="/my-decks">My Decks</NavLink>
              <NavLink href="/profile">Profile</NavLink>
            </SignedIn>
            <SignedOut>
              <Link href="/login">
                <Button variant="default" className="w-full justify-start">Sign In</Button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleSidebar} />
      )}
    </>
  );

  return (
    <>
      <div className="h-12">
        <nav className="border-b border-gray-300 dark:border-gray-800 bg-background/[90] backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 top-0 z-30">
          <div className="container mx-auto lg:px-8 md:px-6 px-4 flex h-14 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span className="font-bold">CoinCard</span>
            </Link>

            <DesktopNav />

            <div className="flex items-center ml-auto space-x-4">
              <ModeToggle />
              <SignedOut>
                <Link href="/login">
                  <Button variant="default">Sign In</Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <Link href="/profile" className={`${isActiveLink("/profile") && "pointer-events-none"}`}>
                  <UserAvatar />
                </Link>
                <LogoutButton />
              </SignedIn>

              <Button variant="ghost" className="md:hidden" onClick={toggleSidebar}>
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <MobileSidebar />
    </>
  );
}