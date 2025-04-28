"use client";

import { useState, useEffect } from "react";
import { getUserData } from "@/lib/pocketbase";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  FileIcon,
  LayoutDashboardIcon,
  Users,
  ReceiptIcon,
  ShoppingBasketIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Point of Sale",
    url: "/pos",
    icon: ReceiptIcon,
  },
  {
    title: "Product",
    url: "/product",
    icon: ClipboardCheckIcon,
  },
  {
    title: "Order",
    url: "/order",
    icon: ShoppingBasketIcon,
  },
];

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex items-center justify-center w-full">
            <Image
              src="/Logo.png"
              width={150}
              height={150}
              alt="Logo of the system"
            ></Image>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-4">
            <SidebarMenu className="text-base">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title} className="py-2">
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-3">
                      {item.icon && <item.icon size={70} />}
                      <span className=" text-lg ">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
