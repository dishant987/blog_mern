import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    // create a hashed token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour in milliseconds
      });
    } else if (emailType === "Resent Email") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour in milliseconds
      });
    }

    let transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject:
        emailType === "VERIFY" || emailType === "Resent Email"
          ? "Verify your email"
          : "Reset your password",
      html: `<p>Click <a href="${
        emailType === "RESET"
          ? `${process.env.DOMAIN}/forgotpassword?token=${hashedToken}`
          : `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
      }">here</a> to ${
        emailType === "VERIFY" || emailType === "Resent Email"
          ? "verify your email"
          : "reset your password"
      } or copy and paste the link below in your browser.</p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);

    return mailresponse;
  } catch (error) {
    console.log(error);
  }
};
