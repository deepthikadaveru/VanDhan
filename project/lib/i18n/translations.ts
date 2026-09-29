import type { Language } from '@/types';

type TranslationKey =
  | 'home'
  | 'applications'
  | 'wallet'
  | 'jago'
  | 'profile'
  | 'checkEligibility'
  | 'myDocuments'
  | 'trackPayments'
  | 'askJago'
  | 'studentLogin'
  | 'officerLogin'
  | 'exploreScholarships';

const translations: Record<Language, Partial<Record<TranslationKey, string>>> = {
  en: {
    home: 'Home',
    applications: 'Applications',
    wallet: 'Wallet',
    jago: 'JAGO',
    profile: 'Profile',
    checkEligibility: 'Check Eligibility',
    myDocuments: 'My Documents',
    trackPayments: 'Track Payments',
    askJago: 'Ask JAGO',
    studentLogin: 'Student Login',
    officerLogin: 'Officer Login',
    exploreScholarships: 'Explore Scholarships',
  },
  hi: {
    home: 'होम',
    applications: 'आवेदन',
    wallet: 'वॉलेट',
    jago: 'जागो',
    profile: 'प्रोफ़ाइल',
    checkEligibility: 'पात्रता जांचें',
    myDocuments: 'मेरे दस्तावेज़',
    trackPayments: 'भुगतान ट्रैक करें',
    askJago: 'जागो से पूछें',
    studentLogin: 'छात्र लॉगिन',
    officerLogin: 'अधिकारी लॉगिन',
    exploreScholarships: 'छात्रवृत्ति देखें',
  },
  gon: {
    home: 'Home',
    applications: 'Applications',
    wallet: 'Wallet',
    jago: 'JAGO',
    profile: 'Profile',
    checkEligibility: 'Check Eligibility',
    myDocuments: 'My Documents',
    trackPayments: 'Track Payments',
    askJago: 'Ask JAGO',
    studentLogin: 'Student Login',
    officerLogin: 'Officer Login',
    exploreScholarships: 'Explore Scholarships',
  },
};

export function t(key: TranslationKey, lang: Language = 'en'): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}
