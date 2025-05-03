'use client';

import {
  BarChart3,
  Bug,
  CalendarClock,
  HelpCircle,
  Home,
  LayoutGrid,
  Link2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const createItems = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: Home,
    badge: undefined,
  },
  {
    title: 'Generate',
    path: '/generate-shorts',
    icon: LayoutGrid,
  },
];

const postItems = [
  {
    title: 'Calendar',
    path: '/calendar',
    icon: CalendarClock,
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Social accounts',
    path: '/social-accounts',
    icon: Link2,
  },
];

const bottomItems = [
  {
    title: 'Affiliate',
    path: '/affiliate',
    icon: Link2,
  },
  {
    title: 'Help and Support',
    path: '/help',
    icon: HelpCircle,
  },
  {
    title: 'Report a Bug',
    path: '/report-bug',
    icon: Bug,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActivePath = (path: string) => {
    if (path === '/' && pathname === '/') {
      return true;
    }
    return path !== '/' && pathname.startsWith(path);
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="bg-background border-b border-neutral-800/50 px-3 transition-all duration-200 group-data-[state=collapsed]:pt-3 group-data-[state=collapsed]:pb-4 group-data-[state=expanded]:py-2">
        <div className="flex w-full items-center group-data-[state=collapsed]:flex-col group-data-[state=collapsed]:items-center group-data-[state=expanded]:flex-row">
          {/* Logo is always visible */}
          <Image src="/logo.png" alt="logo" width={48} height={48} />

          {/* When expanded: trigger on the right, vertically centered */}
          <div className="ml-auto flex items-center group-data-[state=collapsed]:hidden">
            <SidebarTrigger className="text-neutral-400 transition-all hover:bg-neutral-800/30 hover:text-neutral-100" />
          </div>

          {/* When collapsed: trigger below logo */}
          <div className="hidden group-data-[state=collapsed]:mt-2 group-data-[state=collapsed]:flex">
            <SidebarTrigger className="size-7 text-neutral-400 transition-all hover:bg-neutral-800/30 hover:text-neutral-100" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background pb-0">
        {/* User profile section */}
        <div className="mx-2 my-4 overflow-hidden transition-all duration-200 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:my-2 group-data-[collapsible=icon]:w-8">
          {/* Collapsed view - just the avatar */}
          <div className="hidden group-data-[collapsible=icon]:block">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-semibold text-white shadow-lg">
              R
            </div>
          </div>

          {/* Expanded view - simplified card */}
          <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-600/20 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center bg-neutral-800/10 p-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-semibold text-white shadow-sm">
                R
              </div>
              <div className="ml-2.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-foreground truncate text-sm font-medium">
                    ricky@sto...
                  </span>
                  <span className="text-foreground/80 flex items-center rounded-full bg-neutral-700/20 px-1.5 py-0.5 text-xs">
                    <span className="relative mr-1 flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    </span>
                    Free
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-neutral-600/15 bg-neutral-800/5 px-2.5 py-2">
              <div className="mb-1 flex items-center justify-between text-xs font-medium">
                <span className="text-foreground/70">Storage</span>
                <span className="text-foreground/80">2.4/5GB</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-700/20">
                <div className="h-full w-[48%] rounded-full bg-gradient-to-r from-blue-500 to-violet-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Create section */}
        <SidebarGroup className="bg-background">
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Create
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {createItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(item.path)}
                    className={
                      isActivePath(item.path)
                        ? 'before:bg-storyhero before:absolute before:top-1 before:bottom-1 before:left-0 before:w-1 before:rounded-r-full'
                        : ''
                    }
                  >
                    <Link
                      href={item.path}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 size-5" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs font-medium">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Post section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Post
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {postItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(item.path)}
                    className={
                      isActivePath(item.path)
                        ? 'before:bg-storyhero before:absolute before:top-1 before:bottom-1 before:left-0 before:w-1 before:rounded-r-full'
                        : ''
                    }
                  >
                    <Link href={item.path}>
                      <item.icon className="mr-3 size-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom items (subscription, etc.) */}
      <div className="bg-background mt-auto">
        <SidebarMenu className="px-2 py-2">
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActivePath(item.path)}
                className={
                  isActivePath(item.path)
                    ? 'before:bg-storyhero before:absolute before:top-1 before:bottom-1 before:left-0 before:w-1 before:rounded-r-full'
                    : ''
                }
              >
                <Link href={item.path}>
                  <item.icon className="mr-3 size-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
