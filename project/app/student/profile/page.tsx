'use client';

import { useState } from 'react';
import {
  User,
  MapPin,
  Users as UsersIcon,
  GraduationCap,
  Banknote,
  Eye,
  Settings,
  Edit,
  Save,
  X,
  CheckCircle2,
} from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { useAuth } from '@/lib/auth/auth-context';
import { STUDENT_PROFILE } from '@/lib/mock-data/seed';
import { LANGUAGES } from '@/lib/constants';
import type { Language } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SECTIONS = [
  { key: 'personal', label: 'Personal Details', icon: User },
  { key: 'address', label: 'Address & Domicile', icon: MapPin },
  { key: 'family', label: 'Family & Income', icon: UsersIcon },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'bank', label: 'Bank Details', icon: Banknote },
  { key: 'accessibility', label: 'Language & Accessibility', icon: Settings },
];

export default function ProfilePage() {
  const { language, setLanguage, textSize, setTextSize } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(STUDENT_PROFILE);

  const handleSave = () => {
    setEditing(false);
    toast.success('Profile saved', { description: 'Your changes have been updated.' });
  };

  return (
    <StudentLayout>
      <PageHeader
        title="My Profile"
        description="Your verified identity and scholarship profile"
        right={
          editing ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
              <Button size="sm" onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Save</Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
          )
        }
      />

      {/* Identity Card */}
      <Card className="mb-6 border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold">
              {profile.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.category} Student · {profile.age} years · {profile.gender}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs">APAAR: {profile.apaarId}</Badge>
                <Badge variant="outline" className="text-xs">OTR: {profile.otrId}</Badge>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Profile Completion</span>
              <span className="text-sm font-bold text-primary">{profile.profileCompletion}%</span>
            </div>
            <Progress value={profile.profileCompletion} className="h-1.5" />
          </div>
        </CardContent>
      </Card>

      {/* Profile Sections */}
      <div className="space-y-4">
        {/* Personal Details */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Personal Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Full Name</Label>
                <Input defaultValue={profile.name} readOnly={!editing} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Mobile</Label>
                <Input defaultValue={profile.mobile} readOnly={!editing} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input defaultValue={profile.email} readOnly={!editing} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Aadhaar (masked)</Label>
                <Input defaultValue={profile.aadhaarDisplay} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label className="text-xs">Age</Label>
                <Input defaultValue={String(profile.age)} readOnly={!editing} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Gender</Label>
                <Input defaultValue={profile.gender} readOnly={!editing} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Address & Domicile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label className="text-xs">Address</Label>
                <Input defaultValue={profile.address} readOnly={!editing} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">State</Label>
                <Input defaultValue={profile.state} readOnly={!editing} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">District</Label>
                <Input defaultValue={profile.district} readOnly={!editing} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family & Income */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Family & Income</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Guardian Name</Label>
                <Input defaultValue={profile.guardianName} readOnly={!editing} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Guardian Occupation</Label>
                <Input defaultValue={profile.guardianOccupation} readOnly={!editing} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Annual Family Income</Label>
                <Input defaultValue={`₹${profile.familyIncome.toLocaleString('en-IN')}`} readOnly={!editing} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <Input defaultValue={profile.category} readOnly={!editing} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Education</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label className="text-xs">Current Education</Label>
                <Input defaultValue={profile.education} readOnly={!editing} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Institution</Label>
                <Input defaultValue={profile.institution} readOnly={!editing} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Bank Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Bank Account (masked)</Label>
                <Input defaultValue={profile.bankDisplay} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label className="text-xs">Verification Status</Label>
                <div className="mt-1 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">Verified via PFMS</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Accessibility */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Language & Accessibility</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div>
              <Label className="text-xs mb-2 block">Language</Label>
              <div className="flex gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-lg border-2 px-4 py-2 transition-all',
                      language === lang.code ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <span className="text-sm font-medium">{lang.nativeLabel}</span>
                    <span className="text-[10px] text-muted-foreground">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs mb-2 block">Text Size</Label>
              <div className="flex gap-2">
                {[
                  { key: 'default', label: 'Default' },
                  { key: 'lg', label: 'Large' },
                  { key: 'xl', label: 'Extra Large' },
                ].map((ts) => (
                  <button
                    key={ts.key}
                    onClick={() => setTextSize(ts.key as 'default' | 'lg' | 'xl')}
                    className={cn(
                      'rounded-lg border-2 px-4 py-2 text-sm transition-all',
                      textSize === ts.key ? 'border-primary bg-primary/5 font-medium' : 'border-border hover:border-primary/30'
                    )}
                  >
                    {ts.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
