import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getPeople().map(async (person) => {
      await db.people.create({ data: person });
    })
  );
}

function getPeople() {
  return [
    {
      firstName: "Abdur ",
      lastName: "Roquib",
    },
    {
      firstName: "Maliha",
      lastName: "Biswas",
    },
  ];
}
