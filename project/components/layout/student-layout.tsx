'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, FileText, Wallet, MessageCircle, User, LogOut, Bell, GraduationCap, Globe, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PrototypeBanner } from '@/components/shared/mock-badge';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { href: '/student/dashboard', label: 'Home', icon: Home },
  { href: '/student/applications', label: 'Applications', icon: FileText },
  { href: '/student/wallet', label: 'Wallet', icon: Wallet },
  { href: '/student/jago', label: 'JAGO', icon: MessageCircle },
  { href: '/student/profile', label: 'Profile', icon: User },
];

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, language, setLanguage } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleReadAloud = () => {
    toast.success('Read aloud started', { description: 'Text-to-speech is a prototype demonstration.' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PrototypeBanner />
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b bg-primary text-primary-foreground shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold">VanDhan ScholarConnect</span>
              <p className="text-[10px] text-primary-foreground/70">Ministry of Tribal Affairs</p>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              aria-label="Switch language"
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleReadAloud}
              aria-label="Read aloud"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Link href="/student/notifications">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 pb-24 sm:pb-6">
        {children}
      </main>

      {/* Bottom Navigation (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card shadow-lg sm:hidden">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2.5 text-xs transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
                <span className={cn('font-medium', active && 'font-semibold')}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
