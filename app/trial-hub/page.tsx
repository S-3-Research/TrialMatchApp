import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Cpu, 
  UserCheck, 
  BarChart3, 
  Globe, 
  CheckCircle2, 
  Shield 
} from 'lucide-react';

const Badge = ({ children, variant = 'blue', className = '' }: { children: React.ReactNode, variant?: string, className?: string }) => {
  const baseClasses = "inline-flex items-center rounded-full text-xs font-medium ring-1 ring-inset";
  const variants: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 ring-blue-700/10",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-700/10",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  };
  return (
    <span className={`${baseClasses} ${variants[variant] || variants.blue} ${className}`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-2xl bg-white shadow-sm border border-slate-100 ${className}`}>
    {children}
  </div>
);

export default function TrialHub() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="blue" className="mb-4 py-1 px-4">Intelligent Clinical Trial Matching Platform</Badge>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Accelerate Clinical Discovery, <span className="text-indigo-600">Precisely Connect</span> Researchers
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
            TrialHub utilizes AI technology to bridge pharmaceutical companies and top clinicians, streamlining recruitment, enhancing patient enrollment efficiency, and empowering PI career growth.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/trial-hub/app"
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 flex items-center gap-2 transition-all shadow-lg shadow-slate-200"
            >
              Pharma Portal <ArrowRight size={18} />
            </Link>
            <Link 
              href="/trial-hub/app"
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-all shadow-lg shadow-emerald-100"
            >
              Clinician Portal <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 hover:border-indigo-300 transition-all border-2 border-transparent">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">AI Smart Matching</h3>
            <p className="text-slate-600">
              Automatically screens optimal sites and investigators based on massive clinical data and eligibility criteria, reducing the initial screening cycle by over 70%.
            </p>
          </Card>
          <Card className="p-8 hover:border-emerald-300 transition-all border-2 border-transparent">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <UserCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Investigator Growth Path</h3>
            <p className="text-slate-600">
              Provides comprehensive training and trial opportunities from Sub-I to PI, establishing a digital reputation profile for researchers.
            </p>
          </Card>
          <Card className="p-8 hover:border-blue-300 transition-all border-2 border-transparent">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Digital Operations Dashboard</h3>
            <p className="text-slate-600">
              Real-time monitoring of recruitment funnels, patient conversion, and compliance across sites, allowing data-driven decisions to mitigate trial risks.
            </p>
          </Card>
        </div>
      </section>

      {/* Stakeholder Perspective */}
      <section className="bg-indigo-900 py-20 px-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
          <Globe size={400} />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Meeting Needs Across Clinical Trials</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center"><CheckCircle2 size={18}/></div>
                  <div>
                    <h4 className="font-bold mb-1">Sponsors (Pharma)</h4>
                    <p className="text-indigo-200 text-sm">Efficiently publish protocols, quickly identify high-quality sites, and monitor recruitment progress in real-time.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center"><CheckCircle2 size={18}/></div>
                  <div>
                    <h4 className="font-bold mb-1">Clinicians</h4>
                    <p className="text-indigo-200 text-sm">Access matched research projects, enhance departmental research influence, and leverage AI assistants to simplify documentation.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center"><CheckCircle2 size={18}/></div>
                  <div>
                    <h4 className="font-bold mb-1">Platform Operations (Admin)</h4>
                    <p className="text-indigo-200 text-sm">Full-process compliance audits, precise supply-demand matching, and data-driven service quality management.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
               <div className="flex items-center gap-2 mb-6 text-indigo-300 uppercase text-xs font-bold tracking-widest"><Shield size={16}/> Security & Compliance</div>
               <p className="text-lg leading-relaxed mb-6 italic">
                &ldquo;TrialHub strictly adheres to GDPR and HIPAA data privacy standards. All patient information is rigorously anonymized to ensure the highest security standards for clinical data.&rdquo;
               </p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-400"></div>
                 <div>
                   <div className="font-bold text-sm">Compliance Officer</div>
                   <div className="text-xs text-indigo-300">Data Security Division</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-6 text-center border-t border-slate-200">
        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mb-8">Trusted By Industry Leaders</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
          <div className="font-black text-2xl italic">PharmaCore</div>
          <div className="font-black text-2xl italic">MediLife</div>
          <div className="font-black text-2xl italic">BioGlobal</div>
          <div className="font-black text-2xl italic">ClinicalAI</div>
        </div>
      </section>
    </div>
  );
}
