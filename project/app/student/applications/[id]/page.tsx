'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Download,
  MessageCircle,
  ShieldCheck,
  XCircle,
  History,
} from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { MockSandboxBadge } from '@/components/shared/mock-badge';
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  VERIFICATION_STATUS_LABELS,
  VERIFICATION_STATUS_COLORS,
} from '@/lib/constants';
import { STUDENT_APPLICATIONS } from '@/lib/mock-data/seed';
import { formatINR } from '@/lib/utils/format';
import type { TimelineEvent, VerificationStatus } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const VERIFICATION_ICONS: Record<VerificationStatus, React.ComponentType<{ className?: string }>> = {
  VERIFIED: CheckCircle2,
  PENDING: Clock,
  MISMATCH: AlertCircle,
  EXPIRED: AlertCircle,
  UNAVAILABLE: XCircle,
  MANUAL_REVIEW_REQUIRED: ShieldCheck,
  REJECTED: XCircle,
};

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const [showAcknowledgement, setShowAcknowledgement] = useState(false);
  const app = STUDENT_APPLICATIONS.find((a) => a.id === params.id);

  if (!app) {
    return (
      <StudentLayout>
        <PageHeader title="Application Not Found" backUrl="/student/applications" />
        <Card><CardContent className="p-6 text-center text-muted-foreground">This application could not be found.</CardContent></Card>
      </StudentLayout>
    );
  }

  const hasAction = app.status === 'ACTION_REQUIRED' || app.verificationSummary.some((v) => v.status === 'EXPIRED' || v.status === 'MISMATCH');

  const handleDownload = () => {
    setShowAcknowledgement(true);
    toast.success('Acknowledgement generated', { description: 'A printable view has been opened.' });
  };

  return (
    <StudentLayout>
      <PageHeader
        title={app.schemeName}
        description={`Application ID: ${app.id}`}
        backUrl="/student/applications"
        backLabel="Back to Applications"
        right={<StatusBadge label={APPLICATION_STATUS_LABELS[app.status]} colorClass={APPLICATION_STATUS_COLORS[app.status]} />}
      />

      {/* Action Alert */}
      {hasAction && (
        <div className="mb-4 rounded-lg border border-warning/30 bg-warning/5 p-3 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning">Action Required</p>
            <p className="text-xs text-muted-foreground mt-0.5">Your income certificate has expired and needs renewal. Please resolve this to continue verification.</p>
            <Link href={`/student/deficiencies/${app.id}`} className="inline-block mt-2">
              <Button size="sm" variant="outline" className="border-warning/30 text-warning hover:bg-warning/10 gap-1">
                Resolve deficiency <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Sanction Amount</p>
            <p className="text-xl font-bold">{app.amount ? formatINR(app.amount) : '—'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Academic Year</p>
            <p className="text-xl font-bold">{app.academicYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <p className="text-xl font-bold">{app.lastUpdated}</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      {app.timeline.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Application Timeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-0">
              {app.timeline.map((event: TimelineEvent, i) => {
                const isCompleted = event.status === 'completed';
                const isCurrent = event.status === 'current';
                const isLast = i === app.timeline.length - 1;
                return (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 flex-shrink-0',
                        isCompleted && 'border-primary bg-primary text-primary-foreground',
                        isCurrent && 'border-primary bg-primary text-primary-foreground animate-pulse-ring',
                        !isCompleted && !isCurrent && 'border-border bg-card text-muted-foreground'
                      )}>
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : isCurrent ? <Clock className="h-4 w-4" /> : i + 1}
                      </div>
                      {!isLast && <div className={cn('w-0.5 flex-1 min-h-[2rem]', isCompleted ? 'bg-primary' : 'bg-border')} />}
                    </div>
                    <div className="pt-1.5 pb-6">
                      <p className={cn('text-sm font-medium', isCurrent && 'text-primary')}>{event.stage}</p>
                      {event.date && <p className="text-xs text-muted-foreground mt-0.5">{event.date}</p>}
                      {isCurrent && <p className="text-xs text-primary mt-1">Currently in progress</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Summary */}
      {app.verificationSummary.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Verification Summary</CardTitle>
              <MockSandboxBadge />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {app.verificationSummary.map((v) => {
              const Icon = VERIFICATION_ICONS[v.status] || Clock;
              return (
                <div key={v.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                  <div className="flex items-start gap-2">
                    <Icon className={cn('h-4 w-4 mt-0.5', VERIFICATION_STATUS_COLORS[v.status].split(' ').find(c => c.startsWith('text-')) || 'text-muted-foreground')} />
                    <div>
                      <p className="text-sm font-medium">{v.field}</p>
                      {v.applicationValue && <p className="text-xs text-muted-foreground">Application: {v.applicationValue}</p>}
                      {v.sourceValue && <p className="text-xs text-muted-foreground">Source: {v.sourceValue}</p>}
                    </div>
                  </div>
                  <StatusBadge label={VERIFICATION_STATUS_LABELS[v.status]} colorClass={VERIFICATION_STATUS_COLORS[v.status]} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Audit Trail */}
      {app.auditTrail.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Activity Log</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {app.auditTrail.map((a) => (
              <div key={a.id} className="flex items-start gap-3 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.timestamp} · {a.actor}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download Acknowledgement
        </Button>
        <Link href={`/student/jago`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <MessageCircle className="h-4 w-4" />
            Ask JAGO about this application
          </Button>
        </Link>
        {hasAction && (
          <Link href={`/student/deficiencies/${app.id}`}>
            <Button size="sm" className="gap-1.5">
              Resolve deficiency <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </div>

      {/* Acknowledgement View */}
      {showAcknowledgement && (
        <div className="mt-4 rounded-lg border-2 border-dashed p-6 print:border-solid">
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg">VanDhan ScholarConnect</h3>
            <p className="text-xs text-muted-foreground">Ministry of Tribal Affairs — Scholarship Application Acknowledgement</p>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Application ID:</span><span className="font-mono font-semibold">{app.id}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Scheme:</span><span className="font-medium">{app.schemeName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><span className="font-medium">{APPLICATION_STATUS_LABELS[app.status]}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Academic Year:</span><span className="font-medium">{app.academicYear}</span></div>
            {app.submissionDate && <div className="flex justify-between"><span className="text-muted-foreground">Submission Date:</span><span className="font-medium">{app.submissionDate}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Last Updated:</span><span className="font-medium">{app.lastUpdated}</span></div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">This is a system-generated acknowledgement for prototype demonstration.</p>
          <div className="text-center mt-3">
            <Button variant="ghost" size="sm" onClick={() => setShowAcknowledgement(false)}>Close</Button>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
