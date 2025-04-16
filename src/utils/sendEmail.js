import nodemailer from "nodemailer";

async function sendEmail({
  to = [],
  cc,
  bcc,
  text,
  html,
  subject,
  attachments = [],
} = {}) {
  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    throw new Error("Missing EMAIL or EMAIL_PASSWORD environment variables");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // ⚠️ تجنبها قدر الإمكان في الإنتاج
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Tamam 👻" <${process.env.EMAIL}>`,
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      attachments,
    });

    console.log("✅ Message sent: %s", info.messageId);
    console.log(info);

    return info.rejected.length ? false : info;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return false;
  }
}

export default sendEmail;
