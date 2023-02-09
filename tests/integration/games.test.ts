import { cleanDb } from "../helpers";
import app from "../../src/app";
import supertest from "supertest";
import { createConsole } from "../factories/console-factory";
import { createGame } from "../factories/games-factory";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";

beforeEach(async () => {
 await cleanDb();
});

const server = supertest(app);

describe("GET /games", () => {
 it("Should response with all games", async () => {
  const console = await createConsole();
  const game = await createGame(console.id);

  const response = await server.get("/games");

  expect(response.body).toBeDefined()
 });
});

describe("GET /games/:id", () => {
 it("Should response with status 404 when doesnt exist a game for given id", async () => {
  const console = await createConsole();
  const game = await createGame(console.id);

  const response = await server.get("/games/0");

  expect(response.status).toBe(404);
 });

 it("Should response with game data for given id", async () => {
  const console = await createConsole();
  const game = await createGame(console.id);

  const response = await server.get(`/games/${game.id}`);

  expect(response.body).toBeDefined()
 });
});

describe("POST /games", () => {
 it("Should response with status 422 when given body is not valid", async () => {
  const body = { [faker.lorem.word()]: faker.lorem.word() };

  const response = await server.post("/games").send(body);

  expect(response.status).toBe(422);
 });

 describe("when body is valid", () => {
  it("Should response with status 409 when game already exist", async () => {
   const console = await createConsole();
   const game = await createGame(console.id);
   const body = {
    title: game.title,
    consoleId: game.consoleId,
   };

   const response = await server.post("/games").send(body);

   expect(response.status).toBe(409);
  });

  it("Should response with status 409 when given consoleId doesnt exist", async () => {
   const body = {
    title: faker.company.name(),
    consoleId: 0,
   };

   const response = await server.post("/games").send(body);

   expect(response.status).toBe(409);
  });

  it("Should response with status 201 when game created", async () => {
   const console = await createConsole();
   const body = {
    title: faker.company.name(),
    consoleId: console.id,
   };

   const response = await server.post("/games").send(body);

   expect(response.status).toBe(httpStatus.CREATED);
  });
 });
});
