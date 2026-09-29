// Core domain types for VanDhan ScholarConnect

export type UserRole =
  | 'STUDENT'
  | 'INSTITUTION_OFFICER'
  | 'STATE_OFFICER'
  | 'MOTA_OFFICER'
  | 'HELPDESK_OFFICER'
  | 'ADMIN';

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'AUTO_VERIFICATION'
  | 'ACTION_REQUIRED'
  | 'INSTITUTION_REVIEW'
  | 'STATE_REVIEW'
  | 'MOTA_REVIEW'
  | 'SANCTIONED'
  | 'DBT_INITIATED'
  | 'CREDITED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'NOT_STARTED'
  | 'ELIGIBILITY_CHECK_REQUIRED';

export type DocumentStatus =
  | 'VERIFIED'
  | 'UPLOADED'
  | 'ACTION_REQUIRED'
  | 'EXPIRED'
  | 'PENDING'
  | 'REJECTED'
  | 'OPTIONAL';

export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'MISMATCH'
  | 'EXPIRED'
  | 'UNAVAILABLE'
  | 'MANUAL_REVIEW_REQUIRED'
  | 'REJECTED';

export type ConsentStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';

export type PaymentStatus =
  | 'CREDITED'
  | 'DBT_INITIATED'
  | 'PROCESSING'
  | 'FAILED'
  | 'PENDING';

export type ReviewCaseStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'ESCALATED'
  | 'PENDING';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type GrievanceStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export type NotificationType =
  | 'DEFICIENCY'
  | 'VERIFICATION'
  | 'PAYMENT'
  | 'ELIGIBILITY'
  | 'CONSENT'
  | 'CHATBOT'
  | 'APPLICATION'
  | 'GRIEVANCE';

export type SchemeCode = 'PRE_MATRIC' | 'POST_MATRIC' | 'TOP_CLASS' | 'NFST' | 'NOS';

export type Language = 'en' | 'hi' | 'gon';

export interface User {
  id: string;
  mobile: string;
  role: UserRole;
  name: string;
  state?: string;
  district?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  state: string;
  district: string;
  category: string;
  mobile: string;
  apaarId: string;
  otrId: string;
  aadhaarDisplay: string;
  bankDisplay: string;
  education: string;
  institution: string;
  familyIncome: number;
  language: Language;
  profileCompletion: number;
  disabilityCertificate?: boolean;
  netJrfQualified?: boolean;
  email?: string;
  address?: string;
  guardianName?: string;
  guardianOccupation?: string;
}

export interface ScholarshipScheme {
  code: SchemeCode;
  name: string;
  shortName: string;
  targetGroup: string;
  description: string;
  eligibility: string[];
  documents: string[];
  benefits: string;
  applicationPeriod: string;
  stages: string[];
  incomeThreshold: number;
  icon: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  type: string;
  source: string;
  status: DocumentStatus;
  lastUpdated: string;
  expiryDate?: string;
  verifiedBy?: string;
  fileName?: string;
  fileSize?: string;
}

export interface ScholarshipApplication {
  id: string;
  studentId: string;
  schemeCode: SchemeCode;
  schemeName: string;
  status: ApplicationStatus;
  submissionDate?: string;
  lastUpdated: string;
  amount?: number;
  academicYear: string;
  timeline: TimelineEvent[];
  verificationSummary: VerificationItem[];
  auditTrail: AuditEntry[];
}

export interface TimelineEvent {
  id: string;
  stage: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  description?: string;
}

export interface VerificationItem {
  id: string;
  field: string;
  status: VerificationStatus;
  applicationValue?: string;
  sourceValue?: string;
  notes?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details?: string;
}

export interface ScholarshipBenefit {
  id: string;
  studentId: string;
  schemeCode: SchemeCode;
  schemeName: string;
  academicYear: string;
  amount: number;
  status: PaymentStatus;
  transactionRef?: string;
  date: string;
  sanctionRef?: string;
  component?: string;
  bankStatus?: string;
}

export interface Notification {
  id: string;
  studentId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  date: string;
  actionUrl?: string;
}

export interface GrievanceTicket {
  id: string;
  studentId: string;
  category: string;
  subject: string;
  description: string;
  status: GrievanceStatus;
  createdAt: string;
  applicationId?: string;
  messages: GrievanceMessage[];
}

export interface GrievanceMessage {
  id: string;
  from: 'student' | 'officer';
  message: string;
  timestamp: string;
}

export interface ConsentRecord {
  id: string;
  studentId: string;
  source: string;
  dataTypes: string[];
  purpose: string;
  grantedDate: string;
  expiryDate: string;
  status: ConsentStatus;
}

export interface OfficerReviewCase {
  id: string;
  applicationId: string;
  studentName: string;
  scheme: string;
  issue: string;
  source: string;
  createdDate: string;
  sla: string;
  priority: Priority;
  status: ReviewCaseStatus;
  district: string;
  verificationComparison: {
    field: string;
    applicationValue: string;
    sourceValue: string;
    matchStatus: VerificationStatus;
  }[];
  studentExplanation?: string;
  documents: { type: string; status: DocumentStatus }[];
  auditTrail: AuditEntry[];
}

export interface OutreachInsight {
  district: string;
  enrolledStudents: number;
  beneficiaries: number;
  potentialEligible: number;
  coveragePercentage: number;
}

export interface OutreachCampaign {
  id: string;
  targetGroup: string;
  language: string;
  message: string;
  createdAt: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  resource: string;
  metadata: string;
  ipDevice: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  actions?: { label: string; url: string }[];
}

export interface IntegrationHealth {
  name: string;
  status: 'OPERATIONAL' | 'MOCK_SANDBOX' | 'DEGRADED' | 'OFFLINE';
  latency: number;
  lastChecked: string;
}

export interface EligibilityResult {
  schemeCode: SchemeCode;
  schemeName: string;
  status: 'ELIGIBLE_NOW' | 'LIKELY_ELIGIBLE' | 'NOT_ELIGIBLE_YET' | 'POSSIBLE_CONFLICT';
  reason: string;
  documentsRequired: string[];
  nextStep: string;
  hasConflict?: boolean;
}

export interface SchemeRuleVersion {
  schemeCode: SchemeCode;
  version: string;
  rules: {
    label: string;
    value: string;
    type: string;
  }[];
  publishedDate: string;
  status: 'PUBLISHED' | 'DRAFT';
}
