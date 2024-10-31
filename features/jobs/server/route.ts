import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  appliedAsRecruiter,
  company,
  jobTypes,
  experienceLevels,
  jobLocations,
  skills,
  jobs,
  jobSkills,
} from "@/db/job-schema";
import {
  appliedAsRecruiterSchema,
  companySchema,
  experienceLevelSchema,
  jobLocationSchema,
  jobSchema,
  jobTypeSchema,
  skillSchema,
} from "@/schema/job-schema";
import { users } from "@/db/users-schema";
import { db } from "@/config/db";
import {
  eq,
  or,
  ilike,
  inArray,
  and,
  desc,
  lte,
  exists,
} from "drizzle-orm/expressions";
import { auth } from "@/auth";
import { sendMail } from "@/utils/mail";

const app = new Hono()
  .post(
    "/applyAsRecruiter",
    zValidator("json", appliedAsRecruiterSchema),
    async (c) => {
      try {
        const { userId, approved } = c.req.valid("json");

        const adminsArr = await db
          .select()
          .from(users)
          .where(eq(users.role, "ADMIN"));

        const [admins] = adminsArr;

        const existingApplication = await db
          .select()
          .from(appliedAsRecruiter)
          .where(eq(appliedAsRecruiter.userId, userId))
          .limit(1);

        const [application] = existingApplication;

        if (!application) {
          await db.insert(appliedAsRecruiter).values({
            userId,
            approved,
            appliedDate: new Date(),
          });

          for (let i = 0; i < adminsArr.length; i++) {
            const admin = adminsArr[i];
            await sendMail({
              to: admin.email,
              subject: "New recruiter application",
              text: `A new user with id ${userId} has applied as a recruiter. Please review the application.`,
              html: `A new user with id ${userId} has applied as a recruiter. Please review the application.`,
            });
          }

          return c.json({
            success: true,
            message: "Applied as recruiter successfully",
          });
        }

        if (application.maximumTimeAllowed <= 0) {
          return c.json({
            success: false,
            message: "Maximum time allowed reached",
          });
        }

        if (application.approved === "APPROVED") {
          return c.json({
            success: false,
            message: "User is already approved as recruiter",
          });
        }

        if (application.approved === "REJECTED") {
          return c.json({
            success: false,
            message: "User is already rejected as recruiter",
          });
        }

        await db
          .update(appliedAsRecruiter)
          .set({
            approved,
            appliedDate: new Date(),
            maximumTimeAllowed: application.maximumTimeAllowed - 1,
          })
          .where(eq(appliedAsRecruiter.userId, userId));

        for (let i = 0; i < adminsArr.length; i++) {
          const admin = adminsArr[i];
          await sendMail({
            to: admin.email,
            subject: "New recruiter application",
            text: `A user with id ${userId} has applied as a recruiter. Please review the application.`,
            html: `A user with id ${userId} has applied as a recruiter. Please review the application.`,
          });
        }

        return c.json({
          success: true,
          message: "Applied as recruiter successfully",
        });
      } catch (error) {
        console.log(error);
        return c.json({
          success: false,
          message: "Failed to apply as recruiter",
        });
      }
    }
  )
  .post("/add/company", zValidator("json", companySchema), async (c) => {
    try {
      const session = await auth();
      const user = session?.user;

      if (!user) {
        return c.json({
          success: false,
          message: "User not found",
        });
      }

      if (user.role === "USER") {
        return c.json({
          success: false,
          message: "User not authorized",
        });
      }

      const { address, description, email, logoUrl, name, phone, website } =
        c.req.valid("json");

      const conditions = [
        name ? eq(company.name, name) : undefined,
        email ? eq(company.email, email) : undefined,
        phone ? eq(company.phone, phone) : undefined,
        website ? eq(company.website, website) : undefined,
      ].filter(Boolean);

      const existingCompany = await db
        .select()
        .from(company)
        .where(or(...conditions))
        .limit(1);

      const [companyExists] = existingCompany;

      if (companyExists) {
        return c.json({
          success: false,
          message: "Company already exists",
        });
      }

      await db.insert(company).values({
        address,
        description,
        email,
        logoUrl,
        name,
        phone,
        website,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.id as string,
      });

      return c.json({
        success: true,
        message:
          "Company added successfully you can update it from Company tab",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        message: "Failed to add company",
      });
    }
  })
  .post("/add/jobType", zValidator("json", jobTypeSchema), async (c) => {
    try {
      const session = await auth();
      const user = session?.user;

      if (!user) {
        return c.json({
          success: false,
          message: "User not found",
        });
      }

      if (user.role === "USER") {
        return c.json({
          success: false,
          message: "User not authorized",
        });
      }

      const { description, label, value } = c.req.valid("json");

      const existingJobType = await db
        .select()
        .from(jobTypes)
        .where(eq(jobTypes.value, value))
        .limit(1);

      const [jobTypeExists] = existingJobType;

      if (jobTypeExists) {
        return c.json({
          success: false,
          message: "Job type already exists",
        });
      }

      await db.insert(jobTypes).values({
        description,
        label,
        value,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.id as string,
      });

      return c.json({
        success: true,
        message: "Job type added successfully",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        message: "Failed to add job type",
      });
    }
  })
  .post(
    "/add/jobLocation",
    zValidator("json", jobLocationSchema),
    async (c) => {
      try {
        const session = await auth();
        const user = session?.user;

        if (!user) {
          return c.json({
            success: false,
            message: "User not found",
          });
        }

        if (user.role === "USER") {
          return c.json({
            success: false,
            message: "User not authorized",
          });
        }

        const { description, label, value } = c.req.valid("json");

        const existingJobLocation = await db
          .select()
          .from(jobLocations)
          .where(eq(jobLocations.value, value))
          .limit(1);

        const [jobLocationExists] = existingJobLocation;

        if (jobLocationExists) {
          return c.json({
            success: false,
            message: "Job location already exists",
          });
        }

        await db.insert(jobLocations).values({
          description,
          label,
          value,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: user.id as string,
        });

        return c.json({
          success: true,
          message: "Job location added successfully",
        });
      } catch (error) {
        console.log(error);
        return c.json({
          success: false,
          message: "Failed to add job location",
        });
      }
    }
  )
  .post(
    "/add/experienceLevel",
    zValidator("json", experienceLevelSchema),
    async (c) => {
      try {
        const session = await auth();
        const user = session?.user;

        if (!user) {
          return c.json({
            success: false,
            message: "User not found",
          });
        }

        if (user.role === "USER") {
          return c.json({
            success: false,
            message: "User not authorized",
          });
        }

        const { description, label, value } = c.req.valid("json");

        const existingExperienceLevel = await db
          .select()
          .from(experienceLevels)
          .where(eq(experienceLevels.value, value))
          .limit(1);

        const [experienceLevelExists] = existingExperienceLevel;

        if (experienceLevelExists) {
          return c.json({
            success: false,
            message: "Experience level already exists",
          });
        }

        await db.insert(experienceLevels).values({
          description,
          label,
          value,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: user.id as string,
        });

        return c.json({
          success: true,
          message: "Experience level added successfully",
        });
      } catch (error) {
        console.log(error);
        return c.json({
          success: false,
          message: "Failed to add experience level",
        });
      }
    }
  )
  .post("/add/skills", zValidator("json", skillSchema), async (c) => {
    try {
      const session = await auth();
      const user = session?.user;

      if (!user) {
        return c.json({
          success: false,
          message: "User not found",
        });
      }

      const body = c.req.valid("json");

      const existingSkills = await db
        .select()
        .from(skills)
        .where(eq(skills.value, body.value))
        .limit(1);

      const [skillExists] = existingSkills;

      if (skillExists) {
        return c.json({
          success: false,
          message: "Skill already exists",
        });
      }

      await db.insert(skills).values({
        label: body.label,
        value: body.value,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.id as string,
      });

      return c.json({
        success: true,
        message: "Skills added successfully",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        message: "Failed to add skill",
      });
    }
  })
  .post("/create/job", zValidator("json", jobSchema), async (c) => {
    try {
      const session = await auth();
      const user = session?.user;

      if (!user) {
        return c.json({
          success: false,
          message: "User not found",
        });
      }

      if (user.role === "USER") {
        return c.json({
          success: false,
          message: "User not authorized",
        });
      }

      const {
        companyId,
        description,
        experienceLevelId,
        jobLocationId,
        jobTypeId,
        title,
        deadline,
        salary,
        currencyType,
        skillIds,
      } = c.req.valid("json");

      const skills = skillIds
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      const data = await db
        .insert(jobs)
        .values({
          companyId,
          deadline: new Date(deadline),
          description,
          experienceLevelId,
          jobLocationId,
          jobTypeId,
          postedBy: user.id as string,
          salary: Math.round(salary),
          title,
          currencyType,
          postedDate: new Date(),
        })
        .returning();

      const jobId = data[0].id;

      const jobSkillData = skills.map((skillId) => ({
        jobId,
        skillId,
      }));

      await db.insert(jobSkills).values(jobSkillData);

      return c.json({
        success: true,
        message: "Job posted successfully",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        message: "Failed to create job",
      });
    }
  })
  .get("/companies", async (c) => {
    try {
      const companies = await db.select().from(company);
      return c.json({
        success: true,
        companies,
        message: "Companies fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        companies: [],
        message: "Failed to fetch companies",
      });
    }
  })
  .get("/jobTypes", async (c) => {
    try {
      const data = await db.select().from(jobTypes);
      return c.json({
        success: true,
        jobTypes: data,
        message: "Job types fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        jobTypes: [],
        message: "Failed to fetch job types",
      });
    }
  })
  .get("/jobLocations", async (c) => {
    try {
      const data = await db.select().from(jobLocations);
      return c.json({
        success: true,
        jobLocations: data,
        message: "Job locations fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        jobLocations: [],
        message: "Failed to fetch job locations",
      });
    }
  })
  .get("/experienceLevels", async (c) => {
    try {
      const data = await db.select().from(experienceLevels);
      return c.json({
        success: true,
        experienceLevels: data,
        message: "Experience levels fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        experienceLevels: [],
        message: "Failed to fetch experience levels",
      });
    }
  })
  .get("/skills", async (c) => {
    try {
      const data = await db.select().from(skills);
      return c.json({
        success: true,
        skills: data,
        message: "Skills fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        skills: [],
        message: "Failed to fetch skills",
      });
    }
  })
  .get("/get/posted/date", async (c) => {
    try {
      const data = await db
        .select({
          postedDate: jobs.postedDate,
        })
        .from(jobs)
        .orderBy(desc(jobs.postedDate));

      const uniqueDates = new Set(
        data.map((item) => item.postedDate.toDateString())
      );

      const dates = Array.from(uniqueDates);

      return c.json({
        success: true,
        dates: dates,
        message: "Posted dates fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        dates: [],
        message: "Failed to fetch posted dates",
      });
    }
  })
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        query: z.string().optional().nullable(),
        companyId: z.string().optional().nullable(),
        experienceLevelId: z.string().optional().nullable(),
        postedDate: z.coerce.date().optional().nullable(),
        jobLocationId: z.string().optional().nullable(),
        jobTypeId: z.string().optional().nullable(),
        status: z.enum(["OPEN", "CLOSED"]).optional().nullable(),
      })
    ),
    async (c) => {
      const {
        query,
        companyId,
        jobLocationId,
        experienceLevelId,
        jobTypeId,
        status,
        postedDate,
      } = c.req.valid("query");

      Object.keys(c.req.query).forEach((key) => {
        const query = c.req.query as Record<string, any>;
        if (query[key] === "" || query[key] === null) {
          delete query[key];
        }
      });

      try {
        const data = await db.query.jobs.findMany({
          where: (jobs) =>
            and(
              query
                ? or(
                    ilike(jobs.title, `%${query}%`),
                    exists(
                      db
                        .select()
                        .from(jobSkills)
                        .innerJoin(skills, eq(jobSkills.skillId, skills.id))
                        .where(
                          and(
                            eq(jobSkills.jobId, jobs.id),
                            ilike(skills.label, `%${query}%`)
                          )
                        )
                    )
                  )
                : undefined,
              companyId ? eq(jobs.companyId, companyId) : undefined,
              jobLocationId ? eq(jobs.jobLocationId, jobLocationId) : undefined,
              experienceLevelId
                ? eq(jobs.experienceLevelId, experienceLevelId)
                : undefined,
              jobTypeId ? eq(jobs.jobTypeId, jobTypeId) : undefined,
              status ? eq(jobs.status, status) : undefined,
              postedDate ? lte(jobs.postedDate, postedDate) : undefined
            ),
          with: {
            company: true,
            jobType: true,
            jobLocation: true,
            postedByUser: true,
          },
        });

        const totalCount = data.length;

        return c.json({
          success: false,
          message: "Jobs fetched successfully",
          jobs: data,
          totalCount,
        });
      } catch (error) {
        console.log(error);
        return c.json({
          success: false,
          message: "Something went wrong",
          jobs: [],
          totalCount: 0,
        });
      }
    }
  )
  .get("/:id", async (c) => {
    try {
      const { id } = c.req.param();
      const data = await db.query.jobs.findFirst({
        where: (jobs) => eq(jobs.id, id),
        with: {
          company: true,
          jobType: true,
          experienceLevel: true,
          jobLocation: true,
          postedByUser: true,
          jobSkills: {
            with: {
              skill: true,
            },
          },
        },
      });

      return c.json({
        success: true,
        message: "Job fetched successfully",
        job: data,
      });
    } catch (error) {
      console.log(error);
      return c.json({
        success: false,
        message: "Failed to fetch job",
        job: null,
      });
    }
  });
export default app;
