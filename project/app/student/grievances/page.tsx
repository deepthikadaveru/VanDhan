'use client';

import { useState } from 'react';
import { LifeBuoy, Plus, MessageSquare, Send, ArrowRight } from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { STUDENT_GRIEVANCES, STUDENT_APPLICATIONS } from '@/lib/mock-data/seed';
import type { GrievanceTicket, GrievanceStatus } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES = [
  'Application delay',
  'Payment delay',
  'Document verification issue',
  'Incorrect eligibility status',
  'Other',
];

const STATUS_CONFIG: Record<GrievanceStatus, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-info/10 text-info border-info/30' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-warning/10 text-warning border-warning/30' },
  RESOLVED: { label: 'Resolved', color: 'bg-success/10 text-success border-success/30' },
};

export default function GrievancesPage() {
  const [tickets, setTickets] = useState<GrievanceTicket[]>(STUDENT_GRIEVANCES);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [applicationId, setApplicationId] = useState('');

  const handleCreate = () => {
    if (!category || !subject.trim() || !description.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    const ticketId = `GRV-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const newTicket: GrievanceTicket = {
      id: ticketId,
      studentId: 'sp1',
      category,
      subject,
      description,
      status: 'OPEN',
      createdAt: '25 Sep 2026',
      applicationId: applicationId || undefined,
      messages: [
        { id: 'gm1', from: 'student', message: description, timestamp: '25 Sep 2026, 10:00 IST' },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    setOpen(false);
    setCategory(''); setSubject(''); setDescription(''); setApplicationId('');
    toast.success('Grievance created', { description: `Your ticket ID is ${ticketId}` });
  };

  return (
    <StudentLayout>
      <PageHeader
        title="Grievances"
        description="Raise and track scholarship-related grievances"
        right={
          <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Grievance
          </Button>
        }
      />

      <div className="space-y-3">
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <LifeBuoy className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No grievances yet. Create one if you need help.</p>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket) => {
            const statusConfig = STATUS_CONFIG[ticket.status];
            return (
              <Card key={ticket.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                        <StatusBadge label={statusConfig.label} colorClass={statusConfig.color} />
                      </div>
                      <h3 className="font-semibold text-sm mt-1">{ticket.subject}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{ticket.category} · Created {ticket.createdAt}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{ticket.description}</p>
                  {ticket.applicationId && (
                    <p className="text-xs text-muted-foreground mt-2">Linked application: <span className="font-mono">{ticket.applicationId}</span></p>
                  )}
                  {ticket.messages.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {ticket.messages.map((msg) => (
                        <div key={msg.id} className={cn('rounded-lg p-2.5 text-xs', msg.from === 'student' ? 'bg-primary/5 ml-0' : 'bg-muted ml-6')}>
                          <p className="text-xs">{msg.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{msg.timestamp} · {msg.from === 'student' ? 'You' : 'Officer'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Grievance</DialogTitle>
            <DialogDescription>Submit a new grievance ticket</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Subject</Label>
              <Input className="mt-1" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief subject" />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea className="mt-1" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your issue in detail" />
            </div>
            <div>
              <Label className="text-xs">Link to Application (optional)</Label>
              <Select value={applicationId} onValueChange={setApplicationId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  {STUDENT_APPLICATIONS.map((a) => <SelectItem key={a.id} value={a.id}>{a.id} — {a.schemeName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="gap-1.5">
              <Send className="h-4 w-4" />
              Submit Grievance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}
