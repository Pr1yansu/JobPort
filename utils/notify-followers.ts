import { db } from "@/config/db";
import { company } from "@/db/job-schema";
import { eq, inArray } from "drizzle-orm";
import { sendMail } from "./mail";
import { users } from "@/db/users-schema";

async function notifyFollowers(
  companyId: string,
  title: string,
  description: string
) {
  const companyRecord = await db
    .select({
      followers: company.followers,
    })
    .from(company)
    .where(eq(company.id, companyId))
    .limit(1);

  if (!companyRecord.length || !companyRecord[0].followers?.length) return;

  const followerEmails = await db
    .select({
      email: users.email,
    })
    .from(users)
    .where(inArray(users.id, companyRecord[0].followers));

  if (!followerEmails.length) return;

  const mailPromises = followerEmails.map((follower) =>
    sendMail({
      to: follower.email,
      subject: `New Job Posted: ${title}`,
      text: `A new job titled "${title}" has been posted.`,
      html: `<p>A new job titled "<strong>${title}</strong>" has been posted.</p><p>${description}</p>`,
    })
  );

  await Promise.all(mailPromises);
}

export { notifyFollowers };
