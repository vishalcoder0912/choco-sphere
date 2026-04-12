import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  console.log("All users:", JSON.stringify(users, null, 2));

  // To make a user admin, pass their email as an arg: node promote.mjs admin@email.com
  const emailToPromote = process.argv[2];
  if (emailToPromote) {
    const updated = await prisma.user.update({
      where: { email: emailToPromote },
      data: { role: "ADMIN" },
    });
    console.log(`\n✅ Promoted ${updated.name} (${updated.email}) to ADMIN`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
