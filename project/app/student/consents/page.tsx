'use client';

import { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, History } from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { STUDENT_CONSENTS, AUDIT_LOGS } from '@/lib/mock-data/seed';
import type { ConsentRecord, ConsentStatus } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<ConsentStatus, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: 'bg-success/10 text-success border-success/30' },
  REVOKED: { label: 'Revoked', color: 'bg-destructive/10 text-destructive border-destructive/30' },
  EXPIRED: { label: 'Expired', color: 'bg-warning/10 text-warning border-warning/30' },
};

export default function ConsentsPage() {
  const [consents, setConsents] = useState<ConsentRecord[]>(STUDENT_CONSENTS);
  const [revokeTarget, setRevokeTarget] = useState<ConsentRecord | null>(null);

  const handleRevoke = () => {
    if (!revokeTarget) return;
    setConsents((prev) =>
      prev.map((c) => (c.id === revokeTarget.id ? { ...c, status: 'REVOKED' as ConsentStatus } : c))
    );
    toast.success('Consent revoked', { description: `Access to ${revokeTarget.source} has been revoked. An audit event has been recorded.` });
    setRevokeTarget(null);
  };

  const consentAuditLogs = AUDIT_LOGS.filter((l) => l.action.includes('consent') || l.action.includes('Consent'));

  return (
    <StudentLayout>
      <PageHeader title="Consent Management" description="You control your data. Revoke access at any time." />

      {/* Privacy Banner */}
      <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-primary">Your data is accessed only for scholarship services you approve.</p>
          <p className="text-xs text-muted-foreground mt-1">Every data access is recorded in an immutable audit log. You can revoke consent at any time and the corresponding verification service will no longer have access.</p>
        </div>
      </div>

      {/* Active Consents */}
      <div className="space-y-3 mb-6">
        {consents.map((consent) => {
          const statusConfig = STATUS_CONFIG[consent.status];
          return (
            <Card key={consent.id} className={cn(consent.status === 'REVOKED' && 'opacity-60')}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{consent.source}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{consent.purpose}</p>
                    </div>
                  </div>
                  <StatusBadge label={statusConfig.label} colorClass={statusConfig.color} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-muted-foreground">Data types:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {consent.dataTypes.map((d) => <Badge key={d} variant="outline" className="text-[10px]">{d}</Badge>)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Granted:</span><span className="font-medium">{consent.grantedDate}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Expires:</span><span className="font-medium">{consent.expiryDate}</span></div>
                  </div>
                </div>
                {consent.status === 'ACTIVE' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => setRevokeTarget(consent)}
                  >
                    Revoke Consent
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Audit History */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Consent Audit History</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Timestamp</TableHead>
                <TableHead className="text-xs">Actor</TableHead>
                <TableHead className="text-xs">Action</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consentAuditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs">{log.timestamp}</TableCell>
                  <TableCell className="text-xs font-medium">{log.actor}</TableCell>
                  <TableCell className="text-xs">{log.action}</TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{log.metadata}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Revoke Confirmation */}
      <Dialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Consent?</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke access to {revokeTarget?.source}? This will stop all verification using this data source. An audit event will be recorded.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRevoke}>Yes, Revoke</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}
