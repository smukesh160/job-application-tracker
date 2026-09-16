import express from "express";
import path from "node:path";
export type Stage = "applied" | "screening" | "interview" | "offer" | "rejected";
export type Application = { id:number; company:string; role:string; stage:Stage; appliedOn:string };
export type Job = { id:number; url:string; company:string; role:string; description:string; score:number; matchedSkills:string[]; sponsorshipMentioned:boolean; cptOrOptMentioned:boolean };
export const applications: Application[] = [];
export const jobs: Job[] = [
  {id:1,url:"https://careers.microsoft.com/students/us/en/c/engineering-jobs",company:"Microsoft",role:"Summer 2027 Engineering Internships",description:"Software engineering, cloud, AI, product development, coding",score:75,matchedSkills:["python","azure","machine learning"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:2,url:"https://salesforce.wd12.myworkdayjobs.com/en-US/External_Career_Site/job/California---San-Francisco/Summer-2027-Intern---Software-Engineer_JR340771-1",company:"Salesforce",role:"Summer 2027 Intern - Software Engineer",description:"Software engineering, AI, cloud computing, APIs, software development",score:75,matchedSkills:["azure","llm","rest api"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:3,url:"https://capitalone.wd12.myworkdayjobs.com/en-US/Capital_One/job/Technology-Internship-Program---Summer-2027_R244387-1",company:"Capital One",role:"Technology Internship Program - Summer 2027",description:"Cloud computing, cybersecurity, data, machine learning, AI, software engineering",score:75,matchedSkills:["machine learning","python","sql"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:4,url:"https://careers.jpmorgan.com/us/en/students/programs/software-engineer-summer",company:"JPMorgan Chase",role:"Software Engineer Summer Intern",description:"Full stack, Python, Java, .NET, React, APIs, cloud, machine learning, infrastructure",score:88,matchedSkills:["python",".net","react","rest api","machine learning"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:5,url:"https://www.google.com/about/careers/applications/jobs/results/100648618540573382-software-engineering-intern/",company:"Google",role:"Software Engineering Intern, BS - Summer 2027",description:"Scalable distributed systems, computer science, algorithms, AI systems",score:82,matchedSkills:["python","machine learning","microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:6,url:"https://careersatdoordash.com/university-careers/",company:"DoorDash",role:"Software Engineer Intern - Summer 2027",description:"Software engineering, backend, scalable systems, APIs, distributed systems",score:62,matchedSkills:["rest api","microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:7,url:"https://careers.adobe.com/us/en/Interns",company:"Adobe",role:"U.S. Engineering Internships",description:"Software engineering, generative AI, cloud products, real-time collaboration",score:50,matchedSkills:["llm","machine learning","azure"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:8,url:"https://medtronic.wd1.myworkdayjobs.com/en-US/MedtronicCareers/job/Software-Engineering-Intern---Summer-2027_R73630-1",company:"Medtronic",role:"Software Engineering Intern - Summer 2027",description:"Software engineering, full-time summer internship, U.S. work authorization",score:38,matchedSkills:["c#",".net"],sponsorshipMentioned:true,cptOrOptMentioned:false},
  {id:9,url:"https://careers.servicenow.com/early-careers/",company:"ServiceNow",role:"Early Careers Software Engineering Internships",description:"Cloud software, software engineering, platform development, APIs",score:50,matchedSkills:["azure","rest api","microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:10,url:"https://jobs.apple.com/en-us/search?location=spring-SGX",company:"Apple",role:"Software Engineering Internships - U.S.",description:"Software engineering, cloud services, platforms, machine learning, systems",score:50,matchedSkills:["machine learning","microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false}
];
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
app.get("/jobs", (_req,res)=>res.json(jobs));
app.post("/jobs", (req,res)=>{
  const {url, company="Unknown company", role="Internship", description=""} = req.body ?? {};
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) return res.status(400).json({error:"a valid http(s) job URL is required"});
  const text = typeof description === "string" ? description.toLowerCase() : "";
  const matchedSkills = resumeSkills.filter(skill => text.includes(skill));
  const job: Job = {id:jobs.length+1,url,company:String(company),role:String(role),description:String(description),score:Math.min(98,Math.round((matchedSkills.length/8)*100)),matchedSkills,sponsorshipMentioned:/sponsor|sponsorship|h-1b|visa required|must be authorized/.test(text),cptOrOptMentioned:/cpt|opt|international student|f-1|student visa/.test(text)};
  jobs.push(job); return res.status(201).json(job);
});
app.get("/applications", (_req,res)=>res.json(applications));
app.post("/applications", (req,res)=>{
  const {company,role,stage="applied",appliedOn=new Date().toISOString().slice(0,10)}=req.body;
  if(typeof company!=="string"||!company.trim()||typeof role!=="string"||!role.trim()) return res.status(400).json({error:"company and role are required"});
  const item={id:applications.length+1,company,role,stage,appliedOn}; applications.push(item); return res.status(201).json(item);
});
