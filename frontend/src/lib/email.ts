/**
 * Email notification utility.
 * Mirrors the FastAPI placeholder: logs the email content.
 * To send real emails, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars.
 */
import nodemailer from "nodemailer";

export const CHURCH_EMAIL =
  process.env.CHURCH_EMAIL || "pastorjamesdunham@gmail.com";

export async function sendEmailNotification(
  subject: string,
  body: string,
  toEmail: string = CHURCH_EMAIL
): Promise<boolean> {
  try {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "0", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      // No SMTP configured — log only (parity with FastAPI placeholder)
      console.log("EMAIL NOTIFICATION:");
      console.log(`To: ${toEmail}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);
      return true;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to: toEmail,
      subject,
      text: body,
    });
    return true;
  } catch (err) {
    console.error("Email notification failed:", err);
    return false;
  }
}
