import {
  pgTable,
  text,
  timestamp,
  uuid,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { jobs } from "./jobs.schema.js";
import { applicationStatus } from "./enums.js";

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    applicantId: uuid("applicant_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    resumeUrl: text("resume_url").notNull(),
    resumePublicId: text("resume_public_id").notNull(),
    coverLetterUrl: text("cover_letter_url"),
    coverLetterPublicId: text("cover_letter_public_id"),
    status: applicationStatus("status").notNull().default("submitted"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique("applications_applicant_job_unique").on(table.applicantId, table.jobId),
    index("applications_job_idx").on(table.jobId),
  ],
);

//Application type inference
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
