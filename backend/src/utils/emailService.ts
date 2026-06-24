import nodemailer from "nodemailer";

export async function sendResetEmail(email: string, resetLink: string): Promise<boolean> {
  // Always log to the console so developers can test it easily
  console.log("\n==================================================");
  console.log(`PASSWORD RESET REQUEST FOR: ${email}`);
  console.log(`Reset Link: ${resetLink}`);
  console.log("==================================================\n");

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.log("SMTP environment variables not fully configured. Email was not sent via SMTP (logged to console above).");
    return true; // Return true as we successfully logged it to console for dev
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_FROM || `"EduQuest" <no-reply@eduquest.lk>`,
      to: email,
      subject: "Password Reset - EduQuest",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #3b82f6; text-align: center;">EduQuest Password Reset</h2>
          <p>Hello,</p>
          <p>You requested a password reset for your EduQuest account. Please click the button below to reset your password. This link is valid for 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button above does not work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;"><a href="${resetLink}">${resetLink}</a></p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p style="color: #64748b; font-size: 12px; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            This is an automated message, please do not reply.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset email successfully sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
}
