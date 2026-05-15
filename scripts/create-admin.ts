import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter and client
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@careerquest.dev";
  const password = "Admin123!@#$";

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Check if admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("Admin user already exists!");
    console.log(`Email: ${email}`);
    return;
  }

  // Create admin user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
      profile: {
        create: {
          firstName: "Admin",
          lastName: "User",
          preferredLanguage: "en",
          profileCompleted: true,
          welcomeTourDone: true,
        },
      },
    },
  });

  console.log("✅ Admin account created successfully!");
  console.log("================================");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log("================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
