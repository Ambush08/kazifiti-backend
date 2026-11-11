import { pgTable, text, uuid, integer, timestamp, boolean,date } from "drizzle-orm/pg-core";
import { userRole, accountType } from "./enums.js";


export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRole().notNull().default('user'),
    tokenVersion: integer('token_version').notNull().default(0),
    profile: text('profile'),
    publicId: text('public_id'),
    emailVerified: boolean('email_verified').notNull().default(false),
    twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
    twoFactorSecret: text('two_factor_secret'),
    accountType: accountType().notNull().default('basic'),
    passwordResetToken: text('password_reset_token'),
    passwordResetExpires: date('password_reset_expires'),
    createdAt: timestamp('created_at', { mode : 'date'}).notNull().defaultNow(), 
    updatedAt: timestamp('updated_at', { mode : 'date'}).notNull().defaultNow().$onUpdate(() => new Date()), 
});

//User type inference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;