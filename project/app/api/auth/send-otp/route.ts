import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const DEMO_MOBILES = new Set(['9876543210', '9999999999']);
const DEMO_OTP = '123456';
const OTP_TTL_MINUTES = 5;

function generateOtp(mobile: string): string {
  // Demo/judge accounts always use the fixed OTP for repeatable testing.
  if (DEMO_MOBILES.has(mobile)) return DEMO_OTP;
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    if (!mobile || typeof mobile !== 'string' || !MOBILE_REGEX.test(mobile)) {
      return NextResponse.json(
        { error: 'Enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const otp = generateOtp(mobile);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    const existingUser = await prisma.user.findUnique({ where: { mobile } });

    await prisma.otpChallenge.create({
      data: {
        mobile,
        otp,
        expiresAt,
        userId: existingUser?.id,
      },
    });

    // This is a mock sandbox — no real SMS gateway is wired up, so the OTP
    // is echoed back for prototype/demo purposes only.
    return NextResponse.json({
      success: true,
      message: 'OTP sent (mock sandbox — no real SMS is dispatched).',
      mockOtp: otp,
      expiresInSeconds: OTP_TTL_MINUTES * 60,
      isNewUser: !existingUser,
    });
  } catch (err) {
    console.error('send-otp error', err);
    return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 });
  }
}
