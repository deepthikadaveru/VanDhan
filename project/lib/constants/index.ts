import type {
  ApplicationStatus,
  DocumentStatus,
  NotificationType,
  PaymentStatus,
  Priority,
  ReviewCaseStatus,
  SchemeCode,
  VerificationStatus,
  UserRole,
  Language,
} from '@/types';

export const DEMO_CREDENTIALS = {
  studentMobile: '9876543210',
  officerMobile: '9999999999',
  otp: '123456',
};

export const ACADEMIC_YEAR = '2026–27';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'gon', label: 'Gondi', nativeLabel: 'गोंडी' },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: 'Student',
  INSTITUTION_OFFICER: 'Institution Officer',
  STATE_OFFICER: 'State Officer',
  MOTA_OFFICER: 'MoTA Officer',
  HELPDESK_OFFICER: 'Helpdesk Officer',
  ADMIN: 'Administrator',
};

export const APPLICATION_STATUS_FLOW: ApplicationStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'AUTO_VERIFICATION',
  'INSTITUTION_REVIEW',
  'STATE_REVIEW',
  'MOTA_REVIEW',
  'SANCTIONED',
  'DBT_INITIATED',
  'CREDITED',
  'COMPLETED',
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  AUTO_VERIFICATION: 'Auto-Verification',
  ACTION_REQUIRED: 'Action Required',
  INSTITUTION_REVIEW: 'Institution Review',
  STATE_REVIEW: 'State Review',
  MOTA_REVIEW: 'MoTA Review',
  SANCTIONED: 'Sanctioned',
  DBT_INITIATED: 'DBT Initiated',
  CREDITED: 'Payment Credited',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  NOT_STARTED: 'Not Started',
  ELIGIBILITY_CHECK_REQUIRED: 'Eligibility Check Required',
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  DRAFT: 'bg-muted text-muted-foreground border-border',
  SUBMITTED: 'bg-info/10 text-info border-info/30',
  AUTO_VERIFICATION: 'bg-info/10 text-info border-info/30',
  ACTION_REQUIRED: 'bg-warning/10 text-warning border-warning/30',
  INSTITUTION_REVIEW: 'bg-info/10 text-info border-info/30',
  STATE_REVIEW: 'bg-info/10 text-info border-info/30',
  MOTA_REVIEW: 'bg-info/10 text-info border-info/30',
  SANCTIONED: 'bg-accent/10 text-accent-foreground border-accent/30',
  DBT_INITIATED: 'bg-accent/10 text-accent-foreground border-accent/30',
  CREDITED: 'bg-success/10 text-success border-success/30',
  REJECTED: 'bg-destructive/10 text-destructive border-destructive/30',
  COMPLETED: 'bg-success/10 text-success border-success/30',
  NOT_STARTED: 'bg-muted text-muted-foreground border-border',
  ELIGIBILITY_CHECK_REQUIRED: 'bg-warning/10 text-warning border-warning/30',
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  VERIFIED: 'Verified',
  UPLOADED: 'Uploaded',
  ACTION_REQUIRED: 'Action Required',
  EXPIRED: 'Expired',
  PENDING: 'Pending Verification',
  REJECTED: 'Rejected',
  OPTIONAL: 'Optional',
};

export const DOCUMENT_STATUS_COLORS: Record<DocumentStatus, string> = {
  VERIFIED: 'bg-success/10 text-success border-success/30',
  UPLOADED: 'bg-info/10 text-info border-info/30',
  ACTION_REQUIRED: 'bg-warning/10 text-warning border-warning/30',
  EXPIRED: 'bg-destructive/10 text-destructive border-destructive/30',
  PENDING: 'bg-info/10 text-info border-info/30',
  REJECTED: 'bg-destructive/10 text-destructive border-destructive/30',
  OPTIONAL: 'bg-muted text-muted-foreground border-border',
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  MISMATCH: 'Mismatch',
  EXPIRED: 'Expired',
  UNAVAILABLE: 'Unavailable',
  MANUAL_REVIEW_REQUIRED: 'Manual Review',
  REJECTED: 'Rejected',
};

export const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  PENDING: 'bg-info/10 text-info border-info/30',
  VERIFIED: 'bg-success/10 text-success border-success/30',
  MISMATCH: 'bg-destructive/10 text-destructive border-destructive/30',
  EXPIRED: 'bg-destructive/10 text-destructive border-destructive/30',
  UNAVAILABLE: 'bg-muted text-muted-foreground border-border',
  MANUAL_REVIEW_REQUIRED: 'bg-purple-100 text-purple-700 border-purple-300',
  REJECTED: 'bg-destructive/10 text-destructive border-destructive/30',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  CREDITED: 'Credited',
  DBT_INITIATED: 'DBT Initiated',
  PROCESSING: 'Processing',
  FAILED: 'Failed / Needs Bank Verification',
  PENDING: 'Pending',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  CREDITED: 'bg-success/10 text-success border-success/30',
  DBT_INITIATED: 'bg-accent/10 text-accent-foreground border-accent/30',
  PROCESSING: 'bg-info/10 text-info border-info/30',
  FAILED: 'bg-destructive/10 text-destructive border-destructive/30',
  PENDING: 'bg-warning/10 text-warning border-warning/30',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  HIGH: 'bg-destructive/10 text-destructive border-destructive/30',
  MEDIUM: 'bg-warning/10 text-warning border-warning/30',
  LOW: 'bg-info/10 text-info border-info/30',
};

export const REVIEW_CASE_STATUS_LABELS: Record<ReviewCaseStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  ESCALATED: 'Escalated',
  PENDING: 'Pending',
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  DEFICIENCY: 'Deficiency',
  VERIFICATION: 'Verification',
  PAYMENT: 'Payment',
  ELIGIBILITY: 'Eligibility',
  CONSENT: 'Consent',
  CHATBOT: 'Chatbot',
  APPLICATION: 'Application',
  GRIEVANCE: 'Grievance',
};

export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
  DEFICIENCY: 'AlertCircle',
  VERIFICATION: 'ShieldCheck',
  PAYMENT: 'Banknote',
  ELIGIBILITY: 'Sparkles',
  CONSENT: 'Lock',
  CHATBOT: 'MessageCircle',
  APPLICATION: 'FileText',
  GRIEVANCE: 'LifeBuoy',
};

export const SCHEME_CODES: SchemeCode[] = [
  'PRE_MATRIC',
  'POST_MATRIC',
  'TOP_CLASS',
  'NFST',
  'NOS',
];

export const INTEGRATION_NAMES = [
  'DigiLocker',
  'NSP / OTR',
  'SFMP / Canara Bank',
  'NOS Portal',
  'UDISE+ / APAAR',
  'e-District',
  'PFMS / DBT',
  'AISHE',
  'UGC-NTA / NET-JRF',
] as const;
