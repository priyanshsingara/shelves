import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOTP } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate OTP
    const code = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTPs for this email
    await prisma.oTPVerification.deleteMany({
      where: { email },
    })

    // Create new OTP
    await prisma.oTPVerification.create({
      data: {
        email,
        code,
        expiresAt,
      },
    })

    // Send email
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key') {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      await resend.emails.send({
        from: 'linkink <noreply@yourdomain.com>',
        to: email,
        subject: 'Your linkink verification code',
        html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2D2D2D; font-size: 24px; margin-bottom: 20px;">Your verification code</h1>
            <p style="color: #6B6B6B; margin-bottom: 20px;">Enter this code to sign in to linkink:</p>
            <div style="background: #F5F5F0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2D2D2D;">${code}</span>
            </div>
            <p style="color: #9B9B9B; font-size: 14px;">This code expires in 10 minutes.</p>
          </div>
        `,
      })
    } else {
      // In development, log the OTP
      console.log(`\n📧 OTP for ${email}: ${code}\n`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 })
  }
}
