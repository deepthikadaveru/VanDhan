'use client';

import Link from 'next/link';
import {
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  ArrowRight,
  Activity,
  Server,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { OfficerLayout } from '@/components/layout/officer-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { MockSandboxBadge } from '@/components/shared/mock-badge';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import { OFFICER_REVIEW_CASES, INTEGRATION_HEALTH, MOCK_STUDENTS, OUTREACH_INSIGHTS } from '@/lib/mock-data/seed';

const SCHEME_DATA = [
  { name: 'Pre-Matric', count: 142 },
  { name: 'Post-Matric', count: 387 },
  { name: 'Top Class', count: 56 },
  { name: 'NFST', count: 18 },
  { name: 'NOS', count: 7 },
];

const VERIFICATION_DATA = [
  { name: 'Verified', value: 127, color: '#228B5A' },
  { name: 'Pending', value: 48, color: '#206A9B' },
  { name: 'Mismatch', value: 16, color: '#C63C3C' },
  { name: 'Manual Review', value: 8, color: '#7C3AED' },
];

const PAYMENT_DATA = [
  { name: 'Credited', value: 342, color: '#228B5A' },
  { name: 'Processing', value: 56, color: '#206A9B' },
  { name: 'Failed', value: 12, color: '#C63C3C' },
];

const DISTRICT_DATA = [
  { name: 'Khunti', applications: 312 },
  { name: 'Ranchi', applications: 487 },
  { name: 'Gumla', applications: 198 },
  { name: 'Dumka', applications: 245 },
  { name: 'Simdega', applications: 156 },
];

const KPIS = [
  { icon: ClipboardCheck, label: 'Pending Review', value: 48, color: 'text-warning bg-warning/10' },
  { icon: AlertCircle, label: 'Requiring Action', value: 16, color: 'text-destructive bg-destructive/10' },
  { icon: CheckCircle2, label: 'Verified Today', value: 127, color: 'text-success bg-success/10' },
  { icon: Clock, label: 'Avg Processing Time', value: '4.2 days', color: 'text-info bg-info/10' },
];

export default function OfficerDashboardPage() {
  const priorityCases = OFFICER_REVIEW_CASES.slice(0, 5);
  const unreachedCount = OUTREACH_INSIGHTS.reduce((s, d) => s + d.potentialEligible, 0);

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                      <p className="text-xl font-bold">{kpi.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Applications by Scheme</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={SCHEME_DATA}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#176B45" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Verification Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={VERIFICATION_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fontSize: 11 }}>
                    {VERIFICATION_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={PAYMENT_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fontSize: 11 }}>
                    {PAYMENT_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">District-wise Application Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={DISTRICT_DATA} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="applications" fill="#F4A340" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Priority Review Cases */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Priority Review Cases</CardTitle>
              <Link href="/officer/reviews">
                <Button size="sm" variant="ghost" className="gap-1 text-xs">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Application ID</TableHead>
                  <TableHead className="text-xs">Student</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Scheme</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">Issue</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">SLA</TableHead>
                  <TableHead className="text-xs">Priority</TableHead>
                  <TableHead className="text-xs"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priorityCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-xs font-mono">{c.applicationId}</TableCell>
                    <TableCell className="text-xs font-medium">{c.studentName}</TableCell>
                    <TableCell className="text-xs hidden md:table-cell">{c.scheme}</TableCell>
                    <TableCell className="text-xs hidden sm:table-cell">{c.issue}</TableCell>
                    <TableCell className="text-xs hidden lg:table-cell">{c.sla}</TableCell>
                    <TableCell>
                      <StatusBadge label={PRIORITY_LABELS[c.priority]} colorClass={PRIORITY_COLORS[c.priority]} />
                    </TableCell>
                    <TableCell>
                      <Link href={`/officer/reviews/${c.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Unreached Students + Integration Health */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Unreached Students</h3>
                  <p className="text-2xl font-bold mt-1">{unreachedCount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground mt-1">potentially eligible ST students are enrolled but have no scholarship application.</p>
                  <Link href="/officer/outreach">
                    <Button size="sm" variant="outline" className="mt-3 gap-1">
                      View outreach analytics <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Integration Health</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-1.5">
              {INTEGRATION_HEALTH.slice(0, 5).map((h) => (
                <div key={h.name} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{h.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{h.latency}ms</span>
                    {h.status === 'OPERATIONAL' ? (
                      <span className="inline-flex items-center gap-1 text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Operational</span>
                    ) : (
                      <MockSandboxBadge />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </OfficerLayout>
  );
}
