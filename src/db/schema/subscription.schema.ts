import { uuid, timestamp, pgTable, index, uniqueIndex, check, unique } from "drizzle-orm/pg-core";
import { subscriptionStatus } from "./enums.js";
import { users } from "./users.schema.js";
import { plans } from "./plans.schema.js";
import { sql } from "drizzle-orm";

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "restrict" }),
    status: subscriptionStatus("status").notNull().default("pending"),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique("subscriptions_id_user_unique").on(table.id, table.userId),
    index("subscriptions_user_idx").on(table.userId),
    index("subscriptions_status_end_idx").on(table.status, table.endDate),
    uniqueIndex("subscriptions_one_active_per_user")
      .on(table.userId)
      .where(sql`${table.status} = 'active'`),
    check(
      "subscriptions_dates_valid",
      sql`${table.endDate} IS NULL OR ${table.startDate} IS NULL OR ${table.endDate} >= ${table.startDate}`,
    ),
  ],
);


//Type inference
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;