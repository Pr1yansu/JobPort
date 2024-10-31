import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema1 from "@/db/job-schema";
import * as schema2 from "@/db/users-schema";
import * as schema3 from "@/db/resume-schema";

const postgresSql = neon(process.env.DATABASE_URL!);

export const db = drizzle({
  client: postgresSql,
  schema: {
    ...schema1,
    ...schema2,
    ...schema3,
  },
});
