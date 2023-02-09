import { cleanDb } from "../helpers";
import app from "../../src/app";
import supertest from "supertest";
import { createConsole } from "../factories/console-factory";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";


beforeEach(async () => {
 await cleanDb();
});

const server = supertest(app);

describe("GET /consoles", () => {
 it("Should response with all consoles", async () => {
  const console = await createConsole();

  const response = await server.get("/consoles");

  expect(response.body).toBeDefined()
 });
});

describe("GET /consoles/:id", () => {
 it("Should response with status 404 when doesnt exist a console for given id", async () => {
  const response = await server.get("/consoles/0");

  expect(response.status).toBe(404);
 });

 it("Should response with console data for given id", async () => {
  const console = await createConsole();

  const response = await server.get(`/consoles/${console.id}`);

  expect(response.body).toBeDefined()
 });
});

describe("POST /consoles", () => {
 it("Should response with status 422 when given body is not valid", async () => {
  const body = { [faker.lorem.word()]: faker.lorem.word() };

  const response = await server.post("/consoles").send(body);

  expect(response.status).toBe(422);
 });

 describe("when body is valid", () => {
  it("Should response with status 409 when console already exist", async () => {
   const console = await createConsole();
   const body = {
    name: console.name,
   };

   const response = await server.post("/consoles").send(body);

   expect(response.status).toBe(409);
  });

  it("Should response with status 201 when console created", async () => {
   const body = {
    name: faker.company.name(),
   };

   const response = await server.post("/consoles").send(body);

   expect(response.status).toBe(httpStatus.CREATED);
  });
 });
});
