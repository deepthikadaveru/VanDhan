'use client';

import { useState } from 'react';
import Link from 'next/link';
import { School, GraduationCap, Award, FlaskConical, Plane, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
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
import { SCHEMES } from '@/lib/mock-data/schemes';
import { STUDENT_APPLICATIONS } from '@/lib/mock-data/seed';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from '@/lib/constants';
import type { SchemeCode, ScholarshipScheme } from '@/types';

const SCHEME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  School,
  GraduationCap,
  Award,
  FlaskConical,
  Plane,
};

export default function ScholarshipsPage() {
  const [selectedScheme, setSelectedScheme] = useState<ScholarshipScheme | null>(null);

  const getApplicationStatus = (code: SchemeCode) => {
    const app = STUDENT_APPLICATIONS.find((a) => a.schemeCode === code);
    return app;
  };

  return (
    <StudentLayout>
      <PageHeader
        title="Scholarship Explorer"
        description="All five MoTA scholarship schemes in one place"
      />

      <div className="mb-4 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2 flex items-center gap-2">
        <Info className="h-4 w-4 text-warning flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          Prototype policy summary; verify official guidelines before applying.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SCHEMES.map((scheme) => {
          const Icon = SCHEME_ICONS[scheme.icon] || GraduationCap;
          const app = getApplicationStatus(scheme.code);
          return (
            <Card key={scheme.code} className="flex flex-col hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  {app && (
                    <StatusBadge
                      label={APPLICATION_STATUS_LABELS[app.status]}
                      colorClass={APPLICATION_STATUS_COLORS[app.status]}
                    />
                  )}
                </div>
                <h3 className="font-semibold text-base mb-1">{scheme.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{scheme.targetGroup}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1">{scheme.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge variant="outline" className="text-xs">Income &lt; {scheme.incomeThreshold >= 600000 ? '₹6L' : '₹2.5L'}</Badge>
                  <Badge variant="outline" className="text-xs">{scheme.applicationPeriod}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedScheme(scheme)}>
                    Learn More
                  </Button>
                  <Link href={`/student/eligibility`} className="flex-1">
                    <Button size="sm" className="w-full gap-1">
                      Check Eligibility
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Scheme Detail Dialog */}
      <Dialog open={!!selectedScheme} onOpenChange={(open) => !open && setSelectedScheme(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedScheme && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const Icon = SCHEME_ICONS[selectedScheme.icon] || GraduationCap;
                    return (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                    );
                  })()}
                  <div>
                    <DialogTitle>{selectedScheme.name}</DialogTitle>
                    <DialogDescription>{selectedScheme.targetGroup}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Overview</h4>
                  <p className="text-sm text-muted-foreground">{selectedScheme.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Who can apply</h4>
                  <ul className="space-y-1">
                    {selectedScheme.eligibility.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Common document checklist</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedScheme.documents.map((d, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{d}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Benefits</p>
                    <p className="text-sm font-medium">{selectedScheme.benefits}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Application Period</p>
                    <p className="text-sm font-medium">{selectedScheme.applicationPeriod}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Application stages</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedScheme.stages.map((stage, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">{i + 1}. {stage}</Badge>
                        {i < selectedScheme.stages.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-info/20 bg-info/5 p-3">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-info">Eligibility result for you:</span> Based on your profile (B.A. 1st Year, income ₹2.2L), you are likely eligible for this scheme. Run the full eligibility check for confirmation.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <MockSandboxBadge />
                  <span className="text-xs text-muted-foreground">Policy data is prototype summary.</span>
                </div>
              </div>

              <DialogFooter>
                <Link href={`/student/apply/${selectedScheme.code}`} className="flex-1">
                  <Button className="w-full gap-1.5">
                    Start Application
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}
