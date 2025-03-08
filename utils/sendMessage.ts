import nodemailer from "nodemailer";

const sendMessage = async (name: string, email: string, message: string) => {
  const userEmail = process.env.EMAIL_USER;
  const userPassword = process.env.EMAIL_PASSWORD;
  const myEmail = process.env.MY_EMAIL;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: userPassword,
      },
    });

    const info = await transporter.sendMail({
      from: name,
      to: myEmail,
      subject: email,
      text: message,
    });

    console.log("message success :", info);
  } catch (error) {
    console.log("message : ", error);
  }
};

export default sendMessage;
