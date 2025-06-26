// pages/api/send-welcome-oauth.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { smtpConfig } from '@/lib/envConfig'

const transporter = nodemailer.createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: true,
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.password,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { email, html } = await request.json()

    if (!email || !html) {
      console.error('Email or HTML content is missing in the request body.')
      return NextResponse.json(
        { success: false, message: 'Email and HTML are required.' },
        { status: 400 },
      )
    }

    await transporter.sendMail({
      from: smtpConfig.fromEmail,
      to: email,
      subject: 'ברוך הבא ל-SpareBite!',
      html: html,
    })

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully.',
    })
  } catch (err) {
    console.error('Error sending welcome email:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to send welcome email.' },
      { status: 500 },
    )
  }
}
