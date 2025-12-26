import BreadCrumbHeader from "@/components/BreadCrumbHeader";
import { AppSidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <div className="flex flex-col flex-1 h-screen">
          <header className="flex items-center justify-between px-4 py-4 h-[50px] container">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="flex md:hidden" />
              <BreadCrumbHeader />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserButton />
            </div>
          </header>

          <Separator />

          <div className="overflow-auto">
            <div className="flex-1 container px-4 py-4 text-accent-foreground">
              {children}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default layout;
