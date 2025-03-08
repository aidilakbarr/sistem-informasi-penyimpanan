import nodemailer from "nodemailer";

const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`;
    const subject = "Verify your email";
    const text = `<p>Click the link below to verify your email:</p>\n
    <a href="${verificationUrl}">${verificationUrl}</a>`;

    const info = await transporter.sendMail({
      from: "noreply",
      to: email,
      subject: subject,
      html: text,
    });
    console.log(info);
  } catch (error) {
    console.log("[SEND_EMAIL_VERIFICATION: ", error);
  }
};

export default sendVerificationEmail;
