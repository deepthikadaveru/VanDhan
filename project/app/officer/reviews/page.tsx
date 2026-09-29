'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { OfficerLayout } from '@/components/layout/officer-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { PRIORITY_LABELS, PRIORITY_COLORS, REVIEW_CASE_STATUS_LABELS } from '@/lib/constants';
import { OFFICER_REVIEW_CASES } from '@/lib/mock-data/seed';
import type { Priority } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-info/10 text-info border-info/30',
  IN_PROGRESS: 'bg-warning/10 text-warning border-warning/30',
  RESOLVED: 'bg-success/10 text-success border-success/30',
  ESCALATED: 'bg-destructive/10 text-destructive border-destructive/30',
  PENDING: 'bg-muted text-muted-foreground border-border',
};

export default function ReviewQueuePage() {
  const [search, setSearch] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = OFFICER_REVIEW_CASES.filter((c) => {
    if (search && !c.studentName.toLowerCase().includes(search.toLowerCase()) && !c.applicationId.toLowerCase().includes(search.toLowerCase())) return false;
    if (schemeFilter !== 'all' && !c.scheme.includes(schemeFilter)) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <OfficerLayout>
      <PageHeader title="Review Queue" description="Applications requiring officer attention" />

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search student or ID..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={schemeFilter} onValueChange={setSchemeFilter}>
          <SelectTrigger><SelectValue placeholder="All schemes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All schemes</SelectItem>
            <SelectItem value="Post-Matric">Post-Matric</SelectItem>
            <SelectItem value="Top Class">Top Class</SelectItem>
            <SelectItem value="Pre-Matric">Pre-Matric</SelectItem>
            <SelectItem value="NFST">NFST</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger><SelectValue placeholder="All priorities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="ESCALATED">Escalated</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Case ID</TableHead>
                <TableHead className="text-xs">Student</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Application ID</TableHead>
                <TableHead className="text-xs hidden lg:table-cell">Scheme</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">Issue</TableHead>
                <TableHead className="text-xs hidden xl:table-cell">Source</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Created</TableHead>
                <TableHead className="text-xs hidden lg:table-cell">SLA</TableHead>
                <TableHead className="text-xs">Priority</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-xs font-mono">{c.id}</TableCell>
                  <TableCell className="text-xs font-medium">{c.studentName}</TableCell>
                  <TableCell className="text-xs font-mono hidden md:table-cell">{c.applicationId}</TableCell>
                  <TableCell className="text-xs hidden lg:table-cell">{c.scheme}</TableCell>
                  <TableCell className="text-xs hidden sm:table-cell">{c.issue}</TableCell>
                  <TableCell className="text-xs hidden xl:table-cell">{c.source}</TableCell>
                  <TableCell className="text-xs hidden md:table-cell">{c.createdDate}</TableCell>
                  <TableCell className="text-xs hidden lg:table-cell">{c.sla}</TableCell>
                  <TableCell><StatusBadge label={PRIORITY_LABELS[c.priority]} colorClass={PRIORITY_COLORS[c.priority]} /></TableCell>
                  <TableCell><StatusBadge label={REVIEW_CASE_STATUS_LABELS[c.status]} colorClass={STATUS_COLORS[c.status]} /></TableCell>
                  <TableCell>
                    <Link href={`/officer/reviews/${c.id}`}>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-0.5">
                        View <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">No cases match your filters.</div>
          )}
        </CardContent>
      </Card>
    </OfficerLayout>
  );
}
