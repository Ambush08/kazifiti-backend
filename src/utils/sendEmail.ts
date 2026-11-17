import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.FROM;

if (!apiKey || !from) {
  throw new Error("RESEND_API_KEY and FROM must be set");
}

const resend = new Resend(apiKey);

const sendEmail = async (to: string, subject: string, html: string) => {
  const { data, error } = await resend.emails.send({
    from: from,
    to: to,
    subject: subject,
    html: html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(`Error sending email: ${error.message}`);
  }

  return data;
};

export default sendEmail;
