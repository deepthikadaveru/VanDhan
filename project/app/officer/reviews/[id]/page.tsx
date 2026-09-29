'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpCircle,
  Copy,
  History,
  Send,
} from 'lucide-react';
import { OfficerLayout } from '@/components/layout/officer-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { MockSandboxBadge } from '@/components/shared/mock-badge';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { VERIFICATION_STATUS_LABELS, VERIFICATION_STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import { OFFICER_REVIEW_CASES } from '@/lib/mock-data/seed';
import type { VerificationStatus } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ACTIONS = [
  { key: 'approve', label: 'Approve Verification', icon: CheckCircle2, color: 'border-success text-success hover:bg-success/10' },
  { key: 'correction', label: 'Request Correction', icon: AlertCircle, color: 'border-warning text-warning hover:bg-warning/10' },
  { key: 'reject', label: 'Reject with Reason', icon: XCircle, color: 'border-destructive text-destructive hover:bg-destructive/10' },
  { key: 'escalate', label: 'Escalate to State/MoTA', icon: ArrowUpCircle, color: 'border-info text-info hover:bg-info/10' },
  { key: 'duplicate', label: 'Mark as Potential Duplicate', icon: Copy, color: 'border-muted-foreground text-muted-foreground hover:bg-muted' },
];

export default function OfficerCaseDetailPage({ params }: { params: { id: string } }) {
  const [comment, setComment] = useState('');
  const [action, setAction] = useState('');

  const caseData = OFFICER_REVIEW_CASES.find((c) => c.id === params.id);

  if (!caseData) {
    return (
      <OfficerLayout>
        <PageHeader title="Case Not Found" backUrl="/officer/reviews" />
        <Card><CardContent className="p-6 text-center text-muted-foreground">This review case could not be found.</CardContent></Card>
      </OfficerLayout>
    );
  }

  const handleAction = () => {
    if (!comment.trim()) {
      toast.error('Please add a comment before taking action');
      return;
    }
    toast.success(`Action: ${ACTIONS.find(a => a.key === action)?.label || action}`, { description: 'Student has been notified. Audit event recorded.' });
    setComment('');
    setAction('');
  };

  return (
    <OfficerLayout>
      <PageHeader
        title={`Case ${caseData.id}`}
        description={`${caseData.studentName} · ${caseData.scheme} · ${caseData.applicationId}`}
        backUrl="/officer/reviews"
        backLabel="Back to Queue"
        right={
          <div className="flex gap-2">
            <StatusBadge label={PRIORITY_LABELS[caseData.priority]} colorClass={PRIORITY_COLORS[caseData.priority]} />
            <StatusBadge label={caseData.status} colorClass="bg-info/10 text-info border-info/30" />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: Student 360 Profile */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Student 360° Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 text-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                  {caseData.studentName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold">{caseData.studentName}</p>
                  <p className="text-xs text-muted-foreground">District: {caseData.district}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Application ID</span><span className="font-mono">{caseData.applicationId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Scheme</span><span className="font-medium">{caseData.scheme}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Issue</span><span className="font-medium text-destructive">{caseData.issue}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Source</span><span className="font-medium">{caseData.source}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span className="font-medium">{caseData.createdDate}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">SLA</span><span className={cn('font-medium', caseData.sla.includes('overdue') ? 'text-destructive' : '')}>{caseData.sla}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Relevant Documents</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {caseData.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span>{doc.type}</span>
                  <StatusBadge label={doc.status} colorClass={VERIFICATION_STATUS_COLORS[doc.status as VerificationStatus] || 'bg-muted text-muted-foreground border-border'} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Student Explanation */}
          {caseData.studentExplanation && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Student Explanation</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground italic">"{caseData.studentExplanation}"</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Verification + Action */}
        <div className="lg:col-span-2 space-y-4">
          {/* Verification Evidence */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Verification Evidence</CardTitle>
                </div>
                <MockSandboxBadge />
              </div>
              <CardDescription>Comparison of application values vs source system values</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Field</TableHead>
                    <TableHead className="text-xs">Application Value</TableHead>
                    <TableHead className="text-xs">Source Value</TableHead>
                    <TableHead className="text-xs">Match</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseData.verificationComparison.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs font-medium">{v.field}</TableCell>
                      <TableCell className="text-xs">{v.applicationValue}</TableCell>
                      <TableCell className="text-xs">{v.sourceValue}</TableCell>
                      <TableCell><StatusBadge label={VERIFICATION_STATUS_LABELS[v.matchStatus]} colorClass={VERIFICATION_STATUS_COLORS[v.matchStatus]} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Audit Trail</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {caseData.auditTrail.map((a) => (
                <div key={a.id} className="flex items-start gap-3 text-sm border-l-2 border-muted pl-3">
                  <div>
                    <p className="text-sm">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.timestamp} · {a.actor}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Officer Action Panel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Officer Action</CardTitle>
              <CardDescription>Select an action and add a comment. The student will be notified.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex flex-wrap gap-2">
                {ACTIONS.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.key}
                      onClick={() => setAction(a.key)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                        a.color,
                        action === a.key && 'ring-2 ring-offset-1 ring-primary'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {a.label}
                    </button>
                  );
                })}
              </div>
              <div>
                <Label className="text-xs">Officer Comment (required)</Label>
                <Textarea
                  className="mt-1"
                  rows={3}
                  placeholder="Add your comment for this action..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <Button className="w-full gap-1.5" onClick={handleAction} disabled={!action || !comment.trim()}>
                <Send className="h-4 w-4" />
                Submit Action
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </OfficerLayout>
  );
}
