import { users } from "./users.schema.js";
import { relations } from "drizzle-orm";
import { applications } from "./jobApplication.schema.js";
import { jobs } from "./jobs.schema.js";
import { categories } from "./categories.schema.js";
import { savedJobs } from "./savedJobs.schema.js";
import { companies } from "./company.schema.js";
import { subscriptions } from "./subscription.schema.js";
import { plans } from "./plans.schema.js";
import { payments } from "./payments.schema.js";



//User Relations
export const userRelations = relations(users, ({many}) => ({
    applications: many(applications),
    savedJobs: many(savedJobs),
    companies: many(companies),
    payments: many(payments),
    subscriptions: many(subscriptions)
}));


//Job relations
export const jobRelations = relations(jobs, ({ one, many}) => ({
    company: one(companies, {fields: [jobs.companyId], references: [companies.id]}),
    applications: many(applications),
    category: one(categories, { fields: [jobs.categoryId], references: [categories.id]}),
    savedJobs: many(savedJobs),
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
export const savedJobsRelations = relations(savedJobs, ({one})=> ({
    job: one(jobs, { fields: [savedJobs.jobId], references: [jobs.id]}),
    user: one(users, { fields: [savedJobs.userId], references: [users.id]})
}));



//Companies relations
export const companiesRelations = relations(companies, ({one, many}) => ({
    owner: one(users, { fields: [companies.ownerId], references: [users.id]}),
    job: many(jobs)
}));


//Plans relations
export const plansRelations = relations(plans, ({ many }) => ({
    subscription: many(subscriptions),
}));


//Payment relations
export const paymentRelations = relations(payments, ({ one }) => ({
    user: one(users, { fields: [ payments.userId ], references: [users.id]}),
    subscription: one(subscriptions, { fields: [payments.subscriptionId], references: [subscriptions.id]})
}));


//Subscriptions relations
export const subscriptionsRelations = relations(subscriptions, ({ one, many}) => ({
    payment: many(payments),
    user: one(users, { fields: [subscriptions.userId], references: [users.id]}),
    plan: one(plans, { fields: [subscriptions.planId], references: [plans.id]}),
}));