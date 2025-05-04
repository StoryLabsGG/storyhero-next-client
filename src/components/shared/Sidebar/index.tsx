'use client';

import {
  BarChart3,
  Bookmark,
  Bug,
  CalendarClock,
  ChevronDown,
  CreditCard,
  HelpCircle,
  Home,
  LayoutGrid,
  Link2,
  LogOut,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  // {
  //   title: 'Generate',
  //   path: '/generate-shorts',
  //   icon: LayoutGrid,
  // },
  {
    title: 'Presets',
    path: '/presets',
    icon: Bookmark,
    badge: undefined,
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
    path: 'https://storyhero.tolt.io',
    target: '_blank',
    icon: Link2,
  },
  {
    title: 'Help and Support',
    path: 'https://discord.gg/bySfxxb4Sa',
    target: '_blank',
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isPaid = false;

  const isActivePath = (path: string) => {
    if (path === '/' && pathname === '/') {
      return true;
    }
    return path !== '/' && pathname.startsWith(path);
  };

  const formatDisplayName = (
    name: string | null | undefined,
    email: string | null | undefined
  ) => {
    if (!email) return 'User';

    if (email.length > 15) {
      const atIndex = email.indexOf('@');
      if (atIndex > 0) {
        const username = email.substring(0, atIndex);
        const domain = email.substring(atIndex + 1);

        if (username.length > 8) {
          return `${username.substring(0, 6)}...@${domain}`;
        } else {
          // If username is short, we can truncate the domain instead
          return `${username}@${domain.substring(0, 5)}...`;
        }
      }
      return `${email.substring(0, 12)}...`;
    }

    return email;
  };

  const getInitial = (
    name: string | null | undefined,
    email: string | null | undefined
  ) => {
    if (name && name.trim().length > 0) {
      return name.charAt(0).toUpperCase();
    }

    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="bg-background border-b border-neutral-800/50 px-4 py-2">
        <div className="flex w-full items-center">
          {/* Logo with StoryHero text */}
          <Image src="/logo.png" alt="logo" width={36} height={36} />
          <span className="ml-2.5 text-lg font-semibold">StoryHero</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background pb-0">
        {/* User profile section */}
        <div className="mx-3 my-5 overflow-hidden">
          {/* Expanded view - simplified card */}
          <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-600/20">
            <div className="flex items-center bg-neutral-800/10 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-semibold text-white shadow-sm">
                {getInitial(session?.user?.name, session?.user?.email)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto rounded-md px-2 py-1 hover:bg-neutral-800/30"
                      >
                        <span className="text-foreground truncate text-sm font-medium">
                          {formatDisplayName(
                            session?.user?.name,
                            session?.user?.email
                          )}
                        </span>
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem asChild>
                        <Link
                          href="/subscription"
                          className="flex items-center"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Subscription</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: '/' })}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="border-t border-neutral-600/15 bg-neutral-800/5 px-3 py-2.5">
              {!isPaid && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/30 text-xs font-medium text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/subscription">Upgrade to Pro</Link>
                  </Button>
                </div>
              )}
              <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
                <span className="text-foreground/70">Storage</span>
                <span className="text-foreground/80">
                  0 / {isPaid ? '50' : '5'} GB
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-neutral-700/20">
                <div className="h-full w-0 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Create section */}
        <SidebarGroup className="bg-background">
          <SidebarGroupLabel className="px-4 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Create
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-1 space-y-0.5 pe-2">
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
                      className="mx-2 flex items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-neutral-800/20"
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
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-4 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Post
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-1 space-y-0.5 pe-2">
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
                    <Link
                      href={item.path}
                      className="mx-2 flex items-center rounded-md px-2 py-2 transition-colors hover:bg-neutral-800/20"
                    >
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
      <div className="bg-background mt-auto border-t border-neutral-800/30">
        <SidebarMenu className="space-y-1 px-2 py-3">
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
                <Link
                  href={item.path}
                  target={item.target}
                  className="mx-2 flex items-center rounded-md px-2 py-2 transition-colors hover:bg-neutral-800/20"
                >
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
