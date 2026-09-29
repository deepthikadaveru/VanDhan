'use client';

import { useState } from 'react';
import { Banknote, TrendingUp, Clock, AlertCircle, ArrowRight, LifeBuoy } from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { MockSandboxBadge } from '@/components/shared/mock-badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/constants';
import { STUDENT_PAYMENTS } from '@/lib/mock-data/seed';
import { formatINR } from '@/lib/utils/format';
import type { ScholarshipBenefit } from '@/types';

export default function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<ScholarshipBenefit | null>(null);

  const totalSanctioned = STUDENT_PAYMENTS.reduce((s, p) => s + p.amount, 0);
  const totalCredited = STUDENT_PAYMENTS.filter((p) => p.status === 'CREDITED').reduce((s, p) => s + p.amount, 0);
  const pendingAmount = STUDENT_PAYMENTS.filter((p) => p.status !== 'CREDITED').reduce((s, p) => s + p.amount, 0);

  return (
    <StudentLayout>
      <PageHeader title="Payment / DBT Tracker" description="Track your scholarship payments from sanction to credit" />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-info" />
              <p className="text-xs text-muted-foreground">Total Sanctioned</p>
            </div>
            <p className="text-2xl font-bold">{formatINR(totalSanctioned)}</p>
          </CardContent>
        </Card>
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="h-4 w-4 text-success" />
              <p className="text-xs text-muted-foreground">Total Credited</p>
            </div>
            <p className="text-2xl font-bold text-success">{formatINR(totalCredited)}</p>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-warning" />
              <p className="text-xs text-muted-foreground">Pending Amount</p>
            </div>
            <p className="text-2xl font-bold text-warning">{formatINR(pendingAmount)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Cards */}
      <div className="space-y-3">
        {STUDENT_PAYMENTS.map((payment) => (
          <Card
            key={payment.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedPayment(payment)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{payment.schemeName}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{payment.academicYear} · {payment.component}</p>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span>Amount: <span className="font-semibold text-foreground">{formatINR(payment.amount)}</span></span>
                      <span>Date: {payment.date}</span>
                      {payment.transactionRef && <span>Ref: <span className="font-mono">{payment.transactionRef}</span></span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge label={PAYMENT_STATUS_LABELS[payment.status]} colorClass={PAYMENT_STATUS_COLORS[payment.status]} />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <MockSandboxBadge />
        <span className="text-xs text-muted-foreground">Payment data is from mock PFMS/DBT adapter.</span>
      </div>

      {/* Payment Detail Sheet */}
      <Sheet open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <SheetContent className="overflow-y-auto">
          {selectedPayment && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle>Payment Details</SheetTitle>
                <SheetDescription>{selectedPayment.schemeName} · {selectedPayment.academicYear}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-1">
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="font-bold">{formatINR(selectedPayment.amount)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Component</span><span className="font-medium">{selectedPayment.component}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedPayment.date}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span>
                    <StatusBadge label={PAYMENT_STATUS_LABELS[selectedPayment.status]} colorClass={PAYMENT_STATUS_COLORS[selectedPayment.status]} />
                  </div>
                  {selectedPayment.sanctionRef && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sanction Ref</span><span className="font-mono">{selectedPayment.sanctionRef}</span></div>}
                  {selectedPayment.transactionRef && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Transaction Ref</span><span className="font-mono">{selectedPayment.transactionRef}</span></div>}
                  {selectedPayment.bankStatus && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Bank Status</span><span className="font-medium">{selectedPayment.bankStatus}</span></div>}
                </div>

                {/* Transaction Timeline */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Transaction Timeline</h4>
                  <div className="space-y-0">
                    {[
                      { label: 'Sanction Approved', date: selectedPayment.sanctionRef ? '10 Aug 2026' : '—', done: selectedPayment.sanctionRef !== undefined },
                      { label: 'DBT Initiated', date: selectedPayment.status !== 'PENDING' ? '15 Aug 2026' : '—', done: selectedPayment.status !== 'PENDING' },
                      { label: 'Bank Processing', date: selectedPayment.status === 'CREDITED' ? '16 Aug 2026' : '—', done: selectedPayment.status === 'CREDITED' },
                      { label: 'Payment Credited', date: selectedPayment.status === 'CREDITED' ? selectedPayment.date : '—', done: selectedPayment.status === 'CREDITED' },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs ${step.done ? 'border-success bg-success text-success-foreground' : 'border-border bg-card text-muted-foreground'}`}>
                            {step.done ? '✓' : i + 1}
                          </div>
                          {i < 3 && <div className={`w-0.5 h-6 ${step.done ? 'bg-success' : 'bg-border'}`} />}
                        </div>
                        <div className="pt-0.5">
                          <p className={`text-sm font-medium ${step.done ? '' : 'text-muted-foreground'}`}>{step.label}</p>
                          <p className="text-xs text-muted-foreground">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full gap-1.5">
                  <LifeBuoy className="h-4 w-4" />
                  Raise Grievance
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </StudentLayout>
  );
}
