import express from "express";
import path from "node:path";
export type Stage = "applied" | "screening" | "interview" | "offer" | "rejected";
export type Application = { id:number; company:string; role:string; stage:Stage; appliedOn:string };
export const applications: Application[] = [];
export const app = express(); app.use(express.json());
const currentDir = process.cwd();
app.use(express.static(path.join(currentDir, "public")));
app.get("/", (_req,res)=>res.sendFile(path.join(currentDir, "public", "index.html")));
app.get("/health", (_req,res)=>res.json({status:"ok"}));
app.get("/applications", (_req,res)=>res.json(applications));
app.post("/applications", (req,res)=>{
  const {company,role,stage="applied",appliedOn=new Date().toISOString().slice(0,10)}=req.body;
  if(typeof company!=="string"||!company.trim()||typeof role!=="string"||!role.trim()) return res.status(400).json({error:"company and role are required"});
  const item={id:applications.length+1,company,role,stage,appliedOn}; applications.push(item); return res.status(201).json(item);
});
