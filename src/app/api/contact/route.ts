import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const to = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || "admin@ichaka.com.ng";
    const from = process.env.EMAIL_FROM || "admin@ichaka.com.ng";

    const hasSmtp = Boolean(process.env.SMTP_HOST);

    if (hasSmtp) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"ichaka.com.ng" <${from}>`,
        to,
        replyTo: email,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="border-bottom:1px solid #eee;padding-bottom:12px">New Contact Message</h2>
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Message:</strong></p>
            <p style="background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap">${message}</p>
          </div>
        `,
      });
    } else {
      // Dev fallback — log to console when SMTP is not configured
      console.log("\n[contact] New message (no SMTP configured):");
      console.log(`  From: ${name} <${email}>`);
      console.log(`  To: ${to}`);
      console.log(`  Message: ${message}\n`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

