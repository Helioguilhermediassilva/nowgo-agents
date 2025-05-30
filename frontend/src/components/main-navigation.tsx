import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LanguageSwitcher, ModeToggle } from '@/components/language-switcher';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Settings, LogOut, Menu, X } from 'lucide-react';

export function MainNavigation() {
  const t = useTranslations('Navigation');
  const { theme } = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navigationItems = [
    {
      title: t('dashboard'),
      href: '/dashboard',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: t('agents'),
      href: '/dashboard/agents',
      icon: <Users className="mr-2 h-4 w-4" />,
      children: [
        {
          title: t('allAgents'),
          href: '/dashboard/agents',
        },
        {
          title: t('virginia'),
          description: t('virginiaDescription'),
          href: '/dashboard/agents/virginia',
        },
        {
          title: t('guilherme'),
          description: t('guilhermeDescription'),
          href: '/dashboard/agents/guilherme',
        },
        {
          title: t('newAgent'),
          description: t('newAgentDescription'),
          href: '/dashboard/new-agent',
        },
      ],
    },
    {
      title: t('settings'),
      href: '/dashboard/settings',
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/images/logo.svg" 
              alt="NowGo Agents" 
              className="h-8"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = theme === 'dark' 
                  ? '/images/logo-placeholder-light.svg' 
                  : '/images/logo-placeholder-dark.svg';
              }}
            />
            <span className="hidden font-bold sm:inline-block">
              NowGo Agents
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => 
                item.children ? (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger className="h-9 px-4">
                      <span className="flex items-center">
                        {item.icon}
                        {item.title}
                      </span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.children.map((child) => (
                          <li key={child.title} className="row-span-1">
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{child.title}</div>
                                {child.description && (
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {child.description}
                                  </p>
                                )}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={cn(
                          "flex items-center h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md",
                          router.pathname === item.href && "bg-accent text-accent-foreground"
                        )}
                      >
                        {item.icon}
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <ModeToggle />
            <div className="flex items-center space-x-1">
              <Avatar className="h-8 w-8 cursor-pointer" onClick={() => router.push('/dashboard/profile')}>
                <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigationItems.map((item) => (
              <React.Fragment key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-base font-medium rounded-md",
                    router.pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.title}
                </Link>
                {item.children && (
                  <div className="pl-6 space-y-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                          router.pathname === child.href
                            ? "bg-accent/50 text-accent-foreground"
                            : "hover:bg-accent/50 hover:text-accent-foreground"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            <div className="border-t border-border my-2 pt-2">
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8" onClick={() => {
                  router.push('/dashboard/profile');
                  setMobileMenuOpen(false);
                }}>
                  <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{user?.name || 'User'}</div>
              </div>
              <div className="flex items-center space-x-1">
                <LanguageSwitcher />
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
