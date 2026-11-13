import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { id } from "zod/locales";
import { users } from "./users.schema.js";



export const companies = pgTable('companies', {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade'}),
    name: text('name').notNull(),
    websiteUrl: text('website_url'),
    logo: text('logo'),
    logoId: text('logo_id'),
    createdAt: timestamp('created_at', { mode: 'date'}).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date'}).notNull().defaultNow().$onUpdate(() => new Date())
});




//Type refernces
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;