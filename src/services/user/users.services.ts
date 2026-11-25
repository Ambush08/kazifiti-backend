import { users, type NewUser, type User } from "../../db/schema/index.js";
import db from "../../db/index.js";
import { and, eq, sql, gt } from "drizzle-orm";



export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

type UpdatableUserFields = Pick<User, "firstName" | "lastName" | "profile">;

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

//Find user by email
export const findUserByEmail = (email: string) =>
  db.query.users.findFirst({ where: eq(users.email, email) });

//Find user
export const getUserQuery = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { passwordHash: false },
  });

  if (!user) throw new NotFoundError("User not found");

  return user;
};

//Upsert user
export const upsertUserQuery = async (
  id: string,
  data: typeof users.$inferInsert,
) => {
  const { id: ignoredId, ...userData } = data;
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
export const updateUserQuery = async (
  id: string,
  data: Partial<UpdatableUserFields>,
) => {
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

//Compare token
export const findValidToken = async (tokenHash: string) => {
  const [row ] =await db
  .select({ id: users.id})
  .from(users)
  .where(
    and(
      eq(users.passwordResetToken, tokenHash),
      gt(users.passwordResetExpires, new Date())
    )
  )
  .limit(1);

  return row;
}

//Reset user password
export const resetPasswordwithToken = async (tokenHash: string, passwordHash: string) => {
  const [user] = await db.update(users).set({
    passwordHash,
    passwordResetToken: null,
    passwordResetExpires: null,
    tokenVersion: sql `${users.tokenVersion} + 1`,
    updatedAt: new Date()
  })
  .where(
    and(
      eq(users.passwordResetToken, tokenHash),
      gt(users.passwordResetExpires, new Date())
    ),
  )
  .returning({id: users.id});

  return user;
}
