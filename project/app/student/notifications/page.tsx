'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ShieldCheck,
  Banknote,
  Sparkles,
  Lock,
  MessageCircle,
  FileText,
  LifeBuoy,
  CheckCheck,
  Bell,
} from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared/page-header';
import { NOTIFICATION_TYPE_LABELS } from '@/lib/constants';
import { STUDENT_NOTIFICATIONS } from '@/lib/mock-data/seed';
import type { NotificationType } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const TYPE_ICONS: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  DEFICIENCY: AlertCircle,
  VERIFICATION: ShieldCheck,
  PAYMENT: Banknote,
  ELIGIBILITY: Sparkles,
  CONSENT: Lock,
  CHATBOT: MessageCircle,
  APPLICATION: FileText,
  GRIEVANCE: LifeBuoy,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  DEFICIENCY: 'text-warning bg-warning/10',
  VERIFICATION: 'text-info bg-info/10',
  PAYMENT: 'text-success bg-success/10',
  ELIGIBILITY: 'text-accent-foreground bg-accent/10',
  CONSENT: 'text-primary bg-primary/10',
  CHATBOT: 'text-info bg-info/10',
  APPLICATION: 'text-primary bg-primary/10',
  GRIEVANCE: 'text-destructive bg-destructive/10',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(STUDENT_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  return (
    <StudentLayout>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        right={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      <Tabs value={filter} onValueChange={setFilter} className="mb-4">
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No notifications.</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((n) => {
            const Icon = TYPE_ICONS[n.type];
            return (
              <Card
                key={n.id}
                className={cn('hover:shadow-sm transition-shadow cursor-pointer', !n.read && 'border-primary/20 bg-primary/5')}
                onClick={() => markAsRead(n.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0', TYPE_COLORS[n.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-muted-foreground">{n.date}</span>
                            <span className="text-[10px] text-muted-foreground">·</span>
                            <span className="text-[10px] text-muted-foreground">{NOTIFICATION_TYPE_LABELS[n.type]}</span>
                          </div>
                        </div>
                        {!n.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                      </div>
                      {n.actionUrl && (
                        <Link href={n.actionUrl} onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs px-2 text-primary">
                            View →
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </StudentLayout>
  );
}
