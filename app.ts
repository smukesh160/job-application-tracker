import express from "express";
import path from "node:path";
export type Stage = "applied" | "screening" | "interview" | "offer" | "rejected";
export type Application = { id:number; company:string; role:string; stage:Stage; appliedOn:string };
export const applications: Application[] = [];
export const app = express(); app.use(express.json());
const currentDir = process.cwd();
const resumeSkills = ['c#', '.net', 'python', 'java', 'javascript', 'typescript', 'sql', 'azure', 'docker', 'kubernetes', 'terraform', 'rest api', 'microservices', 'llm', 'prompt engineering', 'machine learning', 'ci/cd', 'react'];
app.use(express.static(path.join(currentDir, "public")));
app.get("/", (_req,res)=>res.sendFile(path.join(currentDir, "public", "index.html")));
app.get("/health", (_req,res)=>res.json({status:"ok"}));
app.get("/profile", (_req,res)=>res.json({target:"Summer 2027 U.S. internship",workAuthorization:"F-1 CPT/OPT",roles:["Software Engineering","Backend","Cloud/DevOps","AI/ML Platform","Full-Stack"],skills:resumeSkills}));
app.post("/match", (req,res)=>{
  const description = typeof req.body?.description === "string" ? req.body.description.toLowerCase() : "";
  if (!description.trim()) return res.status(400).json({error:"job description is required"});
  const matched = resumeSkills.filter(skill => description.includes(skill));
  const sponsorship = /sponsor|sponsorship|h-1b|visa required|must be authorized/.test(description);
  const cptFriendly = /cpt|opt|international student|f-1|student visa/.test(description);
  const score = Math.min(98, Math.round((matched.length / 8) * 100));
  return res.json({score, matchedSkills:matched, flags:{sponsorshipMentioned:sponsorship,cptOrOptMentioned:cptFriendly},approvalRequired:true});
});
app.get("/applications", (_req,res)=>res.json(applications));
app.post("/applications", (req,res)=>{
  const {company,role,stage="applied",appliedOn=new Date().toISOString().slice(0,10)}=req.body;
  if(typeof company!=="string"||!company.trim()||typeof role!=="string"||!role.trim()) return res.status(400).json({error:"company and role are required"});
  const item={id:applications.length+1,company,role,stage,appliedOn}; applications.push(item); return res.status(201).json(item);
});
