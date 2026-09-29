import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp, name } = await req.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { error: 'Mobile number and OTP are required.' },
        { status: 400 }
      );
    }

    const challenge = await prisma.otpChallenge.findFirst({
      where: { mobile, otp, consumed: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 401 });
    }

    if (challenge.expiresAt < new Date()) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 401 });
    }

    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { consumed: true },
    });

    let user = await prisma.user.findUnique({ where: { mobile } });

    if (!user) {
      // First-time sign-in: auto-provision a STUDENT account.
      // Officer/admin roles are provisioned manually via seed/admin tooling.
      user = await prisma.user.create({
        data: {
          mobile,
          role: 'STUDENT',
          name: name || 'New Student',
        },
      });

      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          name: user.name,
          age: 18,
          gender: 'Other',
          state: '',
          district: '',
          category: 'ST',
          mobile,
          apaarId: `APAAR-${user.id.slice(0, 10).toUpperCase()}`,
          otrId: `OTR-${user.id.slice(0, 10).toUpperCase()}`,
          aadhaarDisplay: 'Not linked',
          bankDisplay: 'Not linked',
          education: '',
          institutionName: '',
          familyIncome: 0,
          profileCompletion: 10,
        },
      });
    }

    await createSession(user.id);

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actor: user.name,
        role: user.role,
        action: 'LOGIN',
        resource: 'auth/verify-otp',
        ipDevice: req.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        mobile: user.mobile,
        role: user.role,
        name: user.name,
        state: user.state,
        district: user.district,
      },
    });
  } catch (err) {
    console.error('verify-otp error', err);
    return NextResponse.json({ error: 'Failed to verify OTP.' }, { status: 500 });
  }
}
