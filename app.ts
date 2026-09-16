import express from "express";
import path from "node:path";
export type Stage = "applied" | "screening" | "interview" | "offer" | "rejected";
export type Application = { id:number; company:string; role:string; stage:Stage; appliedOn:string };
export type Job = { id:number; url:string; company:string; role:string; description:string; score:number; matchedSkills:string[]; sponsorshipMentioned:boolean; cptOrOptMentioned:boolean };
export const applications: Application[] = [];
export const jobs: Job[] = [
  {id:1,url:"https://www.google.com/about/careers/applications/jobs/results/100648618540573382-software-engineering-intern/",company:"Google",role:"Software Engineering Intern, BS - Summer 2027",description:"Scalable distributed systems, computer science, algorithms, AI systems",score:82,matchedSkills:["python","machine learning","microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:2,url:"https://intel.wd1.myworkdayjobs.com/en-US/External/job/Software-Engineering---Intern--Bachelor-s_JR0286834",company:"Intel",role:"Software Engineering Intern - Spring/Summer 2027",description:"Software engineering internship, C++, Python, systems, cloud and software development",score:75,matchedSkills:["python","c++"],sponsorshipMentioned:true,cptOrOptMentioned:false},
  {id:3,url:"https://job-boards.greenhouse.io/andurilindustries/jobs/5148079007",company:"Anduril Industries",role:"2027 Software Engineer Intern",description:"Software engineering, distributed systems, algorithms, C++, Python, cloud",score:75,matchedSkills:["python","microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:4,url:"https://job-boards.greenhouse.io/spacex/jobs/8621757002",company:"SpaceX",role:"Summer 2027 Software Engineering Internship/Co-op",description:"Software engineering internship and co-op, systems, algorithms, software development",score:62,matchedSkills:["microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:5,url:"https://mastercard.wd1.myworkdayjobs.com/en-US/Campus/job/Software-Engineer-Intern--Summer-2027---United-States_R-287618-1",company:"Mastercard",role:"Software Engineer Intern - Summer 2027",description:"Software engineering, programming, APIs, data structures, cloud services",score:62,matchedSkills:["rest api","sql"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:6,url:"https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/NVIDIA-2027-Internships--Software-Engineering_JR2023495",company:"NVIDIA",role:"2027 Software Engineering Internships",description:"Software engineering, Python, C++, AI, machine learning, systems",score:75,matchedSkills:["python","machine learning","llm"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:7,url:"https://careers.roblox.com/jobs/8072713?gh_jid=8072713",company:"Roblox",role:"Software Engineer Intern - Summer 2027",description:"Software engineering, scalable systems, backend services, algorithms",score:50,matchedSkills:["microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:8,url:"https://www.dropbox.jobs/en/jobs/8106224/software-engineering-intern-summer-2027/",company:"Dropbox",role:"Software Engineering Intern - Summer 2027",description:"Software engineering, distributed systems, backend, cloud services",score:50,matchedSkills:["microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:9,url:"https://www.amazon.jobs/en/jobs/10529525/software-development-engineer-intern-co-op-robotics-2027",company:"Amazon Robotics",role:"Software Development Engineer Intern/Co-op - 2027",description:"Software development, C#, Python, TypeScript, cloud services, SQL, AI",score:75,matchedSkills:["c#","python","typescript","sql","microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false},
  {id:10,url:"https://www.amazon.jobs/en/jobs/10517567/software-development-engineer-intern-annapurna-labs-2027",company:"Amazon Annapurna Labs",role:"Software Development Engineer Intern - 2027",description:"Cloud-native systems, Python, C++, distributed systems, machine learning",score:62,matchedSkills:["python","machine learning","microservices"],sponsorshipMentioned:false,cptOrOptMentioned:false}
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
