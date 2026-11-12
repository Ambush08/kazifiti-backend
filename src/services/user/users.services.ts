import {
  users,
  type NewUser,
  type User,
} from "../../db/schema/index.js";
import db from "../../db/index.js";
import { eq } from "drizzle-orm";

//Create user service
export const createUserQuery = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning({
    id: users.id,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
    role: users.role,
    profile: users.profile,
    accountType: users.accountType,
    emailVerified: users.emailVerified,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  });

  return user;
};



//Find user
export const getUserQuery = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }

  return user;
};



//Upsert user
export const upserUserQuery = async (id: string, data: typeof users.$inferInsert) => {

    const { id: ignoredId, ...userData} = data
  const [user] = await db
    .insert(users)
    .values({
      id,
      ...userData,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: data,
    })
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      profile: users.profile,
      accountType: users.accountType,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return user;
};



//Update user
export const updateUserQuery = async (id: string, data: Partial<User>) => {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      profile: users.profile,
      accountType: users.accountType,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return user;
};
