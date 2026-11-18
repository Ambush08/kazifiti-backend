import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const plans = pgTable(
  "plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    features: text("features").array().notNull().default([]),
    price: integer("price").notNull(),
    durationDays: integer("duration_days").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check("plans_price_valid", sql`${table.price} >= 0`),
    check("plans_duration_valid", sql`${table.durationDays} > 0`),
  ],
);

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
