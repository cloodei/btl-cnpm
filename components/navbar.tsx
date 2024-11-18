"use client";

import Link from "next/link";
import { Brain, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      <div className="h-12">
        <nav className="border-b border-gray-300 dark:border-gray-800 bg-background/[90] backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 top-0 z-30">
          <div className="container mx-auto lg:px-8 md:px-6 px-4 flex h-14 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span className="font-bold">CoinCard</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6 ml-6">
              <Link href="/explore">
                <Button
                  variant={isActiveLink("/explore") ? "default" : "ghost"}
                  className={`${isActiveLink("/explore") && "pointer-events-none"}`}
                >
                  Explore
                </Button>
              </Link>
              <Link href="/create">
                <Button
                  variant={isActiveLink("/create") ? "default" : "ghost"}
                  className={`${isActiveLink("/create") && "pointer-events-none"}`}
                >
                  Create
                </Button>
              </Link>
              <Link href="/my-decks">
                <Button 
                  variant={isActiveLink("/my-decks") ? "default" : "ghost"}
                  className={`${isActiveLink("/my-decks") && "pointer-events-none"}`}
                >
                  My Decks
                </Button>
              </Link>
            </div>

            <div className="flex items-center ml-auto space-x-4">
              <ModeToggle />
              <Link href="/login">
                <Button variant="default" className="hidden md:flex">Sign In</Button>
              </Link>
              <Button variant="ghost" className="md:hidden" onClick={toggleSidebar}>
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-8">
            <Brain className="h-6 w-6" />
            <span className="font-bold">FlashMaster</span>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/explore" onClick={toggleSidebar}>
              <Button 
                variant={isActiveLink("/explore") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                Explore
              </Button>
            </Link>
            <Link href="/create" onClick={toggleSidebar}>
              <Button 
                variant={isActiveLink("/create") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                Create
              </Button>
            </Link>
            <Link href="/my-decks" onClick={toggleSidebar}>
              <Button 
                variant={isActiveLink("/my-decks") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                My Decks
              </Button>
            </Link>
            <Button variant="default" className="w-full">Sign In</Button>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}