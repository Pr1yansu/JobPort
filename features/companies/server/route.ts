import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/config/db";
import { company as Company } from "@/db/job-schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { companySchema } from "@/schema/job-schema";

const app = new Hono()
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const companyArray = await db
        .select()
        .from(Company)
        .where(eq(Company.id, id));

      if (companyArray.length === 0) {
        return c.json({
          success: false,
          message: "Company not found.",
          company: null,
        });
      }

      const [company] = companyArray;

      return c.json({
        success: true,
        company,
        message: "Company found.",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        message: "An error occurred.",
        company: null,
      });
    }
  })
  .delete("/delete/:id", async (c) => {
    try {
      const session = await auth();
      if (!session) {
        return c.json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const id = c.req.param("id");

      const existingCompanyArray = await db
        .select()
        .from(Company)
        .where(eq(Company.id, id));

      if (existingCompanyArray.length === 0) {
        return c.json({
          success: false,
          message: "Company not found.",
        });
      }

      const [company] = existingCompanyArray;

      if (session.user.role === "ADMIN") {
        await db.delete(Company).where(eq(Company.id, id));
      } else if (session.user.role === "RECRUITER") {
        if (company.createdBy !== session.user.id) {
          return c.json({
            success: false,
            message: "Unauthorized.",
          });
        }

        await db.delete(Company).where(eq(Company.id, id));
      } else {
        return c.json({
          success: false,
          message: "Unauthorized.",
        });
      }

      return c.json({
        success: true,
        message: "Company deleted successfully.",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        message: "An error occurred.",
      });
    }
  })
  .patch("follow/:id", async (c) => {
    try {
      const session = await auth();
      if (!session) {
        return c.json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const id = c.req.param("id");

      const existingCompanyArray = await db
        .select()
        .from(Company)
        .where(eq(Company.id, id));

      if (existingCompanyArray.length === 0) {
        return c.json({
          success: false,
          message: "Company not found.",
        });
      }

      const [company] = existingCompanyArray;

      if (!session.user.id) {
        return c.json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const isFollowing = company.followers?.includes(session.user.id);

      if (isFollowing) {
        await db
          .update(Company)
          .set({
            followers: company.followers?.filter(
              (follower) => follower !== session.user.id
            ),
          })
          .where(eq(Company.id, id));
        return c.json({
          success: true,
          message: "Company unfollowed successfully.",
        });
      } else {
        await db
          .update(Company)
          .set({
            followers: [...(company.followers || []), session.user.id],
          })
          .where(eq(Company.id, id));
        return c.json({
          success: true,
          message: "Company followed successfully.",
        });
      }
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        message: "An error occurred.",
      });
    }
  })
  .put("/update/:id", zValidator("json", companySchema), async (c) => {
    try {
      const session = await auth();
      if (!session) {
        return c.json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const id = c.req.param("id");
      const { name, address, description, email, logoUrl, phone, website } =
        c.req.valid("json");

      const existingCompanyArray = await db
        .select()
        .from(Company)
        .where(eq(Company.id, id));

      if (existingCompanyArray.length === 0) {
        return c.json({
          success: false,
          message: "Company not found.",
        });
      }

      const [company] = existingCompanyArray;

      if (session.user.role === "ADMIN") {
        await db
          .update(Company)
          .set({
            name: name ? name : company.name,
            address: address ? address : company.address,
            description: description ? description : company.description,
            email: email ? email : company.email,
            logoUrl: logoUrl ? logoUrl : company.logoUrl,
            phone: phone ? phone : company.phone,
            website: website ? website : company.website,
          })
          .where(eq(Company.id, id));
      } else if (session.user.role === "RECRUITER") {
        if (company.createdBy !== session.user.id) {
          return c.json({
            success: false,
            message: "Unauthorized.",
          });
        }

        await db
          .update(Company)
          .set({
            name: name ? name : company.name,
            address: address ? address : company.address,
            description: description ? description : company.description,
            email: email ? email : company.email,
            logoUrl: logoUrl ? logoUrl : company.logoUrl,
            phone: phone ? phone : company.phone,
            website: website ? website : company.website,
          })
          .where(eq(Company.id, id));
      } else {
        return c.json({
          success: false,
          message: "Unauthorized.",
        });
      }

      return c.json({
        success: true,
        message: "Company updated successfully.",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        message: "An error occurred.",
      });
    }
  });
export default app;
