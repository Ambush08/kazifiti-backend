import { users } from "./users.schema.js";
import { relations } from "drizzle-orm";
import { applications } from "./jobApplication.schema.js";
import { jobs } from "./jobs.schema.js";
import { categories } from "./categories.schema.js";
import { SavedJobs } from "./savedJobs.js";
import { companies } from "./company.schema.js";



//User Relations
export const userRelations = relations(users, ({many, one}) => ({
    jobs: many(jobs),
    applications: many(applications),
    savedJobs: many(SavedJobs),
    company: one(companies)
}));


//Job relations
export const jobRelations = relations(jobs, ({ one, many}) => ({
    company: one(companies, {fields: [jobs.companyId], references: [companies.ownerId]}),
    applications: many(applications),
    category: one(categories, { fields: [jobs.categoryId], references: [categories.id]}),
    savedJobs: many(SavedJobs),
}));



//Applications relatins
export const applicationsRelations = relations(applications, ({one}) => ({
    user: one(users, { fields: [applications.applicantId], references: [users.id]}),
    job: one(jobs, { fields: [applications.jobId], references: [jobs.id]})
}));


//Categories relations
export const categoryRelations = relations(categories, ({ many }) => ({
    job: many(jobs)
}));


//Saved jobs relations 
export const savedJobsRelations = relations(SavedJobs, ({one})=> ({
    job: one(jobs, { fields: [SavedJobs.jobId], references: [jobs.id]}),
    user: one(users, { fields: [SavedJobs.userId], references: [users.id]})
}));



//Companies relations
export const companiesRelations = relations(companies, ({one, many}) => ({
    owner: one(users, { fields: [companies.ownerId], references: [users.id]}),
    job: many(jobs)
}))