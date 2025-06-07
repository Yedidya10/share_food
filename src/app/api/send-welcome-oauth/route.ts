// pages/api/send-welcome-oauth.ts
import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function POST(request: NextRequest) {
  console.log("Received request to send welcome email via OAuth");

  const { email, html } = await request.json();
  if (!email || !html) {
    console.error("Email or HTML content is missing in the request body.");
    return Response.json(
      { success: false, message: "Email is required." },
      { status: 400 }
    );
  }

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "ברוך הבא ל-Share Food!",
      html: html,
    });
    return Response.json({
      success: true,
      message: "Welcome email sent successfully.",
    });
  } catch (err: unknown) {
    console.error("Error sending welcome email:", err);
  }
}
