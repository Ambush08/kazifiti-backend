import { pgTable, uuid, timestamp, text, integer, index, foreignKey, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users.schema.js";
import { paymentMethod } from "./enums.js";
import { paymentStatus } from "./enums.js";
import { subscriptions } from "./subscription.schema.js";

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    subscriptionId: uuid("subscription_id"),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("KES"),
    method: paymentMethod("method").notNull(),
    status: paymentStatus("status").notNull().default("pending"),
    transactionReference: text("transaction_reference").unique(),
    checkoutRequestId: text("checkout_request_id").unique(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      name: "payments_subscription_owner_fk",
      columns: [table.subscriptionId, table.userId],
      foreignColumns: [subscriptions.id, subscriptions.userId],
    }).onDelete("restrict"),
    check("payments_amount_non_negative", sql`${table.amount} >= 0`),
    index("payments_user_idx").on(table.userId),
    index("payments_subscription_idx").on(table.subscriptionId),
  ],
);



//Type reference
export type Payment = typeof payments.$inferSelect;

export type NewPayment = typeof payments.$inferInsert;