'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Search } from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from '@/lib/constants';
import { STUDENT_APPLICATIONS } from '@/lib/mock-data/seed';
import { formatINR } from '@/lib/utils/format';
import type { ApplicationStatus } from '@/types';

const FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'verification', label: 'Under Verification' },
  { key: 'action', label: 'Action Required' },
  { key: 'sanctioned', label: 'Sanctioned' },
  { key: 'completed', label: 'Completed' },
];

function matchesFilter(status: ApplicationStatus, filter: string): boolean {
  if (filter === 'all') return true;
  if (filter === 'draft') return status === 'DRAFT' || status === 'NOT_STARTED' || status === 'ELIGIBILITY_CHECK_REQUIRED';
  if (filter === 'verification') return ['SUBMITTED', 'AUTO_VERIFICATION', 'INSTITUTION_REVIEW', 'STATE_REVIEW', 'MOTA_REVIEW'].includes(status);
  if (filter === 'action') return status === 'ACTION_REQUIRED';
  if (filter === 'sanctioned') return ['SANCTIONED', 'DBT_INITIATED'].includes(status);
  if (filter === 'completed') return ['COMPLETED', 'CREDITED'].includes(status);
  return true;
}

export default function ApplicationsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = STUDENT_APPLICATIONS.filter(
    (a) => matchesFilter(a.status, filter) &&
    (search === '' || a.schemeName.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <StudentLayout>
      <PageHeader title="My Applications" description="All your scholarship applications in one place" />

      <div className="mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by scheme name or application ID..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full">
            {FILTERS.map((f) => (
              <TabsTrigger key={f.key} value={f.key} className="text-xs">{f.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No applications found matching your filter.</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((app) => (
            <Link key={app.id} href={`/student/applications/${app.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">{app.schemeName}</h3>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{app.id}</p>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                          {app.submissionDate && <span>Submitted: {app.submissionDate}</span>}
                          <span>Updated: {app.lastUpdated}</span>
                          {app.amount && <span>Amount: {formatINR(app.amount)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <StatusBadge
                        label={APPLICATION_STATUS_LABELS[app.status]}
                        colorClass={APPLICATION_STATUS_COLORS[app.status]}
                      />
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </StudentLayout>
  );
}
