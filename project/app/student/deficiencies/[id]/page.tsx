'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Upload, ShieldCheck, FileCheck, Send, ArrowRight } from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/shared/page-header';
import { MockSandboxBadge } from '@/components/shared/mock-badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DeficiencyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [explanation, setExplanation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!explanation.trim()) {
      toast.error('Please provide an explanation');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Correction submitted', { description: 'Your application timeline has been updated. A notification has been sent.' });
      router.push(`/student/applications/${params.id}`);
    }, 1000);
  };

  return (
    <StudentLayout>
      <PageHeader
        title="Resolve Deficiency"
        description={`For application: ${params.id}`}
        backUrl={`/student/applications/${params.id}`}
        backLabel="Back to Application"
      />

      {/* Deficiency Card */}
      <Card className="border-warning/30 bg-warning/5 mb-6">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Income Certificate Needs Renewal</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The submitted income certificate expired on 31 March 2026. Please renew it and upload the updated certificate to continue verification.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resolution Options */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold mb-1">Upload Renewed Certificate</h4>
            <p className="text-xs text-muted-foreground">Upload a PDF or image of your renewed income certificate</p>
            <Button size="sm" variant="outline" className="mt-3 gap-1">
              Upload <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10 text-info mx-auto mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold mb-1">Connect DigiLocker</h4>
            <p className="text-xs text-muted-foreground">Fetch your renewed certificate directly from DigiLocker</p>
            <Button size="sm" variant="outline" className="mt-3 gap-1">
              Connect <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning mx-auto mb-3">
              <FileCheck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold mb-1">Request Manual Review</h4>
            <p className="text-xs text-muted-foreground">Ask an officer to review your case manually</p>
            <Button size="sm" variant="outline" className="mt-3 gap-1">
              Request <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Explanation */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Student Explanation</CardTitle>
          <CardDescription>Provide a brief explanation for the deficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Label htmlFor="explanation" className="text-xs">Your explanation</Label>
              <Textarea
                id="explanation"
                placeholder="e.g. I was not aware the certificate had expired. I have applied for renewal and will upload it within 7 days."
                className="mt-1.5"
                rows={4}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 mb-4">
        <MockSandboxBadge />
        <span className="text-xs text-muted-foreground">Deficiency resolution is a prototype flow.</span>
      </div>

      <Button size="lg" className="w-full gap-2" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : (
          <>
            <Send className="h-4 w-4" />
            Submit Correction
          </>
        )}
      </Button>
    </StudentLayout>
  );
}
