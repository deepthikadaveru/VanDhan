'use client';

import Link from 'next/link';
import {
  GraduationCap,
  LayoutDashboard,
  Brain,
  Wallet,
  Banknote,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Lock,
  FileCheck,
  Users,
  Sparkles,
  School,
  Award,
  FlaskConical,
  Plane,
  Leaf,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PrototypeBanner } from '@/components/shared/mock-badge';
import { SCHEMES } from '@/lib/mock-data/schemes';

const FEATURES = [
  { icon: LayoutDashboard, title: 'One Unified Dashboard', desc: 'Track all five MoTA scholarships, applications, verifications and payments in one place.' },
  { icon: Brain, title: 'Smart Eligibility Check', desc: 'Answer a few questions to discover which scholarships you qualify for — instantly.' },
  { icon: Wallet, title: 'Digital Document Wallet', desc: 'Store, reuse and verify documents through DigiLocker. No repeated uploads.' },
  { icon: Banknote, title: 'Transparent DBT Tracking', desc: 'Follow every rupee from sanction to your bank account with real-time DBT status.' },
  { icon: MessageCircle, title: 'JAGO Multilingual Support', desc: 'Get help in English, Hindi and Gondi from JAGO, your scholarship guide.' },
];

const STEPS = [
  { icon: Users, label: 'Create Profile', desc: 'Verify your identity with one-time setup' },
  { icon: Brain, label: 'Check Eligibility', desc: 'Find scholarships matched to you' },
  { icon: FileCheck, label: 'Apply & Verify', desc: 'Submit once, documents are reused' },
  { icon: Banknote, label: 'Receive & Track', desc: 'Track payments from sanction to credit' },
];

const SCHEME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  School,
  GraduationCap,
  Award,
  FlaskConical,
  Plane,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PrototypeBanner />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight">VanDhan ScholarConnect</span>
              <p className="text-[11px] text-muted-foreground">Ministry of Tribal Affairs Scholarship Services</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Student Login</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-1.5">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-pattern">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="h-3 w-3 mr-1" />
              SIH 2026 · Smart Automation
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
              Every Tribal Student Deserves a Clear Path to Their Scholarship.
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground text-balance">
              Discover, apply, verify and track all MoTA scholarships from one trusted platform.
            </p>
            <p className="mt-2 text-sm text-muted-foreground italic">
              "One verified profile, one scholarship timeline, one trusted journey for every tribal student."
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Student Login
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Officer Login
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto gap-2">
                  Explore Scholarships
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-center mb-2">Everything in one place</h2>
        <p className="text-center text-muted-foreground mb-8 text-sm">Built for students, designed for transparency</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} className="group hover:shadow-lg transition-shadow border-border/60">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Scheme Overview */}
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Five Schemes. One Platform.</h2>
          <p className="text-center text-muted-foreground mb-8 text-sm">All Ministry of Tribal Affairs scholarship schemes unified</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SCHEMES.map((scheme) => {
              const Icon = SCHEME_ICONS[scheme.icon] || GraduationCap;
              return (
                <Card key={scheme.code} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">{scheme.shortName}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{scheme.targetGroup}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-center mb-2">How it works</h2>
        <p className="text-center text-muted-foreground mb-8 text-sm">Four simple steps from profile to payment</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative text-center">
                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{step.label}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-3 h-5 w-5 text-muted-foreground/40" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy & Consent */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/15 mb-4">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Your data. Your consent. Your control.</h2>
          <p className="text-primary-foreground/80 text-sm max-w-2xl mx-auto leading-relaxed">
            VanDhan ScholarConnect follows privacy-by-design principles. Your documents are encrypted and accessed only with your explicit consent. You can revoke access at any time. Every data access is recorded in an immutable audit log.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Leaf className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">VanDhan ScholarConnect</span>
              </div>
              <p className="text-xs text-muted-foreground">Ministry of Tribal Affairs, Government of India</p>
              <p className="text-xs text-muted-foreground mt-1">Problem Statement ID: 26238 · SIH 2026</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Quick Links</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground">Student Login</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Officer Login</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Helpdesk</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Accessibility</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Legal</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Terms of Use</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Hackathon Prototype · Synthetic Data Only · No live government integration · Built for SIH 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
