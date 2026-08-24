import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  console.log("========== SMTP DEBUG ==========");
  console.log("SMTP SERVICE:", process.env.SMTP_SERVICE);
  console.log("SMTP USER:", process.env.SMTP_USER);
  console.log(
    "SMTP PASSWORD LOADED:",
    Boolean(process.env.SMTP_PASSWORD)
  );
  console.log("================================");

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.verify();

  console.log("✅ SMTP connection successful");

  const mailOptions = {
    from: `"Crazy Fashion" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("✅ Email sent:", info.messageId);

  return info;
};

export default sendEmail;