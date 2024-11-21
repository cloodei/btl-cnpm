"use client";
import React from "react";
import Link from "next/link";
import { Home, User, Brain, SquarePen, Telescope } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useSidebar } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";

export default function MobileSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const isActiveLink = (path) => pathname === path;

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/create", icon: SquarePen, label: "Create" },
    { href: "/explore", icon: Telescope, label: "Explore" }
  ]

  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetTitle>
          <div className="flex items-center space-x-[6px] md:hidden">
            <Brain className="h-6 w-6" />
            <span className="font-bold">CoinCard</span>
          </div>
        </SheetTitle>
        <nav className="mt-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center p-2 text-sm rounded-lg ${isActiveLink(link.href) ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-primary'}`}
                  onClick={() => setOpenMobile(false)
                }>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}