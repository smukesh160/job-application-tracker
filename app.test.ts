import { describe, expect, it, beforeEach } from "vitest";
import request from "supertest";
import { app, applications } from "./app.js";
beforeEach(()=>applications.length=0);
describe("applications API",()=>{
  it("creates an application",async()=>{const r=await request(app).post("/applications").send({company:"Acme",role:"Backend Intern"}); expect(r.status).toBe(201); expect(r.body.stage).toBe("applied");});
  it("validates required fields",async()=>{expect((await request(app).post("/applications").send({company:""})).status).toBe(400);});
});
