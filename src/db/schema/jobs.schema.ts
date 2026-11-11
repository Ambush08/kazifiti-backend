import { pgTable, text, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { jobType, status, experienceLevel, workPlace } from "./enums.js";
import { categories } from "./categories.schema.js";
import { users } from "./users.schema.js";



export const jobs = pgTable('jobs', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    jobType: jobType().notNull(),
    location: text('location').notNull(),
    company: text('company').notNull(),
    salaryMin: integer('salary_min').notNull(),
    salaryMax: integer('salary_max').notNull(),
    status: status().notNull().default('open'),
    experienceLevel: experienceLevel().notNull(),
    logo: text('logo').notNull(),
    publicId: text('public_id').notNull(),
    categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete : 'cascade'}),
    skills: text('skills').array().default([]),
    responsibilities: text('responsibilities').array().default([]),
    workplace: workPlace().notNull().default('on-site'),
    employerId: uuid('employer_id').notNull().references(() => users.id, { onDelete : 'cascade'}),
    createdAt: timestamp('created_at', { mode: 'date'}).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode : 'date'}).notNull().defaultNow().$onUpdate(() => new Date()),
});


//Job type inference
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;