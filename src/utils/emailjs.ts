import emailjs from "@emailjs/browser";

const SERVICE_ID = "REPLACE_WITH_YOUR_SERVICE_ID";
const TEMPLATE_ID = "REPLACE_WITH_YOUR_TEMPLATE_ID";
const PUBLIC_KEY = "REPLACE_WITH_YOUR_PUBLIC_KEY";

export async function sendContactEmail(data: { name: string; email: string; subject: string; message: string }): Promise<boolean> {
  if (SERVICE_ID.startsWith("REPLACE")) {
    console.warn("EmailJS not configured. Replace SERVICE_ID, TEMPLATE_ID, and PUBLIC_KEY in src/utils/emailjs.ts");
    return false;
  }
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
      to_name: "Onesim",
    }, PUBLIC_KEY);
    return true;
  } catch (err) {
    console.error("EmailJS error:", err);
    return false;
  }
}
