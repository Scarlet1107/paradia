"use client";
import Link from "next/link";
import React from "react";
import {
  Home as HomeIcon,
  Info,
  Megaphone,
  Crown,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MobileNavigation } from "../MobileNavigation";
import Image from "next/image";
import { NotificationPopover } from "../NotificationPopover";

const navItems = [
  { href: "/protected/home", icon: HomeIcon, label: "ホーム" },
  { href: "/protected/announcements", icon: Megaphone, label: "お知らせ" },
  { href: "/protected/ranking", icon: Crown, label: "ランキング" },
  { href: "/protected/tutorials", icon: Info, label: "市民ガイド" },
  { href: "/protected/settings", icon: Settings, label: "設定" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex w-full items-center justify-between bg-gray-50 p-4 shadow-sm md:px-16">
      <Link href="/protected/home">
        <Image
          src="/header.png"
          alt="PARADIA"
          height={40}
          width={190}
          className="mb-2"
        />
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 md:hidden">
          <MobileNavigation navItems={navItems} />
          <NotificationPopover />
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <nav className="flex gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center rounded-md px-3 py-2 text-lg font-medium text-stone-700",
                    "before:absolute before:bottom-0 before:left-0 before:h-[2px] before:transition-all before:duration-300 before:ease-in-out",
                    isActive
                      ? "text-orange-600 before:w-full before:bg-orange-500"
                      : "before:w-0 before:bg-orange-500 hover:text-orange-600 hover:before:w-full",
                  )}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <NotificationPopover />
        </div>
      </div>
    </header>
  );
};

export default Header;
