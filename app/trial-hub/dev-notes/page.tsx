
import React from 'react';
import { 
  Database, 
  GitBranch, 
  ShieldCheck, 
  Stethoscope, 
  Building2, 
  FileText, 
  Lock,
  ChevronRight
} from 'lucide-react';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionHeading = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
    <Icon className="text-indigo-600" size={24} />
    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
  </div>
);

const Entity = ({ name, desc }: { name: string, desc: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
    <div className="font-bold text-indigo-700 min-w-[100px] text-sm">{name}</div>
    <div className="text-sm text-slate-600 leading-snug">{desc}</div>
  </div>
);

const Step = ({ num, title }: { num: number, title: string }) => (
  <div className="flex flex-col items-center flex-1 text-center group">
    <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-200 text-indigo-600 font-bold flex items-center justify-center mb-2 group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-colors text-sm">
      {num}
    </div>
    <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-700">{title}</span>
  </div>
);

const PortalCard = ({ title, icon: Icon, color, features }: { title: string, icon: any, color: string, features: string[] }) => {
  const colorStyles: Record<string, string> = {
    violet: "border-t-violet-500 text-violet-700 bg-violet-50",
    emerald: "border-t-emerald-500 text-emerald-700 bg-emerald-50",
    blue: "border-t-blue-500 text-blue-700 bg-blue-50",
  };

  return (
    <Card className={`border-t-4 h-full ${colorStyles[color].replace('text-', 'border-t-').split(' ')[0]}`}> {/* Simplified dynamic class logic for border color */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-lg text-slate-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <ChevronRight size={14} className="mt-1 text-slate-400 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function DevelopmentNotesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            System Architecture
          </h1>
          <p className="text-slate-500">Core Entities • Workflow • Portals • Security</p>
        </div>

        {/* 0. Core Logic */}
        <section>
          <SectionHeading icon={Database} title="0. Core Entities & Flow" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
               <h3 className="font-semibold text-slate-700 mb-2">Key Data Models</h3>
               <Entity name="Clinician" desc="Identity, Credentials, Specialty, Patients" />
               <Entity name="Pharma" desc="Sponsor Company, Teams, Permissions" />
               <Entity name="Trial" desc="Protocol, I/E Criteria, Sites, Goals" />
               <Entity name="Match" desc="Trial ↔ Clinician Relationship State" />
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <h3 className="font-semibold text-slate-700 mb-6 text-center">Match Lifecycle</h3>
              <div className="flex items-center justify-between w-full relative">
                 {/* Connection Line */}
                 <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                 
                 <Step num={1} title="Prospect" />
                 <Step num={2} title="Invited" />
                 <Step num={3} title="Accepted" />
                 <Step num={4} title="Active" />
                 <Step num={5} title="Done" />
              </div>
            </div>
          </div>
        </section>

        {/* 1. Portals */}
        <section>
          <SectionHeading icon={Building2} title="1. Portal Architecture" />
          <div className="grid md:grid-cols-3 gap-6">
            <PortalCard 
              title="Admin" 
              icon={ShieldCheck} 
              color="violet"
              features={[
                "User Management (Clinician/Pharma)",
                "Trial Lifecycle & Approvals",
                "Matching Engine (Manual/Auto)",
                "Ops Analytics & Funnels",
                "Audit Logs & Compliance"
              ]}
            />
            <PortalCard 
              title="Clinician" 
              icon={Stethoscope} 
              color="emerald"
              features={[
                "Onboarding & Profile Verification",
                "Trial Invitations & Contracting",
                "Patient Lead Management",
                "AI Recruitment Assets",
                "PI Learning & SOP Chat"
              ]}
            />
            <PortalCard 
              title="Pharma" 
              icon={Building2} 
              color="blue"
              features={[
                "Trial Creation Wizard",
                "Clinician Pool Analytics",
                "Recruitment Forecasting",
                "Real-time Dashboards",
                "Collaboration Tools"
              ]}
            />
          </div>
        </section>

        {/* 2. Data & Security */}
        <section>
          <SectionHeading icon={FileText} title="2. Data & Security Strategy" />
          <div className="bg-slate-900 rounded-xl p-8 text-slate-300 grid md:grid-cols-2 gap-12">
            
            {/* MVP Fields */}
            <div>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Database size={18}/> Critical Data Fields (MVP)
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-emerald-400 font-mono text-xs uppercase tracking-wide block mb-1">Clinician</span>
                  <p>Specialty, License State, Institution Type, Patient Vol, Contact Info</p>
                </div>
                <div>
                  <span className="text-blue-400 font-mono text-xs uppercase tracking-wide block mb-1">Trial</span>
                  <p>Indication, Phase, I/E Summary, Geography, Enrollment Target, Timeline</p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Lock size={18}/> Isolation Rules
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-blue-500">●</span> 
                  <span>Pharma only sees <b>own trials</b> & aggregates.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">●</span> 
                  <span>Clinicians only see <b>accepted trials</b>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-500">●</span> 
                  <span>Patient data retention: <b>30/90 days</b>.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
