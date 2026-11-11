import { pgEnum } from "drizzle-orm/pg-core";


export const userRole = pgEnum('user_role', [
    'user',
    'employer',
    'admin'
]);

export const accountType = pgEnum('account_type', [
    'basic',
    'premium'
]);

export const jobType = pgEnum('job_type', [
    'contract',
    'full-time',
    'internship',
    'part-time'
]);

export const status = pgEnum('status', [
    'open', 'closed'
]);


export const experienceLevel = pgEnum('experience_level', [
    'junior', 'mid', 'senior'
]);


export const workPlace = pgEnum('work_place', [
    'on-site', 'remote', 'hybrid'
]);


export const applicationStatus = pgEnum('application_status', [
    'pending', 'reviewed', 'reject', 'selected'
])