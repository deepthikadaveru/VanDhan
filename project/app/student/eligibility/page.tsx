'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Brain, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, ShieldAlert, Info } from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/shared/page-header';
import { SCHEMES } from '@/lib/mock-data/schemes';
import { STUDENT_APPLICATIONS } from '@/lib/mock-data/seed';
import type { EligibilityResult, SchemeCode } from '@/types';
import { cn } from '@/lib/utils';

type AnswerKey = 'educationLevel' | 'institutionType' | 'income' | 'stCert' | 'activeScholarship' | 'overseas' | 'disability' | 'netJrf';

const QUESTIONS = [
  {
    key: 'educationLevel' as AnswerKey,
    label: 'Current education level',
    options: ['Class IX', 'Class X', 'Class XI/XII', 'Undergraduate', 'Postgraduate', 'PhD', 'Post-doctoral'],
  },
  {
    key: 'institutionType' as AnswerKey,
    label: 'Current institution type',
    options: ['School', 'College', 'University', 'Notified premier institution', 'Foreign university'],
  },
  {
    key: 'income' as AnswerKey,
    label: 'Annual family income',
    options: ['Below ₹2.5 lakh', '₹2.5–6 lakh', 'Above ₹6 lakh'],
  },
  {
    key: 'stCert' as AnswerKey,
    label: 'Do you have an ST/PVTG certificate?',
    options: ['Yes', 'No'],
  },
  {
    key: 'activeScholarship' as AnswerKey,
    label: 'Current scholarship status',
    options: ['No active scholarship', 'Active Pre-Matric', 'Active Post-Matric', 'Active Top Class', 'Active NFST', 'Active NOS'],
  },
  {
    key: 'overseas' as AnswerKey,
    label: 'Are you planning overseas study?',
    options: ['Yes', 'No'],
  },
  {
    key: 'disability' as AnswerKey,
    label: 'Disability certificate available? (optional)',
    options: ['Yes', 'No', 'Prefer not to say'],
    optional: true,
  },
  {
    key: 'netJrf' as AnswerKey,
    label: 'Are you NET/JRF qualified? (optional)',
    options: ['Yes', 'No'],
    optional: true,
  },
];

function assessEligibility(answers: Record<AnswerKey, string>): EligibilityResult[] {
  const results: EligibilityResult[] = [];
  const income = answers.income;
  const incomeLow = income === 'Below ₹2.5 lakh';
  const incomeMid = income === '₹2.5–6 lakh' || incomeLow;
  const edu = answers.educationLevel;
  const inst = answers.institutionType;
  const hasSt = answers.stCert === 'Yes';
  const activeScholarship = answers.activeScholarship;
  const overseas = answers.overseas === 'Yes';
  const netJrf = answers.netJrf === 'Yes';

  // Pre-Matric
  if ((edu === 'Class IX' || edu === 'Class X') && incomeLow && hasSt) {
    results.push({
      schemeCode: 'PRE_MATRIC', schemeName: 'Pre-Matric Scholarship',
      status: activeScholarship !== 'No active scholarship' && activeScholarship !== 'Active Pre-Matric' ? 'POSSIBLE_CONFLICT' : 'ELIGIBLE_NOW',
      reason: 'You are in Class IX/X with family income below ₹2.5 lakh and have a valid ST certificate.',
      documentsRequired: ['ST Certificate', 'Income Certificate', 'Bonafide Certificate', 'Bank Account Proof'],
      nextStep: 'Start your Pre-Matric Scholarship application.',
      hasConflict: activeScholarship !== 'No active scholarship' && activeScholarship !== 'Active Pre-Matric',
    });
  }

  // Post-Matric
  if ((['Class XI/XII', 'Undergraduate', 'Postgraduate'].includes(edu)) && incomeLow && hasSt) {
    results.push({
      schemeCode: 'POST_MATRIC', schemeName: 'Post-Matric Scholarship',
      status: activeScholarship === 'Active Post-Matric' ? 'POSSIBLE_CONFLICT' : 'LIKELY_ELIGIBLE',
      reason: 'You are pursuing post-matric education with income below ₹2.5 lakh and a valid ST certificate.',
      documentsRequired: ['ST Certificate', 'Income Certificate', 'Domicile Certificate', 'Previous Marksheet', 'Bonafide Certificate', 'Bank Account Proof'],
      nextStep: 'Start your Post-Matric Scholarship application.',
      hasConflict: activeScholarship === 'Active Post-Matric',
    });
  }

  // Top Class
  if (inst === 'Notified premier institution' && incomeMid && hasSt) {
    results.push({
      schemeCode: 'TOP_CLASS', schemeName: 'Top Class Education Scholarship',
      status: activeScholarship === 'Active Top Class' ? 'POSSIBLE_CONFLICT' : 'LIKELY_ELIGIBLE',
      reason: 'You are admitted to a notified premier institution with income within the threshold.',
      documentsRequired: ['ST Certificate', 'Income Certificate', 'Admission Letter', 'Bonafide Certificate', 'Bank Account Proof'],
      nextStep: 'Start your Top Class Education Scholarship application.',
      hasConflict: activeScholarship === 'Active Top Class',
    });
  }

  // NFST
  if (edu === 'PhD' && hasSt && netJrf) {
    results.push({
      schemeCode: 'NFST', schemeName: 'National Fellowship (NFST)',
      status: activeScholarship === 'Active NFST' ? 'POSSIBLE_CONFLICT' : 'LIKELY_ELIGIBLE',
      reason: 'You are a PhD candidate with ST status and NET/JRF qualification.',
      documentsRequired: ['ST Certificate', 'Income Certificate', 'NET/JRF Certificate', 'Registration Certificate', 'Bank Account Proof'],
      nextStep: 'Start your NFST application.',
      hasConflict: activeScholarship === 'Active NFST',
    });
  } else if (edu === 'PhD' && hasSt) {
    results.push({
      schemeCode: 'NFST', schemeName: 'National Fellowship (NFST)',
      status: 'NOT_ELIGIBLE_YET',
      reason: 'You are a PhD candidate with ST status but NET/JRF qualification is required for NFST.',
      documentsRequired: ['NET/JRF Certificate'],
      nextStep: 'Qualify NET/JRF to become eligible for NFST.',
    });
  }

  // NOS
  if (overseas && incomeMid && hasSt) {
    results.push({
      schemeCode: 'NOS', schemeName: 'National Overseas Scholarship (NOS)',
      status: activeScholarship === 'Active NOS' ? 'POSSIBLE_CONFLICT' : 'LIKELY_ELIGIBLE',
      reason: 'You are planning overseas study with income within the threshold and ST status.',
      documentsRequired: ['ST Certificate', 'Income Certificate', 'Foreign University Admission Letter', 'Passport Copy', 'Bank Account Proof'],
      nextStep: 'Start your NOS application after securing admission.',
      hasConflict: activeScholarship === 'Active NOS',
    });
  }

  // If no results and has active scholarship
  if (results.length === 0 && activeScholarship !== 'No active scholarship') {
    results.push({
      schemeCode: 'POST_MATRIC', schemeName: 'Post-Matric Scholarship',
      status: 'POSSIBLE_CONFLICT',
      reason: 'An active scholarship record may overlap with a new application. Your case requires policy review.',
      documentsRequired: ['ST Certificate', 'Income Certificate'],
      nextStep: 'Request a policy review to check if you can apply for another scheme.',
      hasConflict: true,
    });
  }

  return results;
}

const RESULT_CONFIG = {
  ELIGIBLE_NOW: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/5 border-success/20', label: 'Eligible Now' },
  LIKELY_ELIGIBLE: { icon: CheckCircle2, color: 'text-info', bg: 'bg-info/5 border-info/20', label: 'Likely Eligible — Needs Verification' },
  NOT_ELIGIBLE_YET: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/5 border-warning/20', label: 'Not Eligible Yet' },
  POSSIBLE_CONFLICT: { icon: ShieldAlert, color: 'text-destructive', bg: 'bg-destructive/5 border-destructive/20', label: 'Possible Scholarship Conflict' },
};

export default function EligibilityPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<AnswerKey, string>>({} as Record<AnswerKey, string>);
  const [results, setResults] = useState<EligibilityResult[] | null>(null);

  const totalSteps = QUESTIONS.length;
  const progress = results ? 100 : (step / totalSteps) * 100;

  const handleAnswer = (value: string) => {
    const q = QUESTIONS[step];
    const newAnswers = { ...answers, [q.key]: value };
    setAnswers(newAnswers);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setResults(assessEligibility(newAnswers));
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const reset = () => {
    setAnswers({} as Record<AnswerKey, string>);
    setStep(0);
    setResults(null);
  };

  if (results) {
    return (
      <StudentLayout>
        <PageHeader title="Eligibility Results" description="Based on your answers, here are the scholarships matched to you" />
        <div className="space-y-4 mb-6">
          {results.map((r, i) => {
            const config = RESULT_CONFIG[r.status];
            const Icon = config.icon;
            const scheme = SCHEMES.find((s) => s.code === r.schemeCode);
            return (
              <Card key={i} className={cn('border', config.bg)}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.color)} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{r.schemeName}</h3>
                        <Badge variant="outline" className={cn('text-xs', config.color, 'border-current')}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.reason}</p>
                    </div>
                  </div>
                  <div className="ml-8 space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Documents required:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {r.documentsRequired.map((d, j) => (
                          <Badge key={j} variant="outline" className="text-xs">{d}</Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Next step:</span> {r.nextStep}
                    </p>
                  </div>
                  <div className="ml-8 mt-3 flex gap-2">
                    {r.status !== 'NOT_ELIGIBLE_YET' && (
                      <Link href={`/student/apply/${r.schemeCode}`}>
                        <Button size="sm" className="gap-1">
                          Start Application
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                    {r.hasConflict && (
                      <Button size="sm" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                        Request Policy Review
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Button variant="outline" onClick={reset}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Run eligibility check again
        </Button>
      </StudentLayout>
    );
  }

  const currentQ = QUESTIONS[step];

  return (
    <StudentLayout>
      <PageHeader title="Eligibility Check" description="Answer a few questions to discover scholarships you qualify for" />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Question {step + 1} of {totalSteps}</span>
            <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-base">{currentQ.label}</h3>
            </div>
            {currentQ.optional && (
              <p className="text-xs text-muted-foreground mb-3">This question is optional — you can skip it.</p>
            )}
            <RadioGroup
              value={answers[currentQ.key] || ''}
              onValueChange={handleAnswer}
              className="space-y-2"
            >
              {currentQ.options.map((opt) => (
                <div key={opt} className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value={opt} id={opt} />
                  <Label htmlFor={opt} className="text-sm font-normal cursor-pointer flex-1">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            {step > 0 ? (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            ) : <div />}
            {currentQ.optional && (
              <Button variant="ghost" size="sm" onClick={() => handleAnswer('Skipped')}>
                Skip
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 max-w-2xl mx-auto rounded-lg border border-info/20 bg-info/5 p-3 flex items-start gap-2">
        <Info className="h-4 w-4 text-info flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          This is a rule-based eligibility assessment using prototype criteria. Final eligibility is determined during application verification.
        </p>
      </div>
    </StudentLayout>
  );
}
