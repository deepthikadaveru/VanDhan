import type {
  StudentProfile,
  StudentDocument,
  ScholarshipApplication,
  ScholarshipBenefit,
  Notification,
  GrievanceTicket,
  ConsentRecord,
  OfficerReviewCase,
  OutreachInsight,
  AuditLog,
  User,
  IntegrationHealth,
} from '@/types';

// ─── Users ──────────────────────────────────────────────
export const USERS: User[] = [
  { id: 'u1', mobile: '9876543210', role: 'STUDENT', name: 'Asha Munda', state: 'Jharkhand', district: 'Khunti' },
  { id: 'u2', mobile: '9999999999', role: 'STATE_OFFICER', name: 'Anil Kumar', state: 'Jharkhand', district: 'Ranchi' },
];

// ─── Student Profile (Asha Munda) ──────────────────────
export const STUDENT_PROFILE: StudentProfile = {
  id: 'sp1',
  userId: 'u1',
  name: 'Asha Munda',
  age: 19,
  gender: 'Female',
  state: 'Jharkhand',
  district: 'Khunti',
  category: 'Scheduled Tribe',
  mobile: '9876543210',
  apaarId: 'APAAR-2026-1290',
  otrId: 'OTR-2026-9831',
  aadhaarDisplay: 'XXXX-XXXX-4521',
  bankDisplay: 'XXXX2345',
  education: 'B.A. Sociology, 1st Year',
  institution: "Ranchi Women's College",
  familyIncome: 220000,
  language: 'en',
  profileCompletion: 85,
  email: 'asha.munda@example.com',
  address: 'Block Murhu, Khunti, Jharkhand – 835210',
  guardianName: 'Biram Munda',
  guardianOccupation: 'Farmer',
};

// ─── Documents ──────────────────────────────────────────
export const STUDENT_DOCUMENTS: StudentDocument[] = [
  { id: 'd1', studentId: 'sp1', type: 'ST Certificate', source: 'DigiLocker (Mock)', status: 'VERIFIED', lastUpdated: '12 Jan 2026', verifiedBy: 'DigiLocker Mock Adapter' },
  { id: 'd2', studentId: 'sp1', type: 'Income Certificate', source: 'e-District (Mock)', status: 'EXPIRED', lastUpdated: '15 Mar 2025', expiryDate: '31 Mar 2026', verifiedBy: 'e-District Mock Adapter' },
  { id: 'd3', studentId: 'sp1', type: 'Domicile Certificate', source: 'DigiLocker (Mock)', status: 'VERIFIED', lastUpdated: '08 Feb 2026', verifiedBy: 'DigiLocker Mock Adapter' },
  { id: 'd4', studentId: 'sp1', type: 'Class XII Marksheet', source: 'CBSE (Mock)', status: 'VERIFIED', lastUpdated: '20 May 2026', verifiedBy: 'DigiLocker Mock Adapter' },
  { id: 'd5', studentId: 'sp1', type: 'Bonafide Certificate', source: 'Manual Upload', status: 'PENDING', lastUpdated: '05 Sep 2026', fileName: 'bonafide_rwc.pdf', fileSize: '1.2 MB' },
  { id: 'd6', studentId: 'sp1', type: 'Bank Account Proof', source: 'PFMS (Mock)', status: 'VERIFIED', lastUpdated: '10 Sep 2026', verifiedBy: 'PFMS Mock Adapter' },
  { id: 'd7', studentId: 'sp1', type: 'Disability Certificate', source: 'Optional', status: 'OPTIONAL', lastUpdated: '—' },
];

// ─── Applications ───────────────────────────────────────
export const STUDENT_APPLICATIONS: ScholarshipApplication[] = [
  {
    id: 'MOTA-PMS-2026-00124',
    studentId: 'sp1',
    schemeCode: 'POST_MATRIC',
    schemeName: 'Post-Matric Scholarship',
    status: 'INSTITUTION_REVIEW',
    submissionDate: '05 Sep 2026',
    lastUpdated: '2 hours ago',
    amount: 18500,
    academicYear: '2026–27',
    timeline: [
      { id: 't1', stage: 'Application Submitted', status: 'completed', date: '05 Sep 2026' },
      { id: 't2', stage: 'Auto-Verification', status: 'completed', date: '06 Sep 2026' },
      { id: 't3', stage: 'Institution Verification', status: 'current', date: '07 Sep 2026' },
      { id: 't4', stage: 'State / MoTA Review', status: 'pending' },
      { id: 't5', stage: 'Sanction', status: 'pending' },
      { id: 't6', stage: 'DBT Initiated', status: 'pending' },
      { id: 't7', stage: 'Payment Credited', status: 'pending' },
    ],
    verificationSummary: [
      { id: 'v1', field: 'ST Certificate', status: 'VERIFIED', applicationValue: 'JH-ST-2018-4421', sourceValue: 'Verified via DigiLocker' },
      { id: 'v2', field: 'Income Certificate', status: 'EXPIRED', applicationValue: 'INC-2025-110', sourceValue: 'Expired on 31 Mar 2026' },
      { id: 'v3', field: 'Academic Record', status: 'VERIFIED', applicationValue: 'Class XII — 78%', sourceValue: 'Verified via DigiLocker' },
      { id: 'v4', field: 'Institution Details', status: 'PENDING', applicationValue: "Ranchi Women's College", sourceValue: 'Pending institution confirmation' },
      { id: 'v5', field: 'Bank Details', status: 'VERIFIED', applicationValue: 'XXXX2345', sourceValue: 'Verified via PFMS' },
    ],
    auditTrail: [
      { id: 'a1', timestamp: '05 Sep 2026, 14:30 IST', actor: 'Asha Munda', action: 'Application submitted' },
      { id: 'a2', timestamp: '06 Sep 2026, 09:15 IST', actor: 'System', action: 'Academic record auto-verified' },
      { id: 'a3', timestamp: '06 Sep 2026, 09:16 IST', actor: 'System', action: 'Income certificate flagged as expired' },
      { id: 'a4', timestamp: '07 Sep 2026, 11:00 IST', actor: 'System', action: 'Institution officer assigned' },
    ],
  },
  {
    id: 'MOTA-TC-2026-00051',
    studentId: 'sp1',
    schemeCode: 'TOP_CLASS',
    schemeName: 'Top Class Education Scholarship',
    status: 'DRAFT',
    lastUpdated: '20 Sep 2026',
    academicYear: '2026–27',
    timeline: [],
    verificationSummary: [],
    auditTrail: [
      { id: 'a1', timestamp: '20 Sep 2026, 10:00 IST', actor: 'Asha Munda', action: 'Draft created' },
    ],
  },
  {
    id: 'MOTA-PM-2024-00890',
    studentId: 'sp1',
    schemeCode: 'PRE_MATRIC',
    schemeName: 'Pre-Matric Scholarship',
    status: 'COMPLETED',
    submissionDate: '15 Aug 2024',
    lastUpdated: '18 Aug 2026',
    amount: 12000,
    academicYear: '2024–25',
    timeline: [
      { id: 't1', stage: 'Application Submitted', status: 'completed', date: '15 Aug 2024' },
      { id: 't2', stage: 'Auto-Verification', status: 'completed', date: '16 Aug 2024' },
      { id: 't3', stage: 'School Verification', status: 'completed', date: '20 Aug 2024' },
      { id: 't4', stage: 'State Review', status: 'completed', date: '25 Aug 2024' },
      { id: 't5', stage: 'Sanction', status: 'completed', date: '10 Aug 2026' },
      { id: 't6', stage: 'DBT Initiated', status: 'completed', date: '15 Aug 2026' },
      { id: 't7', stage: 'Payment Credited', status: 'completed', date: '18 Aug 2026' },
    ],
    verificationSummary: [],
    auditTrail: [
      { id: 'a1', timestamp: '15 Aug 2024, 12:00 IST', actor: 'Asha Munda', action: 'Application submitted' },
      { id: 'a2', timestamp: '18 Aug 2026, 14:22 IST', actor: 'PFMS', action: 'Payment credited to account XXXX2345' },
    ],
  },
  {
    id: 'MOTA-NFST-2026-PENDING',
    studentId: 'sp1',
    schemeCode: 'NFST',
    schemeName: 'National Fellowship (NFST)',
    status: 'NOT_STARTED',
    lastUpdated: '—',
    academicYear: '2026–27',
    timeline: [],
    verificationSummary: [],
    auditTrail: [],
  },
  {
    id: 'MOTA-NOS-2026-PENDING',
    studentId: 'sp1',
    schemeCode: 'NOS',
    schemeName: 'National Overseas Scholarship (NOS)',
    status: 'ELIGIBILITY_CHECK_REQUIRED',
    lastUpdated: '—',
    academicYear: '2026–27',
    timeline: [],
    verificationSummary: [],
    auditTrail: [],
  },
];

// ─── Payments / Disbursements ───────────────────────────
export const STUDENT_PAYMENTS: ScholarshipBenefit[] = [
  {
    id: 'pay1',
    studentId: 'sp1',
    schemeCode: 'PRE_MATRIC',
    schemeName: 'Pre-Matric Scholarship',
    academicYear: '2024–25',
    amount: 12000,
    status: 'CREDITED',
    transactionRef: 'PFMS****7821',
    date: '18 Aug 2026',
    sanctionRef: 'SNC-PM-2024-00890',
    component: 'Maintenance + Tuition',
    bankStatus: 'Credited to A/c XXXX2345',
  },
  {
    id: 'pay2',
    studentId: 'sp1',
    schemeCode: 'POST_MATRIC',
    schemeName: 'Post-Matric Scholarship',
    academicYear: '2026–27',
    amount: 18500,
    status: 'PENDING',
    date: '—',
    component: 'Maintenance + Tuition',
    bankStatus: 'Awaiting sanction',
  },
];

// ─── Notifications ──────────────────────────────────────
export const STUDENT_NOTIFICATIONS: Notification[] = [
  { id: 'n1', studentId: 'sp1', type: 'DEFICIENCY', title: 'Income Certificate Needs Renewal', message: 'Your income certificate expired on 31 Mar 2026. Please renew it to continue verification.', read: false, date: '2 hours ago', actionUrl: '/student/deficiencies/MOTA-PMS-2026-00124' },
  { id: 'n2', studentId: 'sp1', type: 'VERIFICATION', title: 'Institution Verification Started', message: "Ranchi Women's College has started verifying your Post-Matric application.", read: false, date: '5 hours ago' },
  { id: 'n3', studentId: 'sp1', type: 'PAYMENT', title: 'Payment Credited', message: '₹12,000 credited for Pre-Matric Scholarship (2024–25) on 18 Aug 2026.', read: true, date: '7 days ago', actionUrl: '/student/payments' },
  { id: 'n4', studentId: 'sp1', type: 'ELIGIBILITY', title: 'Eligibility Opportunity Discovered', message: 'You may be eligible for Top Class Education Scholarship. Check eligibility now.', read: false, date: '1 day ago', actionUrl: '/student/eligibility' },
  { id: 'n5', studentId: 'sp1', type: 'CONSENT', title: 'Consent Expiring', message: 'Your DigiLocker document access consent expires in 30 days. Review your consents.', read: false, date: '2 days ago', actionUrl: '/student/consents' },
  { id: 'n6', studentId: 'sp1', type: 'CHATBOT', title: 'JAGO Reminder', message: 'JAGO can help you resolve your income certificate deficiency. Ask JAGO.', read: true, date: '3 days ago', actionUrl: '/student/jago' },
  { id: 'n7', studentId: 'sp1', type: 'APPLICATION', title: 'Application Submitted', message: 'Your Post-Matric Scholarship application (MOTA-PMS-2026-00124) was submitted successfully.', read: true, date: '20 days ago' },
  { id: 'n8', studentId: 'sp1', type: 'GRIEVANCE', title: 'Grievance Update', message: 'Your grievance GRV-2026-0042 has been picked up by the helpdesk.', read: true, date: '5 days ago', actionUrl: '/student/grievances' },
];

// ─── Grievances ─────────────────────────────────────────
export const STUDENT_GRIEVANCES: GrievanceTicket[] = [
  {
    id: 'GRV-2026-0042',
    studentId: 'sp1',
    category: 'Payment delay',
    subject: 'Pre-Matric payment delayed beyond expected timeline',
    description: 'My Pre-Matric Scholarship payment for 2024-25 was expected by 10 Aug 2026 but was credited on 18 Aug. Requesting clarification on the delay.',
    status: 'IN_PROGRESS',
    createdAt: '12 Aug 2026',
    applicationId: 'MOTA-PM-2024-00890',
    messages: [
      { id: 'gm1', from: 'student', message: 'Payment was delayed by 8 days. Please clarify.', timestamp: '12 Aug 2026, 10:30 IST' },
      { id: 'gm2', from: 'officer', message: 'We have checked with PFMS. The delay was due to bank verification. Payment has now been credited. Closing this ticket as resolved.', timestamp: '14 Aug 2026, 15:00 IST' },
    ],
  },
];

// ─── Consents ───────────────────────────────────────────
export const STUDENT_CONSENTS: ConsentRecord[] = [
  { id: 'c1', studentId: 'sp1', source: 'DigiLocker', dataTypes: ['ST Certificate', 'Academic Marksheet', 'Domicile Certificate'], purpose: 'Document verification for scholarship applications', grantedDate: '10 Jan 2026', expiryDate: '10 Jan 2027', status: 'ACTIVE' },
  { id: 'c2', studentId: 'sp1', source: 'e-District', dataTypes: ['Income Certificate'], purpose: 'Income verification for scholarship eligibility', grantedDate: '15 Mar 2025', expiryDate: '15 Mar 2026', status: 'EXPIRED' },
  { id: 'c3', studentId: 'sp1', source: 'PFMS / DBT', dataTypes: ['Bank Account Status'], purpose: 'Bank account verification for DBT payment', grantedDate: '01 Sep 2026', expiryDate: '01 Sep 2027', status: 'ACTIVE' },
  { id: 'c4', studentId: 'sp1', source: 'NSP / OTR', dataTypes: ['Scholarship History'], purpose: 'Conflict detection across scholarship records', grantedDate: '05 Sep 2026', expiryDate: '05 Sep 2027', status: 'ACTIVE' },
];

// ─── Officer Review Cases ───────────────────────────────
export const OFFICER_REVIEW_CASES: OfficerReviewCase[] = [
  {
    id: 'RC-2026-001',
    applicationId: 'MOTA-PMS-2026-00124',
    studentName: 'Asha Munda',
    scheme: 'Post-Matric Scholarship',
    issue: 'Income certificate expired',
    source: 'e-District (Mock)',
    createdDate: '06 Sep 2026',
    sla: '3 days remaining',
    priority: 'HIGH',
    status: 'OPEN',
    district: 'Khunti',
    verificationComparison: [
      { field: 'Income Certificate No.', applicationValue: 'INC-2025-110', sourceValue: 'INC-2025-110', matchStatus: 'VERIFIED' },
      { field: 'Income Certificate Expiry', applicationValue: 'Not provided', sourceValue: 'Expired on 31 Mar 2026', matchStatus: 'EXPIRED' },
      { field: 'Family Income', applicationValue: '₹2,20,000', sourceValue: '₹2,20,000', matchStatus: 'VERIFIED' },
    ],
    studentExplanation: 'I was not aware the certificate had expired. I will renew it immediately.',
    documents: [
      { type: 'ST Certificate', status: 'VERIFIED' },
      { type: 'Income Certificate', status: 'EXPIRED' },
      { type: 'Class XII Marksheet', status: 'VERIFIED' },
      { type: 'Bank Account Proof', status: 'VERIFIED' },
    ],
    auditTrail: [
      { id: 'a1', timestamp: '06 Sep 2026, 09:16 IST', actor: 'System', action: 'Auto-verification flagged expired income certificate' },
      { id: 'a2', timestamp: '06 Sep 2026, 09:17 IST', actor: 'System', action: 'Officer review case created' },
    ],
  },
  {
    id: 'RC-2026-002',
    applicationId: 'MOTA-PMS-2026-00231',
    studentName: 'Birsa Hembram',
    scheme: 'Post-Matric Scholarship',
    issue: 'Name mismatch between certificate and application',
    source: 'DigiLocker (Mock)',
    createdDate: '04 Sep 2026',
    sla: '1 day overdue',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    district: 'Gumla',
    verificationComparison: [
      { field: 'Student Name', applicationValue: 'Birsa Hembram', sourceValue: 'Birsa Hembrm', matchStatus: 'MISMATCH' },
      { field: 'ST Certificate', applicationValue: 'JH-ST-2019-3398', sourceValue: 'JH-ST-2019-3398', matchStatus: 'VERIFIED' },
    ],
    studentExplanation: 'Typographical error in application. Please allow correction.',
    documents: [
      { type: 'ST Certificate', status: 'VERIFIED' },
      { type: 'Income Certificate', status: 'VERIFIED' },
    ],
    auditTrail: [
      { id: 'a1', timestamp: '04 Sep 2026, 10:00 IST', actor: 'System', action: 'Name mismatch detected' },
      { id: 'a2', timestamp: '04 Sep 2026, 10:05 IST', actor: 'Officer Anil Kumar', action: 'Case assigned for review' },
    ],
  },
  {
    id: 'RC-2026-003',
    applicationId: 'MOTA-PMS-2026-00345',
    studentName: 'Suniti Kisku',
    scheme: 'Post-Matric Scholarship',
    issue: 'Active scholarship conflict detected',
    source: 'NSP (Mock)',
    createdDate: '03 Sep 2026',
    sla: '5 days remaining',
    priority: 'HIGH',
    status: 'OPEN',
    district: 'Ranchi',
    verificationComparison: [
      { field: 'Active Scholarship', applicationValue: 'None declared', sourceValue: 'Pre-Matric active (NSP)', matchStatus: 'MISMATCH' },
      { field: 'Academic Year', applicationValue: '2026–27', sourceValue: '2026–27', matchStatus: 'VERIFIED' },
    ],
    studentExplanation: 'I was not aware that my old Pre-Matric record is still active.',
    documents: [
      { type: 'ST Certificate', status: 'VERIFIED' },
      { type: 'Income Certificate', status: 'VERIFIED' },
    ],
    auditTrail: [
      { id: 'a1', timestamp: '03 Sep 2026, 14:00 IST', actor: 'System', action: 'Scholarship conflict detected via NSP' },
    ],
  },
  {
    id: 'RC-2026-004',
    applicationId: 'MOTA-PMS-2026-00467',
    studentName: 'Dhananjay Soren',
    scheme: 'Post-Matric Scholarship',
    issue: 'Bank account validation failure',
    source: 'PFMS (Mock)',
    createdDate: '02 Sep 2026',
    sla: '2 days overdue',
    priority: 'HIGH',
    status: 'OPEN',
    district: 'Dumka',
    verificationComparison: [
      { field: 'Bank Account', applicationValue: 'XXXX2345', sourceValue: 'Account inactive', matchStatus: 'MISMATCH' },
      { field: 'IFSC Code', applicationValue: 'SBIN0001234', sourceValue: 'SBIN0001234', matchStatus: 'VERIFIED' },
    ],
    studentExplanation: 'My bank account was reactivated yesterday. Please re-verify.',
    documents: [
      { type: 'Bank Account Proof', status: 'ACTION_REQUIRED' },
    ],
    auditTrail: [
      { id: 'a1', timestamp: '02 Sep 2026, 11:00 IST', actor: 'PFMS Mock Adapter', action: 'Bank account validation failed' },
    ],
  },
  {
    id: 'RC-2026-005',
    applicationId: 'MOTA-PMS-2026-00589',
    studentName: 'Pooja Tudu',
    scheme: 'Post-Matric Scholarship',
    issue: 'Institution verification overdue',
    source: 'AISHE (Mock)',
    createdDate: '01 Sep 2026',
    sla: '4 days overdue',
    priority: 'MEDIUM',
    status: 'ESCALATED',
    district: 'Simdega',
    verificationComparison: [
      { field: 'Institution', applicationValue: 'St. Xavier College, Simdega', sourceValue: 'Pending response', matchStatus: 'MANUAL_REVIEW_REQUIRED' },
    ],
    studentExplanation: 'My college has not responded to the verification request.',
    documents: [
      { type: 'Bonafide Certificate', status: 'PENDING' },
    ],
    auditTrail: [
      { id: 'a1', timestamp: '01 Sep 2026, 09:00 IST', actor: 'System', action: 'Institution verification request sent' },
      { id: 'a2', timestamp: '05 Sep 2026, 09:00 IST', actor: 'Officer Anil Kumar', action: 'Escalated to MoTA' },
    ],
  },
  {
    id: 'RC-2026-006',
    applicationId: 'MOTA-TC-2026-00033',
    studentName: 'Ravi Murmu',
    scheme: 'Top Class Education Scholarship',
    issue: 'Institution not in notified list',
    source: 'AISHE (Mock)',
    createdDate: '28 Aug 2026',
    sla: '7 days remaining',
    priority: 'LOW',
    status: 'OPEN',
    district: 'Khunti',
    verificationComparison: [
      { field: 'Institution', applicationValue: 'Private Engineering College', sourceValue: 'Not in notified list', matchStatus: 'MISMATCH' },
    ],
    studentExplanation: 'I believe my institution was recently added to the notified list.',
    documents: [
      { type: 'Admission Letter', status: 'UPLOADED' },
    ],
    auditTrail: [
      { id: 'a1', timestamp: '28 Aug 2026, 10:00 IST', actor: 'System', action: 'Institution not found in notified list' },
    ],
  },
];

// ─── Outreach Insights ──────────────────────────────────
export const OUTREACH_INSIGHTS: OutreachInsight[] = [
  { district: 'Khunti', enrolledStudents: 3240, beneficiaries: 2105, potentialEligible: 312, coveragePercentage: 64.9 },
  { district: 'Ranchi', enrolledStudents: 4820, beneficiaries: 3102, potentialEligible: 408, coveragePercentage: 64.4 },
  { district: 'Gumla', enrolledStudents: 2680, beneficiaries: 1450, potentialEligible: 215, coveragePercentage: 54.1 },
  { district: 'Dumka', enrolledStudents: 2980, beneficiaries: 1560, potentialEligible: 198, coveragePercentage: 52.3 },
  { district: 'Simdega', enrolledStudents: 1710, beneficiaries: 755, potentialEligible: 115, coveragePercentage: 44.2 },
];

// ─── Audit Logs ─────────────────────────────────────────
export const AUDIT_LOGS: AuditLog[] = [
  { id: 'al1', timestamp: '25 Sep 2026, 10:15 IST', actor: 'Asha Munda', role: 'STUDENT', action: 'Granted DigiLocker consent', resource: 'ConsentRecord', metadata: 'source=DigiLocker, types=[ST, Marksheet, Domicile]', ipDevice: 'Android / 106.51.x.x' },
  { id: 'al2', timestamp: '25 Sep 2026, 10:16 IST', actor: 'System', role: 'ADMIN', action: 'Requested income verification', resource: 'VerificationRequest', metadata: 'adapter=EDistrictMockAdapter', ipDevice: 'Server' },
  { id: 'al3', timestamp: '25 Sep 2026, 10:16 IST', actor: 'e-District Mock Adapter', role: 'ADMIN', action: 'Returned expired certificate', resource: 'VerificationResult', metadata: 'status=EXPIRED, expiry=2026-03-31', ipDevice: 'Server' },
  { id: 'al4', timestamp: '24 Sep 2026, 14:30 IST', actor: 'Anil Kumar', role: 'STATE_OFFICER', action: 'Requested correction on case RC-2026-001', resource: 'OfficerReviewCase', metadata: 'comment=Income certificate needs renewal', ipDevice: 'Desktop / 49.36.x.x' },
  { id: 'al5', timestamp: '24 Sep 2026, 14:31 IST', actor: 'System', role: 'ADMIN', action: 'Student notification sent', resource: 'Notification', metadata: 'type=DEFICIENCY, student=Asha Munda', ipDevice: 'Server' },
  { id: 'al6', timestamp: '23 Sep 2026, 09:00 IST', actor: 'Asha Munda', role: 'STUDENT', action: 'Uploaded bonafide certificate', resource: 'StudentDocument', metadata: 'file=bonafide_rwc.pdf, size=1.2MB', ipDevice: 'Android / 106.51.x.x' },
  { id: 'al7', timestamp: '22 Sep 2026, 16:45 IST', actor: 'System', role: 'ADMIN', action: 'Scholarship conflict detected', resource: 'ScholarshipApplication', metadata: 'student=Birsa Hembram, conflict=Pre-Matric active', ipDevice: 'Server' },
  { id: 'al8', timestamp: '21 Sep 2026, 11:20 IST', actor: 'Anil Kumar', role: 'STATE_OFFICER', action: 'Escalated case RC-2026-005 to MoTA', resource: 'OfficerReviewCase', metadata: 'reason=Institution verification overdue', ipDevice: 'Desktop / 49.36.x.x' },
  { id: 'al9', timestamp: '20 Sep 2026, 10:00 IST', actor: 'Asha Munda', role: 'STUDENT', action: 'Created draft application for Top Class Scholarship', resource: 'ScholarshipApplication', metadata: 'id=MOTA-TC-2026-00051', ipDevice: 'Android / 106.51.x.x' },
  { id: 'al10', timestamp: '18 Sep 2026, 14:22 IST', actor: 'PFMS Mock Adapter', role: 'ADMIN', action: 'Payment credited', resource: 'Disbursement', metadata: 'amount=₹12,000, ref=PFMS****7821', ipDevice: 'Server' },
  { id: 'al11', timestamp: '17 Sep 2026, 12:00 IST', actor: 'Asha Munda', role: 'STUDENT', action: 'Revoked e-District consent', resource: 'ConsentRecord', metadata: 'reason=Certificate expired, no longer needed', ipDevice: 'Android / 106.51.x.x' },
  { id: 'al12', timestamp: '15 Sep 2026, 09:30 IST', actor: 'System', role: 'ADMIN', action: 'Outreach campaign created', resource: 'OutreachCampaign', metadata: 'district=Simdega, target=Class XI-XII ST students', ipDevice: 'Server' },
];

// ─── Integration Health ─────────────────────────────────
export const INTEGRATION_HEALTH: IntegrationHealth[] = [
  { name: 'DigiLocker', status: 'OPERATIONAL', latency: 412, lastChecked: '2 min ago' },
  { name: 'NSP / OTR', status: 'MOCK_SANDBOX', latency: 680, lastChecked: '2 min ago' },
  { name: 'SFMP / Canara Bank', status: 'MOCK_SANDBOX', latency: 720, lastChecked: '2 min ago' },
  { name: 'NOS Portal', status: 'MOCK_SANDBOX', latency: 850, lastChecked: '2 min ago' },
  { name: 'UDISE+ / APAAR', status: 'OPERATIONAL', latency: 390, lastChecked: '2 min ago' },
  { name: 'e-District', status: 'OPERATIONAL', latency: 520, lastChecked: '2 min ago' },
  { name: 'PFMS / DBT', status: 'MOCK_SANDBOX', latency: 610, lastChecked: '2 min ago' },
  { name: 'AISHE', status: 'OPERATIONAL', latency: 450, lastChecked: '2 min ago' },
  { name: 'UGC-NTA / NET-JRF', status: 'OPERATIONAL', latency: 480, lastChecked: '2 min ago' },
];

// ─── Additional Mock Students for Officer Views ─────────
export const MOCK_STUDENTS: { id: string; name: string; district: string; scheme: string; status: string; applicationId: string; age: number; education: string; income: number }[] = [
  { id: 's1', name: 'Asha Munda', district: 'Khunti', scheme: 'Post-Matric', status: 'INSTITUTION_REVIEW', applicationId: 'MOTA-PMS-2026-00124', age: 19, education: 'B.A. 1st Year', income: 220000 },
  { id: 's2', name: 'Birsa Hembram', district: 'Gumla', scheme: 'Post-Matric', status: 'ACTION_REQUIRED', applicationId: 'MOTA-PMS-2026-00231', age: 20, education: 'B.Sc. 2nd Year', income: 180000 },
  { id: 's3', name: 'Suniti Kisku', district: 'Ranchi', scheme: 'Post-Matric', status: 'ACTION_REQUIRED', applicationId: 'MOTA-PMS-2026-00345', age: 18, education: 'Class XII', income: 200000 },
  { id: 's4', name: 'Dhananjay Soren', district: 'Dumka', scheme: 'Post-Matric', status: 'ACTION_REQUIRED', applicationId: 'MOTA-PMS-2026-00467', age: 21, education: 'B.Tech 3rd Year', income: 240000 },
  { id: 's5', name: 'Pooja Tudu', district: 'Simdega', scheme: 'Post-Matric', status: 'INSTITUTION_REVIEW', applicationId: 'MOTA-PMS-2026-00589', age: 19, education: 'B.Com 1st Year', income: 190000 },
  { id: 's6', name: 'Ravi Murmu', district: 'Khunti', scheme: 'Top Class', status: 'AUTO_VERIFICATION', applicationId: 'MOTA-TC-2026-00033', age: 20, education: 'B.Tech 1st Year', income: 350000 },
  { id: 's7', name: 'Meena Hansda', district: 'Ranchi', scheme: 'Pre-Matric', status: 'COMPLETED', applicationId: 'MOTA-PM-2026-00112', age: 15, education: 'Class X', income: 150000 },
  { id: 's8', name: 'Kiran Marandi', district: 'Gumla', scheme: 'Post-Matric', status: 'SANCTIONED', applicationId: 'MOTA-PMS-2026-00678', age: 22, education: 'M.A. 1st Year', income: 210000 },
  { id: 's9', name: 'Suresh Besra', district: 'Dumka', scheme: 'NFST', status: 'MOTA_REVIEW', applicationId: 'MOTA-NFST-2026-00011', age: 25, education: 'PhD 1st Year', income: 400000 },
  { id: 's10', name: 'Anita Bedia', district: 'Simdega', scheme: 'Post-Matric', status: 'CREDITED', applicationId: 'MOTA-PMS-2026-00789', age: 20, education: 'B.A. 2nd Year', income: 170000 },
  { id: 's11', name: 'Mohan Laguri', district: 'Khunti', scheme: 'Post-Matric', status: 'DRAFT', applicationId: 'MOTA-PMS-2026-00890', age: 18, education: 'Class XII', income: 230000 },
  { id: 's12', name: 'Lakshmi Mardi', district: 'Ranchi', scheme: 'Top Class', status: 'SUBMITTED', applicationId: 'MOTA-TC-2026-00044', age: 19, education: 'B.Sc 1st Year', income: 500000 },
  { id: 's13', name: 'Bharat Kisku', district: 'Gumla', scheme: 'Pre-Matric', status: 'COMPLETED', applicationId: 'MOTA-PM-2026-00223', age: 14, education: 'Class IX', income: 140000 },
  { id: 's14', name: 'Geeta Murmu', district: 'Dumka', scheme: 'Post-Matric', status: 'DBT_INITIATED', applicationId: 'MOTA-PMS-2026-00901', age: 21, education: 'B.Ed 1st Year', income: 200000 },
  { id: 's15', name: 'Sita Soren', district: 'Simdega', scheme: 'Post-Matric', status: 'REJECTED', applicationId: 'MOTA-PMS-2026-01012', age: 23, education: 'M.Com 1st Year', income: 700000 },
];
