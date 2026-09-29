'use client';

import Link from 'next/link';
import {
  GraduationCap,
  Brain,
  Wallet,
  Banknote,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/status-badge';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS, ACADEMIC_YEAR } from '@/lib/constants';
import { STUDENT_PROFILE, STUDENT_APPLICATIONS, STUDENT_PAYMENTS, STUDENT_NOTIFICATIONS } from '@/lib/mock-data/seed';
import { formatINR } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

const TIMELINE_STAGES = [
  'Draft', 'Submitted', 'Auto-Verification', 'Institution Review', 'State Review', 'Sanctioned', 'DBT Initiated', 'Credited',
];

const QUICK_ACTIONS = [
  { icon: Brain, label: 'Check Eligibility', href: '/student/eligibility', color: 'bg-primary/10 text-primary' },
  { icon: Wallet, label: 'My Documents', href: '/student/wallet', color: 'bg-info/10 text-info' },
  { icon: Banknote, label: 'Track Payments', href: '/student/payments', color: 'bg-accent/10 text-accent-foreground' },
  { icon: MessageCircle, label: 'Ask JAGO', href: '/student/jago', color: 'bg-success/10 text-success' },
];

const OPPORTUNITIES = [
  { name: 'Top Class Education Scholarship', tag: 'Likely eligible', color: 'text-success border-success/30 bg-success/10' },
  { name: 'National Fellowship (NFST)', tag: 'Eligible after PG admission', color: 'text-info border-info/30 bg-info/10' },
  { name: 'National Overseas Scholarship', tag: 'Explore requirements', color: 'text-accent-foreground border-accent/30 bg-accent/10' },
];

export default function StudentDashboard() {
  const activeApp = STUDENT_APPLICATIONS.find((a) => a.status === 'INSTITUTION_REVIEW');
  const totalReceived = STUDENT_PAYMENTS.filter((p) => p.status === 'CREDITED').reduce((s, p) => s + p.amount, 0);
  const creditedCount = STUDENT_PAYMENTS.filter((p) => p.status === 'CREDITED').length;
  const currentStageIndex = 3; // Institution Review

  return (
    <StudentLayout>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Namaste, {STUDENT_PROFILE.name.split(' ')[0]}!</h1>
        <p className="text-sm text-muted-foreground">Academic Year {ACADEMIC_YEAR} · {STUDENT_PROFILE.education}</p>
      </div>

      {/* Profile Completion + Active Scholarship */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {/* Profile Completion */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-2xl font-bold text-primary">{STUDENT_PROFILE.profileCompletion}%</span>
            </div>
            <Progress value={STUDENT_PROFILE.profileCompletion} className="h-2" />
            <Link href="/student/profile" className="text-xs text-primary hover:underline mt-2 inline-block">
              Complete your profile →
            </Link>
          </CardContent>
        </Card>

        {/* Active Scholarship */}
        {activeApp && (
          <Card className="md:col-span-2 border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Active Application</p>
                  <h3 className="font-semibold text-base">{activeApp.schemeName}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{activeApp.id}</p>
                </div>
                <StatusBadge
                  label={APPLICATION_STATUS_LABELS[activeApp.status]}
                  colorClass={APPLICATION_STATUS_COLORS[activeApp.status]}
                />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Sanction Amount</p>
                  <p className="text-lg font-bold">{formatINR(activeApp.amount || 0)}</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">{activeApp.lastUpdated}</p>
                </div>
              </div>
              <Link href={`/student/applications/${activeApp.id}`}>
                <Button size="sm" className="gap-1.5">
                  Track Application
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Funds + Action Required */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Benefits Received</p>
                <p className="text-2xl font-bold">{formatINR(totalReceived)}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground ml-13">{creditedCount} payment credited</p>
          </CardContent>
        </Card>

        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Action Required</p>
                <p className="text-sm font-semibold">Income Certificate needs attention</p>
              </div>
            </div>
            <Link href={`/student/deficiencies/${activeApp?.id || ''}`}>
              <Button size="sm" variant="outline" className="gap-1.5 border-warning/30 text-warning hover:bg-warning/10">
                Resolve now
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Unified Application Timeline */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Application Timeline</CardTitle>
          <p className="text-xs text-muted-foreground">Track your Post-Matric Scholarship journey</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide">
            {TIMELINE_STAGES.map((stage, i) => {
              const completed = i < currentStageIndex;
              const current = i === currentStageIndex;
              return (
                <div key={stage} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all',
                        completed && 'border-primary bg-primary text-primary-foreground',
                        current && 'border-primary bg-primary text-primary-foreground animate-pulse-ring',
                        !completed && !current && 'border-border bg-card text-muted-foreground'
                      )}
                    >
                      {completed ? <CheckCircle2 className="h-4 w-4" /> : current ? <Clock className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={cn('text-[10px] font-medium text-center leading-tight', current ? 'text-primary' : 'text-muted-foreground')}>
                      {stage}
                    </span>
                  </div>
                  {i < TIMELINE_STAGES.length - 1 && (
                    <div className={cn('h-0.5 flex-1 mx-1 rounded-full', completed ? 'bg-primary' : 'bg-border')} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', action.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Your Opportunities */}
      <Card className="mb-6 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <CardTitle className="text-base">Your Opportunities</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {OPPORTUNITIES.map((opp, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">{opp.name}</span>
              <StatusBadge label={opp.tag} colorClass={opp.color} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Notifications</CardTitle>
            <Link href="/student/notifications" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {STUDENT_NOTIFICATIONS.slice(0, 4).map((n) => (
            <div key={n.id} className={cn('flex items-start gap-3 rounded-lg p-2.5', n.read ? '' : 'bg-primary/5')}>
              <div className={cn('mt-0.5 h-2 w-2 rounded-full flex-shrink-0', n.read ? 'bg-muted' : 'bg-primary')} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{n.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </StudentLayout>
  );
}
