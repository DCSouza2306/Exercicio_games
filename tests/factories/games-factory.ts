import prisma from "config/database";
import { faker } from "@faker-js/faker";

export async function createGame(consoleId: number) {
 return prisma.game.create({
  data: {
   title: faker.company.name(),
   consoleId,
  },
 });
}
