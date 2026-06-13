import { Resend } from "resend";
import prisma from "../config/db.js";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Service to send an email via Resend and log the transaction.
 * 
 * @param {Object} params - The email details (to, subject, html, text)
 * @param {string} userId - The ID of the user sending the email
 * @param {string} apiKeyId - The ID of the API key used
 */
export const sendEmail = async ({ to, subject, html, text }, userId, apiKeyId) => {
  try {
    // 1. Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: "MailForge <onboarding@resend.dev>", // Default Resend test domain
      to,
      subject,
      html: html || text,
    });

    if (error) {
      throw new Error(`Resend Error: ${error.message}`);
    }

    // 2. Log the email in the database
    const log = await prisma.emailLog.create({
      data: {
        from: from || "onboarding@resend.dev",
        to,
        subject,
        status: "sent",
        providerId: data.id,
        userId: userId,
      },
    });

    return { log, resendData: data };
  } catch (error) {
    // Log failed attempts too
    await prisma.emailLog.create({
      data: {
        to,
        subject,
        status: "failed",
        userId: userId,
      },
    });
    
    throw error;
  }
};

/**
 * Retrieves the email history for a specific user.
 */
export const getEmailHistory = async (userId) => {
  return await prisma.emailLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};
