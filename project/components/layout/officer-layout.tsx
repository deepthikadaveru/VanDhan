'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  Users,
  LifeBuoy,
  Settings,
  ScrollText,
  LogOut,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { PrototypeBanner } from '@/components/shared/mock-badge';
import { ROLE_LABELS } from '@/lib/constants';

const NAV_ITEMS = [
  { href: '/officer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/officer/reviews', label: 'Review Queue', icon: ClipboardCheck },
  { href: '/officer/applications', label: 'Applications', icon: FileText },
  { href: '/officer/outreach', label: 'Outreach Analytics', icon: Users },
  { href: '/officer/grievances', label: 'Grievances', icon: LifeBuoy },
  { href: '/officer/scheme-rules', label: 'Scheme Rules', icon: Settings },
  { href: '/officer/audit-logs', label: 'Audit Logs', icon: ScrollText },
];

export function OfficerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PrototypeBanner />
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-card">
          <div className="p-4 border-b">
            <Link href="/officer/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-semibold">VanDhan ScholarConnect</span>
                <p className="text-[10px] text-muted-foreground">Officer Portal</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/officer/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t">
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user ? ROLE_LABELS[user.role] : ''} · {user?.state}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Mobile top bar + horizontal nav */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden sticky top-0 z-40 border-b bg-card">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">Officer Portal</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex overflow-x-auto scrollbar-hide border-t px-2 py-1.5 gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== '/officer/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs whitespace-nowrap transition-colors',
                      active ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          {/* Desktop top bar */}
          <header className="hidden md:flex border-b bg-card px-6 py-3 items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Good morning, <span className="font-semibold text-foreground">{user?.name}</span></p>
              <p className="text-xs text-muted-foreground">{user ? ROLE_LABELS[user.role] : ''} — {user?.state}</p>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
