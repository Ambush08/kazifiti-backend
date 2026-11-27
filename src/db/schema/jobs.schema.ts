import { pgTable, text, uuid, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { jobType, status, experienceLevel, workPlace, approvalStatus } from "./enums.js";
import { categories } from "./categories.schema.js";
import { companies } from "./company.schema.js";




export const jobs = pgTable('jobs', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    jobType: jobType().notNull(),
    location: text('location').notNull(),
    companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade'}),
    salaryMin: integer('salary_min').notNull(),
    salaryMax: integer('salary_max').notNull(),
    status: status().notNull().default('open'),
    approvalStatus: approvalStatus().notNull().default('Pending'),
    experienceLevel: experienceLevel().notNull(),
    logo: text('logo').notNull(),
    publicId: text('public_id').notNull(),
    categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete : 'cascade'}),
    skills: text('skills').array().default([]),
    responsibilities: text('responsibilities').array().default([]),
    workplace: workPlace().notNull().default('on-site'),
    isApproved: boolean('is_approved').default(false),
    createdAt: timestamp('created_at', { mode: 'date'}).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode : 'date'}).notNull().defaultNow().$onUpdate(() => new Date()),
});


//Job type inference
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;