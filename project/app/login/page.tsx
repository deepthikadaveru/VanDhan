'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, GraduationCap, ShieldCheck, ArrowRight, Phone, KeyRound, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, verifyOtp } from '@/lib/auth/auth-context';
import { DEMO_CREDENTIALS } from '@/lib/constants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Role = 'student' | 'officer';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('student');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      toast.success('OTP sent', { description: `Demo OTP: ${DEMO_CREDENTIALS.otp}` });
    }, 600);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = verifyOtp(mobile, otp);
      setLoading(false);
      if (!user) {
        toast.error('Invalid OTP or unrecognised mobile number', { description: 'Use demo credentials shown below.' });
        return;
      }
      login(user);
      toast.success(`Welcome, ${user.name}!`);
      if (user.role === 'STUDENT') {
        router.push('/student/dashboard');
      } else {
        router.push('/officer/dashboard');
      }
    }, 500);
  };

  const fillDemo = () => {
    setMobile(role === 'student' ? DEMO_CREDENTIALS.studentMobile : DEMO_CREDENTIALS.officerMobile);
  };

  return (
    <div className="min-h-screen bg-hero-pattern flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold">VanDhan ScholarConnect</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={() => { setRole('student'); setMobile(''); setOtpSent(false); setOtp(''); }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                role === 'student' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'
              )}
            >
              <GraduationCap className={cn('h-6 w-6', role === 'student' ? 'text-primary' : 'text-muted-foreground')} />
              <span className={cn('text-sm font-medium', role === 'student' ? 'text-primary' : 'text-muted-foreground')}>Student</span>
            </button>
            <button
              onClick={() => { setRole('officer'); setMobile(''); setOtpSent(false); setOtp(''); }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                role === 'officer' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'
              )}
            >
              <ShieldCheck className={cn('h-6 w-6', role === 'officer' ? 'text-primary' : 'text-muted-foreground')} />
              <span className={cn('text-sm font-medium', role === 'officer' ? 'text-primary' : 'text-muted-foreground')}>Officer</span>
            </button>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                {role === 'student' ? 'Student Login' : 'Officer Login'}
              </CardTitle>
              <CardDescription>
                {otpSent
                  ? `Enter the OTP sent to +91 ${mobile}`
                  : `Enter your registered mobile number to continue`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!otpSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="10-digit mobile number"
                        className="pl-10"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="6-digit OTP"
                        className="pl-10 tracking-[0.3em] text-center text-lg font-semibold"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleVerifyOtp} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </Button>
                  <button
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Change mobile number
                  </button>
                </>
              )}

              {/* Demo Credentials Hint */}
              <div className="rounded-lg border border-info/20 bg-info/5 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-info">
                  <Info className="h-3.5 w-3.5" />
                  Demo Credentials
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Student mobile:</span>
                    <span className="font-mono font-semibold text-foreground">{DEMO_CREDENTIALS.studentMobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Officer mobile:</span>
                    <span className="font-mono font-semibold text-foreground">{DEMO_CREDENTIALS.officerMobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>OTP (all users):</span>
                    <span className="font-mono font-semibold text-foreground">{DEMO_CREDENTIALS.otp}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={fillDemo}>
                  Fill demo {role} number
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Demo environment — no real personal data is used.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
