import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const customerPassword = await bcrypt.hash("User@1234", 10);

  const darkCategory = await prisma.category.upsert({
    where: { name: "Dark Chocolate" },
    update: {},
    create: { name: "Dark Chocolate" },
  });

  const milkCategory = await prisma.category.upsert({
    where: { name: "Milk Chocolate" },
    update: {},
    create: { name: "Milk Chocolate" },
  });

  const whiteCategory = await prisma.category.upsert({
    where: { name: "White Chocolate" },
    update: {},
    create: { name: "White Chocolate" },
  });

  const darkTruffle = await prisma.product.upsert({
    where: { name: "Dark Truffle Collection" },
    update: {
      description: "Handcrafted dark chocolate truffles with exotic flavors",
      price: 2999,
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80",
      categoryId: darkCategory.id,
    },
    create: {
      name: "Dark Truffle Collection",
      description: "Handcrafted dark chocolate truffles with exotic flavors",
      price: 2999,
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80",
      categoryId: darkCategory.id,
    },
  });

  await prisma.product.upsert({
    where: { name: "Milk Chocolate Elegance" },
    update: {
      description: "Smooth milk chocolate infused with vanilla and caramel",
      price: 2499,
      image: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=80",
      categoryId: milkCategory.id,
    },
    create: {
      name: "Milk Chocolate Elegance",
      description: "Smooth milk chocolate infused with vanilla and caramel",
      price: 2499,
      image: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=80",
      categoryId: milkCategory.id,
    },
  });

  await prisma.product.upsert({
    where: { name: "White Chocolate Bliss" },
    update: {
      description: "Premium white chocolate with raspberry and pistachio",
      price: 2799,
      image: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=900&q=80",
      categoryId: whiteCategory.id,
    },
    create: {
      name: "White Chocolate Bliss",
      description: "Premium white chocolate with raspberry and pistachio",
      price: 2799,
      image: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=900&q=80",
      categoryId: whiteCategory.id,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@chocosphere.com" },
    update: {
      name: "Store Admin",
      password: adminPassword,
      role: "ADMIN",
    },
    create: {
      name: "Store Admin",
      email: "admin@chocosphere.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@chocosphere.com" },
    update: {
      name: "Demo Customer",
      password: customerPassword,
      role: "USER",
    },
    create: {
      name: "Demo Customer",
      email: "customer@chocosphere.com",
      password: customerPassword,
      role: "USER",
    },
  });

  const existingOrder = await prisma.order.findFirst({
    where: {
      userId: customer.id,
    },
  });

  if (!existingOrder) {
    await prisma.order.create({
      data: {
        userId: customer.id,
        totalAmount: darkTruffle.price * 2,
        status: "PENDING",
        items: {
          create: [
            {
              productId: darkTruffle.id,
              quantity: 2,
            },
          ],
        },
      },
    });
  }

  console.log("Seed completed");
  console.log("Admin login: admin@chocosphere.com / Admin@123");
  console.log("Customer login: customer@chocosphere.com / User@1234");
  console.log(`Admin user id: ${admin.id}`);
};

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
