import { Resend } from "resend";
import env from "../env.js";

const apiKey = env.resendApi;
const from = env.from;

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
