'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  FileText,
  User,
  GraduationCap,
  ClipboardCheck,
  ShieldCheck,
  Send,
  Info,
} from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { getScheme } from '@/lib/mock-data/schemes';
import { STUDENT_PROFILE, STUDENT_DOCUMENTS, STUDENT_APPLICATIONS } from '@/lib/mock-data/seed';
import { DOCUMENT_STATUS_LABELS, DOCUMENT_STATUS_COLORS } from '@/lib/constants';
import type { SchemeCode } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STEPS = [
  { label: 'Scheme Overview', icon: FileText },
  { label: 'Personal Details', icon: User },
  { label: 'Education & Institution', icon: GraduationCap },
  { label: 'Document Checklist', icon: ClipboardCheck },
  { label: 'Conflict Check', icon: ShieldAlert },
  { label: 'Declaration & Consent', icon: ShieldCheck },
  { label: 'Review & Submit', icon: Send },
];

export default function ApplyWizardPage({ params }: { params: { schemeCode: string } }) {
  const router = useRouter();
  const schemeCode = params.schemeCode as SchemeCode;
  const scheme = getScheme(schemeCode);
  const [step, setStep] = useState(0);
  const [declaration, setDeclaration] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!scheme) {
    return (
      <StudentLayout>
        <PageHeader title="Scheme Not Found" backUrl="/student/scholarships" />
        <Card><CardContent className="p-6 text-center text-muted-foreground">The requested scholarship scheme could not be found.</CardContent></Card>
      </StudentLayout>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const activeScholarships = STUDENT_APPLICATIONS.filter(
    (a) => a.studentId === 'sp1' && a.status !== 'COMPLETED' && a.status !== 'NOT_STARTED' && a.status !== 'ELIGIBILITY_CHECK_REQUIRED' && a.status !== 'DRAFT' && a.schemeCode !== schemeCode
  );
  const hasConflict = activeScholarships.length > 0;

  const handleSubmit = () => {
    if (!declaration || !consent) {
      toast.error('Please accept the declaration and consent to proceed');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const appId = `MOTA-${scheme.shortName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4)}-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`;
      toast.success('Application submitted!', { description: `Your application ID is ${appId}` });
      router.push(`/student/applications/${appId}`);
    }, 1200);
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <StudentLayout>
      <PageHeader
        title={`Apply: ${scheme.name}`}
        description={`Application for Academic Year 2026–27`}
        backUrl="/student/scholarships"
        backLabel="Back to Scholarships"
      />

      {/* Stepper */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5 mb-3" />
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide pb-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const completed = i < step;
            const current = i === step;
            return (
              <div key={i} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs transition-all',
                    completed && 'border-primary bg-primary text-primary-foreground',
                    current && 'border-primary bg-primary text-primary-foreground',
                    !completed && !current && 'border-border bg-card text-muted-foreground'
                  )}>
                    {completed ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <span className={cn('text-[9px] font-medium text-center leading-tight hidden sm:block', current ? 'text-primary' : 'text-muted-foreground')}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div className={cn('h-0.5 w-4 sm:w-8 mx-0.5 rounded-full', completed ? 'bg-primary' : 'bg-border')} />}
              </div>
            );
          })}
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          {/* Step 0: Scheme Overview */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Scheme Overview</h3>
              <p className="text-sm text-muted-foreground">{scheme.description}</p>
              <div>
                <p className="text-sm font-medium mb-2">Who can apply:</p>
                <ul className="space-y-1">
                  {scheme.eligibility.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Benefits</p>
                  <p className="text-sm font-medium">{scheme.benefits}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Application Period</p>
                  <p className="text-sm font-medium">{scheme.applicationPeriod}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Personal Details</h3>
              <p className="text-xs text-muted-foreground">Fields are pre-filled from your profile.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Full Name</Label>
                  <Input defaultValue={STUDENT_PROFILE.name} readOnly className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label className="text-xs">Mobile Number</Label>
                  <Input defaultValue={STUDENT_PROFILE.mobile} readOnly className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label className="text-xs">State</Label>
                  <Input defaultValue={STUDENT_PROFILE.state} readOnly className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label className="text-xs">District</Label>
                  <Input defaultValue={STUDENT_PROFILE.district} readOnly className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label className="text-xs">APAAR ID</Label>
                  <Input defaultValue={STUDENT_PROFILE.apaarId} readOnly className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label className="text-xs">OTR ID</Label>
                  <Input defaultValue={STUDENT_PROFILE.otrId} readOnly className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label className="text-xs">Aadhaar (masked)</Label>
                  <Input defaultValue={STUDENT_PROFILE.aadhaarDisplay} readOnly className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label className="text-xs">Guardian Name</Label>
                  <Input defaultValue={STUDENT_PROFILE.guardianName} readOnly className="mt-1 bg-muted/50" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education & Institution */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Education & Institution Details</h3>
              <div className="grid gap-3">
                <div>
                  <Label className="text-xs">Current Education</Label>
                  <Input defaultValue={STUDENT_PROFILE.education} readOnly className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label className="text-xs">Institution Name</Label>
                  <Input defaultValue={STUDENT_PROFILE.institution} readOnly className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label className="text-xs">Annual Family Income</Label>
                  <Input defaultValue={`₹${STUDENT_PROFILE.familyIncome.toLocaleString('en-IN')}`} readOnly className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label className="text-xs">Bank Account (masked)</Label>
                  <Input defaultValue={STUDENT_PROFILE.bankDisplay} readOnly className="mt-1 bg-muted/50" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Document Checklist */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Document Checklist</h3>
              <p className="text-xs text-muted-foreground">Verified wallet documents are shown automatically. Upload any missing documents.</p>
              <div className="space-y-2">
                {scheme.documents.map((docType) => {
                  const doc = STUDENT_DOCUMENTS.find((d) => d.type === docType);
                  const status = doc?.status || 'PENDING';
                  return (
                    <div key={docType} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{docType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {status === 'VERIFIED' ? (
                          <StatusBadge label="Verified" colorClass="bg-success/10 text-success border-success/30" />
                        ) : status === 'EXPIRED' || status === 'ACTION_REQUIRED' ? (
                          <>
                            <StatusBadge label={DOCUMENT_STATUS_LABELS[status]} colorClass={DOCUMENT_STATUS_COLORS[status]} />
                            <Button size="sm" variant="outline">Upload</Button>
                          </>
                        ) : status === 'PENDING' || status === 'UPLOADED' ? (
                          <StatusBadge label={DOCUMENT_STATUS_LABELS[status]} colorClass={DOCUMENT_STATUS_COLORS[status]} />
                        ) : (
                          <Button size="sm" variant="outline">Upload</Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Conflict Check */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Scholarship Conflict Check</h3>
              <p className="text-sm text-muted-foreground">We check your active scholarship records to detect potential overlaps.</p>
              {hasConflict ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">Possible Scholarship Conflict Detected</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        An active {activeScholarships[0]?.schemeName} record was found for academic year 2026–27.
                        Your case requires policy review before a new benefit can be sanctioned.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-destructive/30 text-destructive">
                      Request Policy Review
                    </Button>
                    <Button size="sm" variant="ghost">Proceed anyway</Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-success/30 bg-success/5 p-4 flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-success">No Conflicts Found</p>
                    <p className="text-sm text-muted-foreground mt-1">No active scholarship records conflict with this application.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Declaration & Consent */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Declaration & Consent</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Checkbox checked={declaration} onCheckedChange={(v) => setDeclaration(!!v)} className="mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    I confirm that the information provided is true and I understand that scholarship eligibility is subject to verification.
                  </span>
                </label>
                <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    I consent to verification of the selected data for this scholarship application.
                  </span>
                </label>
              </div>
              <div className="rounded-lg border border-info/20 bg-info/5 p-3 flex items-start gap-2">
                <Info className="h-4 w-4 text-info flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">Your consent can be revoked at any time from the Consents page. All verification activities are logged.</p>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Review & Submit</h3>
              <div className="space-y-3">
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Scheme</span><span className="font-medium">{scheme.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Applicant</span><span className="font-medium">{STUDENT_PROFILE.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Education</span><span className="font-medium">{STUDENT_PROFILE.education}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Institution</span><span className="font-medium">{STUDENT_PROFILE.institution}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Income</span><span className="font-medium">₹{STUDENT_PROFILE.familyIncome.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Documents</span><span className="font-medium">{scheme.documents.length} required</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Conflict</span><span className={hasConflict ? 'text-destructive font-medium' : 'text-success font-medium'}>{hasConflict ? 'Detected' : 'None'}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Declaration</span><span className={declaration ? 'text-success font-medium' : 'text-destructive font-medium'}>{declaration ? 'Accepted' : 'Pending'}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Consent</span><span className={consent ? 'text-success font-medium' : 'text-destructive font-medium'}>{consent ? 'Granted' : 'Pending'}</span></div>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submitting || !declaration || !consent}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          )}

          {/* Navigation */}
          {step < 6 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <Button variant="ghost" size="sm" onClick={prev} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button size="sm" onClick={next}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </StudentLayout>
  );
}
