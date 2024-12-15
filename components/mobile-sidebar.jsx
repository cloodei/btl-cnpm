"use client";
import React from "react";
import Link from "next/link";
import { Home, User, Brain, SquarePen, Telescope, Layers, Bookmark } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useSidebar } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/create", icon: SquarePen, label: "Create" },
    { href: "/explore", icon: Telescope, label: "Explore" },
    { href: "/my-decks", icon: Layers, label: "My Decks" },
    { href: "/favorites", icon: Bookmark, label: "Favorites" }
  ]

export default function MobileSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  if(pathname === '/login' || pathname === '/register') {
    return null;
  }

  const isActiveLink = (path) => pathname === path;

  return (
    <Sheet open={openMobile} onOpenChange={(open) => setOpenMobile(open)}>
      <SheetContent side="left" className="w-[240px]">
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
                  prefetch={true}
                  className={`
                    flex items-center p-2 gap-2 text-sm rounded-lg
                    ${isActiveLink(link.href) ? ' bg-primary text-primary-foreground' : ' hover:bg-accent hover:text-primary'}
                  `}
                  onClick={() => setOpenMobile(false)
                }>
                  <link.icon className="h-4 w-4" />
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