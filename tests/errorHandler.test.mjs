import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import express from "express";
import { AppError } from "../src/errors/AppError.ts";
import { errorHandler } from "../src/middlewares/errorHandler.ts";

const app = express();
app.use((req, _res, next) => {
  req.log = { warn() {}, error() {} };
  next();
});
app.use(express.json({ limit: "32b" }));
app.use(express.urlencoded({ extended: true, limit: "32b" }));
app.post("/", (_req, res) => res.sendStatus(204));
app.get("/app-error", () => { throw new AppError(400, "Expected error"); });
app.get("/server-error", () => { throw new AppError(502, "Secret detail"); });
app.get("/unexpected", () => {
  throw Object.assign(new Error("Secret detail"), { type: "entity.other", status: 400 });
});
app.use(errorHandler);

let server;
let baseUrl;
before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

test("malformed JSON returns a safe 400 response", async () => {
  const response = await fetch(baseUrl, {
    method: "POST", headers: { "content-type": "application/json" }, body: '{"secret":',
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { success: false, message: "Invalid request body" });
});

for (const contentType of ["application/json", "application/x-www-form-urlencoded"]) {
  test(`oversized ${contentType} returns 413`, async () => {
    const response = await fetch(baseUrl, {
      method: "POST", headers: { "content-type": contentType }, body: "x".repeat(64),
    });
    assert.equal(response.status, 413);
    assert.deepEqual(await response.json(), { success: false, message: "Payload too large" });
  });
}

test("AppError responses and unexpected errors retain their behavior", async () => {
  for (const [path, status, message] of [
    ["/app-error", 400, "Expected error"],
    ["/server-error", 502, "Internal server error"],
    ["/unexpected", 500, "Internal server error"],
  ]) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, status);
    assert.deepEqual(await response.json(), { success: false, message });
  }
});
