import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";


export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    createdAt: timestamp('created_at', { mode: 'date'}).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode : 'date'}).notNull().defaultNow()
});



//Categories type inference
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;