import { users } from "./users.schema.js";
import { relations } from "drizzle-orm";
import { applications } from "./jobApplication.schema.js";
import { jobs } from "./jobs.schema.js";
import { categories } from "./categories.schema.js";
import { SavedJobs } from "./savedJobs.js";



//User Relations
export const userRelations = relations(users, ({many}) => ({
    jobs: many(jobs),
    applications: many(applications),
    savedJobs: many(SavedJobs),
}));


//Job relations
export const jobRelations = relations(jobs, ({ one, many}) => ({
    employer: one(users, { fields: [jobs.employerId], references: [users.id]}),
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
    jobs: many(jobs)
}));


//Saved jobs relations 
export const savedJobsRelations = relations(SavedJobs, ({one})=> ({
    job: one(jobs, { fields: [SavedJobs.jobId], references: [jobs.id]}),
    user: one(users, { fields: [SavedJobs.userId], references: [users.id]})
}))