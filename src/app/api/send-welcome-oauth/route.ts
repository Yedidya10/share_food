// pages/api/send-welcome-oauth.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email, html } = await request.json();

    if (!email || !html) {
      console.error("Email or HTML content is missing in the request body.");
      return NextResponse.json(
        { success: false, message: "Email and HTML are required." },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "ברוך הבא ל-SpareBite!",
      html: html,
    });

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully.",
    });
  } catch (err) {
    console.error("Error sending welcome email:", err);
    return NextResponse.json(
      { success: false, message: "Failed to send welcome email." },
      { status: 500 }
    );
  }
}
