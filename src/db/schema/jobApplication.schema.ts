import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { jobs } from "./jobs.schema.js";
import { applicationStatus } from "./enums.js";




export const applications = pgTable('applications', {
    id: uuid('id').defaultRandom().primaryKey(),
    resumeUrl: text('resume_url').notNull(),
    resumePublicId: text('resume_public_id').notNull(),
    coverLetter: text('cover_letter').notNull(),
    coverLetterPublicId: text('cover_letter_puclic_id').notNull(),
    applicantId: uuid('applicant_id').references(() => users.id, { onDelete: 'cascade'}).notNull(),
    jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'cascade'}).notNull(),
    applicationStatus: applicationStatus().notNull().default('pending'),
    createdAt: timestamp('created_at', { mode : 'date'}).notNull().defaultNow(),
    updtedAt: timestamp('updated_at', { mode : 'date'}).notNull().defaultNow(),
})



//Application type inference 
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;