"use client";

import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  ShieldCheckIcon,
} from "lucide-react";
import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarHeader } from "./ui/sidebar";

const routes = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "/credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "/billing",
    label: "Billing",
    icon: CoinsIcon,
  },
];

export function AppSidebar() {
  const pathName = usePathname();
  const activeRoute =
    routes.find(
      (route) =>
        (route.href !== "/" && pathName.startsWith(route.href)) ||
        pathName === route.href
    ) || routes[0];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 space-y-2">
        <Logo />
        <div>TODO: Credits</div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <div className="flex flex-col gap-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`justify-start ${buttonVariants({
                variant: activeRoute.href === route.href ? "default" : "ghost",
                size: "sm",
              })}`}
            >
              <route.icon size={16} />
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
