"use client";

import * as React from "react";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  FolderPlusIcon,
  IndianRupee,
  LayoutDashboardIcon,
  FolderIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CrmNavUser } from "@/components/crm-nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function CrmSidebar({
  user,
}: {
  user: { name: string; email: string };
}) {
  const pathname = usePathname();

  const items = [
    { title: "Dashboard", href: "/crm", icon: LayoutDashboardIcon },
    { title: "Tasks & schedule", href: "/crm/tasks", icon: CalendarDaysIcon },
    { title: "Finance", href: "/crm/finance", icon: IndianRupee },
    { title: "Job tracker", href: "/crm/jobs", icon: BriefcaseIcon },
    { title: "Create project", href: "/crm/projects/new", icon: FolderPlusIcon },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FolderIcon className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">CRM</span>
            <span className="truncate text-xs text-muted-foreground">
              Admin control center
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/crm"
                        ? pathname === "/crm"
                        : pathname === item.href ||
                          pathname.startsWith(item.href + "/")
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <CrmNavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
