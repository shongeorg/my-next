import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seed() {
  await prisma.post.deleteMany();
  console.log("Очищено таблицю Post");

  const posts = Array.from({ length: 100 }, () => ({
    title: faker.lorem.sentence({ min: 3, max: 10 }),
    body: faker.lorem.paragraphs({ min: 1, max: 3 }),
  }));

  await prisma.post.createMany({
    data: posts,
  });

  console.log("Додано 100 постів у базу");
}

seed()
  .catch((e) => {
    console.error("Помилка при сідингу:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
