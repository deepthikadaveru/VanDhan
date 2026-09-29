import { PrismaClient } from '@prisma/client';
import { SCHEMES, SCHEME_RULE_VERSIONS } from '../lib/mock-data/schemes';

const prisma = new PrismaClient();

const DEMO_STUDENT_MOBILE = '9876543210';
const DEMO_OFFICER_MOBILE = '9999999999';
const DEMO_OTP = '123456';

const INTEGRATIONS = [
  'DigiLocker',
  'NSP',
  'SFMP',
  'NOS',
  'UDISE+',
  'APAAR',
  'AISHE',
  'PFMS',
  'UGC-NTA',
  'eDistrict',
];

async function main() {
  console.log('Seeding VanDhan ScholarConnect demo data...');

  // ── Schemes + rule versions ────────────────────────────────
  for (const s of SCHEMES) {
    await prisma.scholarshipScheme.upsert({
      where: { code: s.code },
      update: {},
      create: {
        code: s.code,
        name: s.name,
        shortName: s.shortName,
        targetGroup: s.targetGroup,
        description: s.description,
        eligibility: s.eligibility,
        documents: s.documents,
        benefits: s.benefits,
        applicationPeriod: s.applicationPeriod,
        stages: s.stages,
        incomeThreshold: s.incomeThreshold,
        icon: s.icon,
      },
    });
  }

  for (const rv of SCHEME_RULE_VERSIONS) {
    await prisma.schemeRuleVersion.create({
      data: {
        schemeCode: rv.schemeCode,
        version: rv.version,
        rules: rv.rules,
        publishedDate: new Date(rv.publishedDate),
        status: rv.status,
      },
    });
  }

  // ── Institutions ────────────────────────────────────────────
  const institution = await prisma.institution.upsert({
    where: { code: 'INST-CHD-001' },
    update: {},
    create: {
      name: 'Government Polytechnic College, Jagdalpur',
      code: 'INST-CHD-001',
      state: 'Chhattisgarh',
      district: 'Bastar',
      type: 'Polytechnic',
    },
  });

  await prisma.institution.upsert({
    where: { code: 'INST-CHD-002' },
    update: {},
    create: {
      name: 'Government Higher Secondary School, Kondagaon',
      code: 'INST-CHD-002',
      state: 'Chhattisgarh',
      district: 'Kondagaon',
      type: 'School',
    },
  });

  // ── Integration health ──────────────────────────────────────
  for (const name of INTEGRATIONS) {
    await prisma.integrationHealth.upsert({
      where: { name },
      update: {},
      create: {
        name,
        status: 'MOCK_SANDBOX',
        latency: Math.floor(80 + Math.random() * 220),
      },
    });
  }

  // ── Outreach insights ───────────────────────────────────────
  const districts = [
    { district: 'Bastar', enrolledStudents: 4210, beneficiaries: 2890, potentialEligible: 5100, coveragePercentage: 57 },
    { district: 'Kondagaon', enrolledStudents: 1890, beneficiaries: 1120, potentialEligible: 2400, coveragePercentage: 47 },
    { district: 'Dantewada', enrolledStudents: 2560, beneficiaries: 1400, potentialEligible: 3800, coveragePercentage: 37 },
    { district: 'Sukma', enrolledStudents: 980, beneficiaries: 410, potentialEligible: 1950, coveragePercentage: 21 },
  ];
  for (const d of districts) {
    await prisma.outreachInsight.upsert({
      where: { district: d.district },
      update: {},
      create: d,
    });
  }

  // ── Demo student user + profile ─────────────────────────────
  const studentUser = await prisma.user.upsert({
    where: { mobile: DEMO_STUDENT_MOBILE },
    update: {},
    create: {
      mobile: DEMO_STUDENT_MOBILE,
      role: 'STUDENT',
      name: 'Sunita Netam',
      state: 'Chhattisgarh',
      district: 'Bastar',
      language: 'en',
    },
  });

  const student = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      name: 'Sunita Netam',
      age: 19,
      gender: 'Female',
      state: 'Chhattisgarh',
      district: 'Bastar',
      category: 'ST',
      mobile: DEMO_STUDENT_MOBILE,
      apaarId: 'APAAR-2026-CHD-004521',
      otrId: 'OTR-CHD-889213',
      aadhaarDisplay: 'XXXX XXXX 4521',
      bankDisplay: 'SBI •••• 7734',
      education: 'Diploma in Civil Engineering, 2nd Year',
      institutionId: institution.id,
      institutionName: institution.name,
      familyIncome: 145000,
      language: 'en',
      profileCompletion: 82,
      disabilityCertificate: false,
      netJrfQualified: false,
      email: 'sunita.netam@example.com',
      address: 'Village Kilepal, Bastar, Chhattisgarh',
      guardianName: 'Ramesh Netam',
      guardianOccupation: 'Farmer',
    },
  });

  // ── Documents ────────────────────────────────────────────────
  const documents = [
    { type: 'ST Certificate', source: 'eDistrict', status: 'VERIFIED', verifiedBy: 'eDistrict Portal' },
    { type: 'Income Certificate', source: 'eDistrict', status: 'VERIFIED', verifiedBy: 'eDistrict Portal' },
    { type: 'Domicile Certificate', source: 'eDistrict', status: 'VERIFIED', verifiedBy: 'eDistrict Portal' },
    { type: 'Aadhaar', source: 'DigiLocker', status: 'VERIFIED', verifiedBy: 'DigiLocker' },
    { type: 'Bonafide Certificate', source: 'Institution Upload', status: 'UPLOADED' },
    { type: 'Bank Passbook', source: 'PFMS', status: 'VERIFIED', verifiedBy: 'PFMS' },
    { type: 'Previous Marksheet', source: 'UDISE+', status: 'ACTION_REQUIRED' },
  ] as const;

  for (const d of documents) {
    await prisma.document.create({
      data: {
        studentId: student.id,
        type: d.type,
        source: d.source,
        status: d.status,
        verifiedBy: 'verifiedBy' in d ? d.verifiedBy : undefined,
        fileName: `${d.type.replace(/\s+/g, '_')}.pdf`,
        fileSize: '184 KB',
      },
    });
  }

  // ── Application (Post-Matric, in review) ────────────────────
  const application = await prisma.scholarshipApplication.create({
    data: {
      studentId: student.id,
      schemeCode: 'POST_MATRIC',
      status: 'INSTITUTION_REVIEW',
      submissionDate: new Date('2026-08-12'),
      amount: 18500,
      academicYear: '2026–27',
      timeline: {
        create: [
          { stage: 'Application Submitted', status: 'completed', date: new Date('2026-08-12'), order: 1 },
          { stage: 'Auto-Verification', status: 'completed', date: new Date('2026-08-13'), order: 2 },
          { stage: 'Institution Verification', status: 'current', date: new Date('2026-08-20'), order: 3 },
          { stage: 'State Review', status: 'pending', order: 4 },
          { stage: 'Sanction', status: 'pending', order: 5 },
          { stage: 'DBT Payment', status: 'pending', order: 6 },
        ],
      },
      verificationSummary: {
        create: [
          { field: 'Name', status: 'VERIFIED', applicationValue: 'Sunita Netam', sourceValue: 'Sunita Netam' },
          { field: 'Category (ST)', status: 'VERIFIED', applicationValue: 'ST', sourceValue: 'ST' },
          { field: 'Family Income', status: 'VERIFIED', applicationValue: '₹1,45,000', sourceValue: '₹1,45,000' },
          { field: 'Previous Marksheet', status: 'MANUAL_REVIEW_REQUIRED', applicationValue: '78%', sourceValue: 'Not found in UDISE+' },
        ],
      },
      auditTrail: {
        create: [
          { actor: 'Sunita Netam', action: 'Application submitted', timestamp: new Date('2026-08-12T10:15:00Z') },
          { actor: 'System', action: 'Auto-verification completed with 1 flag', timestamp: new Date('2026-08-13T02:00:00Z') },
          { actor: 'Institution Officer', action: 'Review started', timestamp: new Date('2026-08-20T09:00:00Z') },
        ],
      },
    },
  });

  // ── Officer review case for the same application ────────────
  await prisma.officerReviewCase.create({
    data: {
      applicationId: application.id,
      studentName: student.name,
      scheme: 'Post-Matric Scholarship for ST Students',
      issue: 'Previous marksheet not found in UDISE+ records',
      source: 'UDISE+',
      sla: '3 days remaining',
      priority: 'MEDIUM',
      status: 'OPEN',
      district: 'Bastar',
      verificationComparison: [
        { field: 'Previous Marksheet %', applicationValue: '78%', sourceValue: 'Not available', matchStatus: 'MANUAL_REVIEW_REQUIRED' },
      ],
      studentExplanation: 'Marksheet was issued by a school that recently migrated to UDISE+; requesting manual verification.',
      documents: [
        { type: 'Previous Marksheet', status: 'ACTION_REQUIRED' },
        { type: 'ST Certificate', status: 'VERIFIED' },
      ],
    },
  });

  // ── Second, older, completed application (Pre-Matric) ───────
  const oldApplication = await prisma.scholarshipApplication.create({
    data: {
      studentId: student.id,
      schemeCode: 'PRE_MATRIC',
      status: 'COMPLETED',
      submissionDate: new Date('2025-08-01'),
      amount: 3500,
      academicYear: '2025–26',
      timeline: {
        create: [
          { stage: 'Application Submitted', status: 'completed', date: new Date('2025-08-01'), order: 1 },
          { stage: 'Auto-Verification', status: 'completed', date: new Date('2025-08-03'), order: 2 },
          { stage: 'School Verification', status: 'completed', date: new Date('2025-08-10'), order: 3 },
          { stage: 'State Review', status: 'completed', date: new Date('2025-08-20'), order: 4 },
          { stage: 'Sanction', status: 'completed', date: new Date('2025-09-01'), order: 5 },
          { stage: 'DBT Payment', status: 'completed', date: new Date('2025-09-10'), order: 6 },
        ],
      },
    },
  });

  // ── Payments ─────────────────────────────────────────────────
  await prisma.payment.createMany({
    data: [
      {
        studentId: student.id,
        applicationId: oldApplication.id,
        schemeCode: 'PRE_MATRIC',
        academicYear: '2025–26',
        amount: 3500,
        status: 'CREDITED',
        transactionRef: 'TXN-2025-887412',
        date: new Date('2025-09-10'),
        sanctionRef: 'SANC-CHD-2025-4471',
        component: 'Maintenance Allowance',
        bankStatus: 'Credited to SBI •••• 7734',
      },
      {
        studentId: student.id,
        applicationId: application.id,
        schemeCode: 'POST_MATRIC',
        academicYear: '2026–27',
        amount: 18500,
        status: 'PENDING',
        component: 'Tuition + Maintenance',
      },
    ],
  });

  // ── Notifications ────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        studentId: student.id,
        type: 'VERIFICATION',
        title: 'Marksheet needs manual review',
        message: 'Your previous marksheet could not be auto-verified via UDISE+. An officer is reviewing it.',
        read: false,
        actionUrl: `/student/applications/${application.id}`,
      },
      {
        studentId: student.id,
        type: 'PAYMENT',
        title: 'Payment credited',
        message: '₹3,500 credited to your SBI account for Pre-Matric Scholarship 2025–26.',
        read: true,
      },
      {
        studentId: student.id,
        type: 'ELIGIBILITY',
        title: 'You may be eligible for NFST',
        message: 'Based on your profile, you could qualify for the National Fellowship once you begin M.Phil./PhD.',
        read: false,
      },
    ],
  });

  // ── Consents ─────────────────────────────────────────────────
  await prisma.consent.createMany({
    data: [
      {
        studentId: student.id,
        source: 'DigiLocker',
        dataTypes: ['Aadhaar', 'Education Certificates'],
        purpose: 'Identity and document verification for scholarship applications',
        expiryDate: new Date('2027-08-12'),
        status: 'ACTIVE',
      },
      {
        studentId: student.id,
        source: 'PFMS',
        dataTypes: ['Bank Account Status'],
        purpose: 'Verify bank account for DBT payments',
        expiryDate: new Date('2027-08-12'),
        status: 'ACTIVE',
      },
      {
        studentId: student.id,
        source: 'UDISE+',
        dataTypes: ['Academic Records'],
        purpose: 'Cross-verify academic marksheets',
        expiryDate: new Date('2026-12-01'),
        status: 'ACTIVE',
      },
    ],
  });

  // ── Grievance ────────────────────────────────────────────────
  const grievance = await prisma.grievance.create({
    data: {
      studentId: student.id,
      applicationId: application.id,
      category: 'Verification Delay',
      subject: 'Marksheet verification taking too long',
      description: 'It has been over a week and my previous marksheet is still under manual review.',
      status: 'IN_PROGRESS',
      messages: {
        create: [
          { from: 'student', message: 'Please check my application status, it has been delayed.', timestamp: new Date('2026-08-22T08:00:00Z') },
          { from: 'officer', message: 'We are cross-checking with the school directly; expect resolution within 3 working days.', timestamp: new Date('2026-08-22T14:30:00Z') },
        ],
      },
    },
  });
  void grievance;

  // ── Chat session ─────────────────────────────────────────────
  await prisma.chatSession.create({
    data: {
      studentId: student.id,
      messages: {
        create: [
          { role: 'user', content: 'What is the status of my application?' },
          {
            role: 'bot',
            content: 'Your Post-Matric Scholarship application is currently under Institution Review. One document (previous marksheet) needs manual verification.',
            actions: [{ label: 'View Application', url: `/student/applications/${application.id}` }],
          },
        ],
      },
    },
  });

  // ── Demo officer user ────────────────────────────────────────
  await prisma.user.upsert({
    where: { mobile: DEMO_OFFICER_MOBILE },
    update: {},
    create: {
      mobile: DEMO_OFFICER_MOBILE,
      role: 'INSTITUTION_OFFICER',
      name: 'Anil Kumar Verma',
      state: 'Chhattisgarh',
      district: 'Bastar',
      language: 'en',
    },
  });

  console.log('Seed complete.');
  console.log('Demo credentials:');
  console.log(`  Student — mobile: ${DEMO_STUDENT_MOBILE}, OTP: ${DEMO_OTP}`);
  console.log(`  Officer — mobile: ${DEMO_OFFICER_MOBILE}, OTP: ${DEMO_OTP}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
