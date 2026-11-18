import { pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "employer", "admin"]);

export const accountType = pgEnum("account_type", ["basic", "premium"]);

export const jobType = pgEnum("job_type", [
  "contract",
  "full-time",
  "internship",
  "part-time",
]);

export const status = pgEnum("status", ["open", "closed"]);

export const experienceLevel = pgEnum("experience_level", [
  "junior",
  "mid",
  "senior",
]);

export const workPlace = pgEnum("work_place", ["on-site", "remote", "hybrid"]);

export const applicationStatus = pgEnum("application_status", [
  "submitted",
  "reviewed",
  "shortlisted",
  "interview",
  "rejected",
  "Hired",
]);

export const approvalStatus = pgEnum("approval_status", [
  "Pending",
  "Approved",
  "Rejected",
]);

export const subscriptionPlan = pgEnum("subscription_plan", [
  "starter", "growth", "enterprise",
]);


export const subscriptionStatus = pgEnum('subscription_status', [
  "pending", "active", "expired", "cancelled",
]);


export const paymentMethod = pgEnum('payment_method', [
  "mpesa", "card", "bank",
]);


export const paymentStatus = pgEnum('payment_status', [
  "pending",
  "successful",
  "failed",
  "cancelled",
  "refunded",
]);