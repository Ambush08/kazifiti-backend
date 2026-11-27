import { and, eq, desc } from "drizzle-orm";
import db from "../../db/index.js";
import {
  companies,
  Company,
  NewCompany,
} from "../../db/schema/company.schema.js";
import { AppError } from "../../errors/AppError.js";
import { NewUser, users } from "../../db/schema/users.schema.js";


type UpdatableCompanyFields = Pick<
  Company,
  "name" | "location" | "logo" | "industry" | "websiteUrl"
>;

//Get company by Id
export const getCompanyQuery = async (id: string) => {
  const company = await db.query.companies.findFirst({
    where: eq(companies.id, id),
  });

  if (!company) throw new AppError(404, "Company not found");

  return company;
};

//Get list of companies registered
export const getCompaniesQuery = async (limit = 20, offset = 0) => {
  return await db.query.companies.findMany({
    columns: { id: true, name: true, ownerId: true, logo: true, industry: true, websiteUrl: true, location: true, createdAt: true },
    orderBy: desc(companies.createdAt),
    limit,
    offset,
  });
};

//Update company info
export const updateCompanyQuery = async (
  id: string,
  userId: string,
  data: Partial<UpdatableCompanyFields>,
) => {
  const [company] = await db
    .update(companies)
    .set(data)
    .where(and(eq(companies.id, id), eq(companies.ownerId, userId)))
    .returning({
      id: companies.id,
      name: companies.name,
      ownerId: companies.ownerId,
      location: companies.location,
      logo: companies.logo,
      industry: companies.industry,
      updatedAt: companies.updatedAt,
    });

    if(!company) throw new AppError (404, 'Company not found')

  return company;
};

//Delete company
export const deleteCompanyQuery = async (id: string, userId: string) => {
  const [company] = await db
    .delete(companies)
    .where(and(eq(companies.id, id), eq(companies.ownerId, userId)))
    .returning({ companyId: companies.id });

    if(!company) throw new AppError (404, 'Company not found')

  return company;
};


//Register recruiter
export const registerRecruiterService = async (userData: NewUser, company: NewCompany) => {
    return await db.transaction( async (tx) => {
        const [user] = await tx.insert(users)
        .values({ ...userData, role: 'employer' })
        .returning({ 
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            emailVerified: users.emailVerified,
            role: users.role
        });


        const [org] = await tx.insert(companies).values({...company, ownerId: user.id})
        .returning({ companyId: companies.id});


        return { user, company: org}
    });
}
