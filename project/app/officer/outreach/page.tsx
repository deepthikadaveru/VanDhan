'use client';

import { useState } from 'react';
import { Users, TrendingUp, AlertCircle, FileEdit, Megaphone, Send } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { OfficerLayout } from '@/components/layout/officer-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { PageHeader } from '@/components/shared/page-header';
import { MockSandboxBadge } from '@/components/shared/mock-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { OUTREACH_INSIGHTS } from '@/lib/mock-data/seed';
import { toast } from 'sonner';

const COVERAGE_BY_EDU = [
  { level: 'Class IX-X', enrolled: 3200, beneficiaries: 2100 },
  { level: 'Class XI-XII', enrolled: 2800, beneficiaries: 1450 },
  { level: 'UG', enrolled: 5200, beneficiaries: 3102 },
  { level: 'PG', enrolled: 1800, beneficiaries: 890 },
  { level: 'PhD', enrolled: 420, beneficiaries: 180 },
];

const ELIGIBLE_NOT_APPLIED_TREND = [
  { month: 'Apr', count: 1450 },
  { month: 'May', count: 1320 },
  { month: 'Jun', count: 1280 },
  { month: 'Jul', count: 1248 },
  { month: 'Aug', count: 1190 },
  { month: 'Sep', count: 1248 },
];

const TOP_INSTITUTIONS = [
  { name: 'Ranchi Women\'s College', unreached: 142 },
  { name: 'St. Xavier College, Simdega', unreached: 98 },
  { name: 'Gumla College', unreached: 76 },
  { name: 'Dumka Polytechnic', unreached: 65 },
  { name: 'Khunti Inter College', unreached: 52 },
];

const KPIS = [
  { icon: Users, label: 'Total Enrolled ST Students', value: '15,430', color: 'text-info bg-info/10' },
  { icon: TrendingUp, label: 'Scholarship Beneficiaries', value: '8,972', color: 'text-success bg-success/10' },
  { icon: AlertCircle, label: 'Potentially Unreached', value: '1,248', color: 'text-warning bg-warning/10' },
  { icon: FileEdit, label: 'Incomplete Applications', value: '534', color: 'text-destructive bg-destructive/10' },
];

export default function OutreachPage() {
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [targetGroup, setTargetGroup] = useState('');
  const [language, setLanguage] = useState('');
  const [message, setMessage] = useState('');

  const totalEnrolled = OUTREACH_INSIGHTS.reduce((s, d) => s + d.enrolledStudents, 0);
  const totalBeneficiaries = OUTREACH_INSIGHTS.reduce((s, d) => s + d.beneficiaries, 0);
  const totalUnreached = OUTREACH_INSIGHTS.reduce((s, d) => s + d.potentialEligible, 0);

  const handleCreateCampaign = () => {
    if (!targetGroup || !language || !message.trim()) {
      toast.error('Please fill all campaign fields');
      return;
    }
    setCampaignOpen(false);
    setTargetGroup(''); setLanguage(''); setMessage('');
    toast.success('Outreach campaign created', { description: 'Campaign is now active. SMS/push notifications will be sent to the target group.' });
  };

  return (
    <OfficerLayout>
      <PageHeader
        title="Scholarship Coverage Intelligence"
        description="Identify and reach eligible but unreached ST students"
        right={
          <Button size="sm" className="gap-1.5" onClick={() => setCampaignOpen(true)}>
            <Megaphone className="h-4 w-4" />
            Create Outreach Campaign
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <MockSandboxBadge />
        <span className="text-xs text-muted-foreground">Synthetic demo analytics — no actual student personal data is used.</span>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
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
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Coverage by District</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={OUTREACH_INSIGHTS}>
                <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="enrolledStudents" name="Enrolled" fill="#206A9B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="beneficiaries" name="Beneficiaries" fill="#228B5A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="potentialEligible" name="Unreached" fill="#F4A340" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Coverage by Education Level</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={COVERAGE_BY_EDU}>
                <XAxis dataKey="level" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="enrolled" name="Enrolled" fill="#206A9B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="beneficiaries" name="Beneficiaries" fill="#228B5A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Eligible but Not Applied — Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ELIGIBLE_NOT_APPLIED_TREND}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" stroke="#F4A340" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Institutions Needing Outreach</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={TOP_INSTITUTIONS} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={120} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="unreached" name="Unreached Students" fill="#C63C3C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">District Coverage Data</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">District</TableHead>
                <TableHead className="text-xs">Enrolled ST Students</TableHead>
                <TableHead className="text-xs">Beneficiaries</TableHead>
                <TableHead className="text-xs">Potential Eligible</TableHead>
                <TableHead className="text-xs">Coverage %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OUTREACH_INSIGHTS.map((d) => (
                <TableRow key={d.district}>
                  <TableCell className="text-sm font-medium">{d.district}</TableCell>
                  <TableCell className="text-sm">{d.enrolledStudents.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-sm">{d.beneficiaries.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-sm text-warning font-medium">{d.potentialEligible}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full ${d.coveragePercentage > 60 ? 'bg-success' : d.coveragePercentage > 50 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${d.coveragePercentage}%` }} />
                      </div>
                      <span className="text-xs font-medium">{d.coveragePercentage}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Campaign Dialog */}
      <Dialog open={campaignOpen} onOpenChange={setCampaignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Outreach Campaign</DialogTitle>
            <DialogDescription>Send SMS/push notifications to unreached eligible students</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Target Group</Label>
              <Select value={targetGroup} onValueChange={setTargetGroup}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select target group" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="class910">Class IX-X ST students without Pre-Matric</SelectItem>
                  <SelectItem value="ug">Undergraduate ST students without Post-Matric</SelectItem>
                  <SelectItem value="pg">Postgraduate ST students without Post-Matric</SelectItem>
                  <SelectItem value="phd">PhD candidates without NFST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Message Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select language" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="gon">Gondi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Message Preview</Label>
              <textarea
                className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Type your outreach message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {message && (
                <div className="mt-2 rounded-lg border border-info/20 bg-info/5 p-2.5">
                  <p className="text-xs text-muted-foreground">Preview:</p>
                  <p className="text-sm mt-1">{message}</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCampaignOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign} className="gap-1.5">
              <Send className="h-4 w-4" />
              Confirm & Launch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OfficerLayout>
  );
}
