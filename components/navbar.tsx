"use client";

import Link from "next/link";
import { Brain, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto lg:px-8 md:px-6 px-4 flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span className="font-bold">FlashMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 ml-6">
            <Link href="/explore">
              <Button variant="ghost">Explore</Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost">Create</Button>
            </Link>
            <Link href="/my-decks">
              <Button variant="ghost">My Decks</Button>
            </Link>
          </div>

          <div className="flex items-center ml-auto space-x-4">
            <ModeToggle />
            <Button variant="default" className="hidden md:flex">Sign In</Button>
            {/* Mobile Menu Button */}
            <Button variant="ghost" className="md:hidden" onClick={toggleSidebar}>
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
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
              <Button variant="ghost" className="w-full justify-start">Explore</Button>
            </Link>
            <Link href="/create" onClick={toggleSidebar}>
              <Button variant="ghost" className="w-full justify-start">Create</Button>
            </Link>
            <Link href="/my-decks" onClick={toggleSidebar}>
              <Button variant="ghost" className="w-full justify-start">My Decks</Button>
            </Link>
            <Button variant="default" className="w-full">Sign In</Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}