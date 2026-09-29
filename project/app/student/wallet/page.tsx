'use client';

import { useState } from 'react';
import {
  Wallet,
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  RefreshCw,
  Lock,
  Info,
} from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { MockSandboxBadge } from '@/components/shared/mock-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { DOCUMENT_STATUS_LABELS, DOCUMENT_STATUS_COLORS } from '@/lib/constants';
import { STUDENT_DOCUMENTS } from '@/lib/mock-data/seed';
import type { DocumentStatus, StudentDocument } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_ICONS: Record<DocumentStatus, React.ComponentType<{ className?: string }>> = {
  VERIFIED: CheckCircle2,
  UPLOADED: FileText,
  ACTION_REQUIRED: AlertCircle,
  EXPIRED: AlertCircle,
  PENDING: Clock,
  REJECTED: AlertCircle,
  OPTIONAL: Info,
};

export default function WalletPage() {
  const [documents, setDocuments] = useState<StudentDocument[]>(STUDENT_DOCUMENTS);
  const [digiLockerOpen, setDigiLockerOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [connecting, setConnecting] = useState(false);

  const verifiedCount = documents.filter((d) => d.status === 'VERIFIED').length;
  const needsAttention = documents.filter((d) => d.status === 'EXPIRED' || d.status === 'ACTION_REQUIRED').length;
  const uploadedCount = documents.filter((d) => d.status === 'UPLOADED' || d.status === 'PENDING').length;
  const completion = Math.round((verifiedCount / (documents.length - 1)) * 100); // exclude optional

  const handleDigiLockerConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setDigiLockerOpen(false);
      setDocuments((prev) =>
        prev.map((d) =>
          d.type === 'ST Certificate' || d.type === 'Domicile Certificate' || d.type === 'Class XII Marksheet'
            ? { ...d, status: 'VERIFIED', verifiedBy: 'DigiLocker Mock Adapter', lastUpdated: '25 Sep 2026' }
            : d
        )
      );
      toast.success('DigiLocker connected', { description: 'Your verified documents are now available in your wallet.' });
    }, 1200);
  };

  const handleUpload = () => {
    if (!uploadType.trim()) {
      toast.error('Please enter a document type');
      return;
    }
    const newDoc: StudentDocument = {
      id: `d${Date.now()}`,
      studentId: 'sp1',
      type: uploadType,
      source: 'Manual Upload',
      status: 'UPLOADED',
      lastUpdated: '25 Sep 2026',
      fileName: `${uploadType.toLowerCase().replace(/\s/g, '_')}.pdf`,
      fileSize: '1.5 MB',
    };
    setDocuments((prev) => [...prev, newDoc]);
    setUploadOpen(false);
    setUploadType('');
    toast.success('Document uploaded', { description: 'Your document is pending verification.' });
  };

  const filterDocs = (filter: string) => {
    if (filter === 'verified') return documents.filter((d) => d.status === 'VERIFIED');
    if (filter === 'attention') return documents.filter((d) => d.status === 'EXPIRED' || d.status === 'ACTION_REQUIRED');
    if (filter === 'uploaded') return documents.filter((d) => d.status === 'UPLOADED' || d.status === 'PENDING');
    return documents;
  };

  const renderDocCard = (doc: StudentDocument) => {
    const Icon = STATUS_ICONS[doc.status] || FileText;
    return (
      <Card key={doc.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', DOCUMENT_STATUS_COLORS[doc.status].split(' ').slice(0, 2).join(' '))}>
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{doc.type}</h4>
                <p className="text-xs text-muted-foreground">{doc.source}</p>
              </div>
            </div>
            <StatusBadge label={DOCUMENT_STATUS_LABELS[doc.status]} colorClass={DOCUMENT_STATUS_COLORS[doc.status]} />
          </div>
          <div className="space-y-1 text-xs text-muted-foreground mb-3">
            <div className="flex justify-between">
              <span>Last updated:</span>
              <span className="font-medium text-foreground">{doc.lastUpdated}</span>
            </div>
            {doc.expiryDate && (
              <div className="flex justify-between">
                <span>Expiry date:</span>
                <span className="font-medium text-destructive">{doc.expiryDate}</span>
              </div>
            )}
            {doc.verifiedBy && (
              <div className="flex justify-between">
                <span>Verified by:</span>
                <span className="font-medium text-foreground">{doc.verifiedBy}</span>
              </div>
            )}
            {doc.fileName && (
              <div className="flex justify-between">
                <span>File:</span>
                <span className="font-mono text-foreground">{doc.fileName}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 gap-1">
              <Eye className="h-3.5 w-3.5" />
              View
            </Button>
            <Button size="sm" variant="ghost" className="flex-1 gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Replace
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <StudentLayout>
      <PageHeader
        title="Document Wallet"
        description="Your verified documents in one secure place"
        right={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setDigiLockerOpen(true)}>
              <ShieldCheck className="h-4 w-4" />
              Connect DigiLocker
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        }
      />

      {/* Privacy note */}
      <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 flex items-center gap-2">
        <Lock className="h-4 w-4 text-primary flex-shrink-0" />
        <p className="text-xs text-muted-foreground">Your documents are encrypted and accessed only with your consent.</p>
      </div>

      {/* Completion */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Wallet Completion</span>
            </div>
            <span className="text-2xl font-bold text-primary">{completion}%</span>
          </div>
          <Progress value={completion} className="h-2" />
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span>{verifiedCount} verified</span>
            <span>{uploadedCount} uploaded</span>
            <span className="text-warning">{needsAttention} need attention</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="attention">Needs Attention</TabsTrigger>
          <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid gap-3 md:grid-cols-2">{filterDocs('all').map(renderDocCard)}</div>
        </TabsContent>
        <TabsContent value="verified">
          <div className="grid gap-3 md:grid-cols-2">{filterDocs('verified').map(renderDocCard)}</div>
        </TabsContent>
        <TabsContent value="attention">
          <div className="grid gap-3 md:grid-cols-2">
            {filterDocs('attention').length > 0 ? (
              filterDocs('attention').map(renderDocCard)
            ) : (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
                <p className="text-sm">All documents are verified. No action needed.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="uploaded">
          <div className="grid gap-3 md:grid-cols-2">
            {filterDocs('uploaded').length > 0 ? (
              filterDocs('uploaded').map(renderDocCard)
            ) : (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No uploaded documents pending verification.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* DigiLocker Consent Dialog */}
      <Dialog open={digiLockerOpen} onOpenChange={setDigiLockerOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle>Connect DigiLocker</DialogTitle>
                <DialogDescription>Grant access to your verified documents</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              VanDhan ScholarConnect requests access to selected education and identity documents.
            </p>
            <div className="space-y-2 rounded-lg border p-3">
              <p className="text-xs font-medium">Permissions requested:</p>
              {['View ST certificate', 'View academic marksheet', 'View domicile certificate', 'View issued documents'].map((p) => (
                <div key={p} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {p}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <MockSandboxBadge />
              <p className="text-xs text-muted-foreground">This is a mock DigiLocker integration.</p>
            </div>
            <p className="text-xs text-muted-foreground">
              You control your consent. You can revoke access at any time from the Consents page.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDigiLockerOpen(false)}>Cancel</Button>
            <Button onClick={handleDigiLockerConnect} disabled={connecting} className="gap-1.5">
              {connecting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Allow and Continue
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a PDF or image file for verification</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Document Type</label>
              <input
                type="text"
                placeholder="e.g. Income Certificate, Bonafide Certificate"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 5 MB</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload} className="gap-1.5">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}
