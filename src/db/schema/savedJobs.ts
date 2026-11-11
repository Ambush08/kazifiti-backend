import { pgTable, uuid, timestamp, text, unique } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { jobs } from "./jobs.schema.js";



export const SavedJobs = pgTable('savedJobs', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete : 'cascade'}),
    jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete : 'cascade'}),
    createdAt: timestamp('created_at', { mode : 'date'}).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode : 'date'}).notNull().defaultNow().$onUpdate(() => new Date()), 
},
(table) => [
    unique().on(table.userId, table.jobId),
  ]
);



//Saved jobs type inference 
export type SavedJob = typeof SavedJobs.$inferSelect;
export type NewSavedJob = typeof SavedJobs.$inferInsert