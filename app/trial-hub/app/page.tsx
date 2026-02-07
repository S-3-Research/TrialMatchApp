"use client";

import React, { useState } from "react";
import {
  Users,
  Beaker,
  UserCheck,
  BarChart3,
  PlusCircle,
  Bell,
  Search,
  CheckCircle2,
  XCircle,
  MessageSquare,
  BookOpen,
  Settings,
  ClipboardList,
  ArrowRightLeft,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  FileText,
} from "lucide-react";

// --- Mock Data ---
const INITIAL_TRIALS = [
  {
    id: "T1",
    title: "Phase III Lung Cancer Study",
    phase: "Phase III",
    status: "matching",
    therapeuticArea: "Oncology",
    goal: 50,
    enrolled: 12,
    sponsor: "SponsorCore",
  },
  {
    id: "T2",
    title: "Type 2 Diabetes Digital Health Intervention",
    phase: "Phase II",
    status: "recruiting",
    therapeuticArea: "Endocrinology",
    goal: 100,
    enrolled: 45,
    sponsor: "MediLife",
  },
  {
    id: "T3",
    title: "Cardiovascular Risk Assessment for Elderly",
    phase: "Phase IV",
    status: "draft",
    therapeuticArea: "Cardiology",
    goal: 200,
    enrolled: 0,
    sponsor: "SponsorCore",
  },
];

const INITIAL_CLINICIANS = [
  {
    id: "C1",
    name: "Dr. Zhang Wei",
    specialty: "Oncology",
    location: "Shanghai",
    patients: "500+",
    verified: true,
    status: "registered",
  },
  {
    id: "C2",
    name: "Dr. Li Na",
    specialty: "Endocrinology",
    location: "Beijing",
    patients: "1000+",
    verified: true,
    status: "profile_complete",
  },
  {
    id: "C3",
    name: "Dr. Chen Tao",
    specialty: "Cardiology",
    location: "Guangzhou",
    patients: "300+",
    verified: false,
    status: "invited",
  },
];

const INITIAL_MATCHES = [
  {
    id: "M1",
    trialId: "T1",
    clinicianId: "C1",
    status: "accepted",
    leads: 8,
    enrolled: 3,
  },
  {
    id: "M2",
    trialId: "T2",
    clinicianId: "C2",
    status: "active_recruiting",
    leads: 25,
    enrolled: 12,
  },
];

// --- Shared UI Components ---
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-slate-100 bg-white/80 p-1 shadow-sm backdrop-blur-sm transition-all hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "blue" | "error" | "purple";
}) => {
  const styles = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    error: "bg-red-50 text-red-700 border-red-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
  color = "indigo",
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  color?: "indigo" | "emerald" | "slate" | "violet" | "teal" | "purple";
}) => {
  const activeStyles: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700",
    emerald: "bg-emerald-50 text-emerald-700",
    teal: "bg-teal-50 text-teal-700",
    slate: "bg-slate-100 text-slate-800",
    violet: "bg-violet-50 text-violet-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
        active
          ? activeStyles[color] || activeStyles.indigo
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
    >
      <Icon size={20} className={active ? "opacity-100" : "opacity-70"} />
      <span>{label}</span>
      {active && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-current opacity-40" />
      )}
    </button>
  );
};

// --- 1. Admin Portal ---
const AdminPortal = ({
  trials,
  clinicians,
}: {
  trials: typeof INITIAL_TRIALS;
  clinicians: typeof INITIAL_CLINICIANS;
}) => {
  const [view, setView] = useState("DASHBOARD");

  return (
    <div className="flex h-full">
      <aside className="w-64 flex-shrink-0 space-y-2 border-r border-slate-200/60 bg-white/50 p-4 backdrop-blur-xl">
        <div className="mb-8 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 font-bold tracking-tight text-white shadow-lg shadow-violet-200">
          ADMIN PANEL
        </div>
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={view === "DASHBOARD"}
          onClick={() => setView("DASHBOARD")}
          color="violet"
        />
        <SidebarItem
          icon={Beaker}
          label="Trials Ops"
          active={view === "TRIALS"}
          onClick={() => setView("TRIALS")}
          color="violet"
        />
        <SidebarItem
          icon={Users}
          label="Clinicians"
          active={view === "CLINICIANS"}
          onClick={() => setView("CLINICIANS")}
          color="violet"
        />
        <SidebarItem
          icon={ArrowRightLeft}
          label="Matching Console"
          active={view === "MATCHING"}
          onClick={() => setView("MATCHING")}
          color="violet"
        />
        <SidebarItem
          icon={ShieldCheck}
          label="Audit Log"
          active={view === "AUDIT"}
          onClick={() => setView("AUDIT")}
          color="violet"
        />
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
        {view === "DASHBOARD" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Operational Overview
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[
                {
                  label: "Active Trials",
                  val: trials.length,
                  icon: Beaker,
                  color: "text-blue-600 bg-blue-50",
                },
                {
                  label: "Total Clinicians",
                  val: clinicians.length,
                  icon: Users,
                  color: "text-violet-600 bg-violet-50",
                },
                {
                  label: "Avg. Match Rate",
                  val: "68%",
                  icon: Zap,
                  color: "text-amber-600 bg-amber-50",
                },
                {
                  label: "Enrollment KPI",
                  val: "92%",
                  icon: BarChart3,
                  color: "text-emerald-600 bg-emerald-50",
                },
              ].map((stat, i) => (
                <Card key={i} className="flex items-center space-x-4 p-5">
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-bold text-slate-800">
                      {stat.val}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <h3 className="mb-4 font-bold text-slate-800">Urgent Tasks</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm shadow-red-200"></div>
                    <span className="text-sm font-medium text-red-900">
                      Dr. Li Na needs verification for Trial T2
                    </span>
                  </div>
                  <button className="rounded-lg border border-red-200 bg-white px-4 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-50">
                    Review
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {view === "TRIALS" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                Trial Management
              </h2>
              <button className="flex items-center space-x-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-xl">
                <PlusCircle size={18} /> <span>Import Trial</span>
              </button>
            </div>
            <Card className="overflow-hidden p-0">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Trial Name
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Sponsor
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Phase
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trials.map((t) => (
                    <tr
                      key={t.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {t.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {t.sponsor}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {t.phase}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            t.status === "matching"
                              ? "warning"
                              : t.status === "recruiting"
                                ? "success"
                                : "default"
                          }
                        >
                          {t.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-sm font-bold text-violet-600 hover:text-violet-700">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {view === "MATCHING" && (
          <div className="grid h-full grid-cols-2 gap-8 pb-8">
            <div className="flex flex-col space-y-4">
              <h3 className="flex items-center space-x-2 font-bold text-slate-700">
                <Beaker size={20} className="text-violet-500" />{" "}
                <span>Select Trial</span>
              </h3>
              <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                {trials
                  .filter((t) => t.status === "matching")
                  .map((t) => (
                    <Card
                      key={t.id}
                      className="cursor-pointer border-2 border-transparent p-5 hover:border-violet-200 hover:bg-violet-50/30"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-800">
                            {t.title}
                          </div>
                          <div className="mt-1 text-xs font-medium text-slate-500">
                            {t.therapeuticArea} • {t.phase}
                          </div>
                        </div>
                        <Badge variant="warning">Awaiting Match</Badge>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="flex items-center space-x-2 font-bold text-slate-700">
                <Users size={20} className="text-violet-500" />{" "}
                <span>Recommended Clinicians</span>
              </h3>
              <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                {clinicians.map((c) => (
                  <Card
                    key={c.id}
                    className="flex items-center justify-between p-5"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-400">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {c.specialty} • {c.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                        Profile
                      </button>
                      <button className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-violet-700">
                        Invite
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- 2. Clinician Portal ---
const ClinicianPortal = ({ trials }: { trials: typeof INITIAL_TRIALS }) => {
  const [view, setView] = useState("DASHBOARD");
  const [showInvitation, setShowInvitation] = useState(true);

  return (
    <div className="flex h-full">
      <aside className="w-64 flex-shrink-0 space-y-2 border-r border-slate-200/60 bg-white/50 p-4 backdrop-blur-xl">
        <div className="mb-8 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 font-bold tracking-tight text-white shadow-lg shadow-teal-200">
          CLINICIAN HUB
        </div>
        <SidebarItem
          icon={LayoutDashboard}
          label="Overview"
          active={view === "DASHBOARD"}
          onClick={() => setView("DASHBOARD")}
          color="teal"
        />
        <SidebarItem
          icon={Bell}
          label="Opportunities"
          active={view === "OPPORTUNITIES"}
          onClick={() => setView("OPPORTUNITIES")}
          color="teal"
        />
        <SidebarItem
          icon={ClipboardList}
          label="My Active Trials"
          active={view === "MY_TRIALS"}
          onClick={() => setView("MY_TRIALS")}
          color="teal"
        />
        <SidebarItem
          icon={BookOpen}
          label="PI Learning Center"
          active={view === "LEARNING"}
          onClick={() => setView("LEARNING")}
          color="teal"
        />
        <SidebarItem
          icon={Settings}
          label="Profile & Settings"
          active={view === "PROFILE"}
          onClick={() => setView("PROFILE")}
          color="teal"
        />
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
        {view === "DASHBOARD" && (
          <div className="mx-auto max-w-5xl space-y-8">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Welcome, Dr. Zhang
                </h2>
                <p className="mt-1 text-slate-500">
                  You have 1 new trial invitation waiting for response.
                </p>
              </div>
              <Card className="flex items-center space-x-3 px-5 py-3">
                <span className="text-sm font-bold text-slate-600">
                  PI Readiness:
                </span>
                <div className="h-3 w-32 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-3/4 rounded-full bg-teal-500"></div>
                </div>
                <span className="text-sm font-bold text-teal-600">75%</span>
              </Card>
            </header>

            {showInvitation && (
              <Card className="flex flex-col items-center justify-between border-2 border-teal-100 bg-teal-50/30 p-6 md:flex-row">
                <div className="flex items-center space-x-6">
                  <div className="rounded-2xl bg-white p-4 text-teal-600 shadow-sm">
                    <Beaker size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-teal-900">
                      New Trial Invitation
                    </h4>
                    <p className="text-teal-700">
                      Phase III Lung Cancer Study • SponsorCore
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4 md:mt-0">
                  <button
                    onClick={() => setShowInvitation(false)}
                    className="rounded-xl px-4 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-100"
                  >
                    Decline
                  </button>
                  <button className="rounded-xl bg-teal-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-teal-200 transition hover:bg-teal-700 hover:shadow-xl">
                    Review & Accept
                  </button>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card className="p-8">
                <h3 className="mb-6 flex items-center space-x-3 text-lg font-bold text-slate-800">
                  <BarChart3 size={20} className="text-teal-500" />{" "}
                  <span>Recruitment Funnel</span>
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      label: "Leads Shared",
                      count: 42,
                      color: "bg-teal-500",
                    },
                    {
                      label: "Pre-screened",
                      count: 28,
                      color: "bg-blue-500",
                    },
                    { label: "Consented", count: 18, color: "bg-indigo-500" },
                    { label: "Enrolled", count: 12, color: "bg-violet-500" },
                  ].map((step, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-500">
                          {step.label}
                        </span>
                        <span className="font-bold text-slate-900">
                          {step.count}
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${(step.count / 42) * 100}%`,
                            backgroundColor: step.color.replace("bg-", ""),
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-none bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl">
                <h3 className="mb-6 flex items-center space-x-3 text-lg font-bold text-teal-100">
                  <MessageSquare size={20} /> <span>AI Trial Assistant</span>
                </h3>
                <div className="mb-6 rounded-2xl bg-white/10 p-5 text-sm font-medium italic leading-relaxed text-slate-200 backdrop-blur-sm">
                  &ldquo;Hi Dr. Zhang, the Lung Cancer study requires patients
                  to have had no prior immunotherapy. Would you like me to draft
                  an internal screening memo for your staff?&rdquo;
                </div>
                <div className="flex space-x-3">
                  <input
                    className="flex-1 rounded-xl border-none bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 backdrop-blur-sm transition focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    placeholder="Ask AI about study protocols..."
                  />
                  <button className="rounded-xl bg-teal-500 p-3 text-white transition hover:bg-teal-400">
                    <PlusCircle size={20} />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {view === "LEARNING" && (
          <div className="mx-auto max-w-5xl space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">
              PI Learning Path
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "GCP Certification",
                  status: "Completed",
                  icon: ShieldCheck,
                  color: "text-teal-500",
                },
                {
                  title: "Protocol Design 101",
                  status: "In Progress",
                  icon: FileText,
                  color: "text-blue-500",
                },
                {
                  title: "Adverse Event Reporting",
                  status: "Locked",
                  icon: XCircle,
                  color: "text-slate-300",
                },
              ].map((course, i) => (
                <Card key={i} className="flex flex-col space-y-4 p-6">
                  <div className="mb-2">
                    <course.icon size={40} className={course.color} />
                  </div>
                  <div className="flex-1 text-lg font-bold text-slate-800">
                    {course.title}
                  </div>
                  <div>
                    <Badge
                      variant={
                        course.status === "Completed"
                          ? "success"
                          : course.status === "In Progress"
                            ? "warning"
                            : "default"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- 3. Sponsor/CRO Portal ---
const SponsorCROPortal = ({ trials }: { trials: typeof INITIAL_TRIALS }) => {
  const [view, setView] = useState("DASHBOARD");
  const [step, setStep] = useState(1);

  return (
    <div className="flex h-full bg-white">
      <aside className="w-64 flex-shrink-0 space-y-2 border-r border-slate-200/60 bg-white/50 p-4 backdrop-blur-xl">
        <div className="mb-8 rounded-xl bg-slate-900 px-4 py-3 font-bold tracking-tight text-white shadow-lg shadow-slate-200">
          SPONSOR/CRO
        </div>
        <SidebarItem
          icon={LayoutDashboard}
          label="Portfolio Dashboard"
          active={view === "DASHBOARD"}
          onClick={() => setView("DASHBOARD")}
          color="slate"
        />
        <SidebarItem
          icon={Beaker}
          label="Trial Registry"
          active={view === "TRIALS"}
          onClick={() => setView("TRIALS")}
          color="slate"
        />
        <SidebarItem
          icon={PlusCircle}
          label="New Study Protocol"
          active={view === "CREATE"}
          onClick={() => setView("CREATE")}
          color="slate"
        />
        <SidebarItem
          icon={BarChart3}
          label="Insights & Forecasts"
          active={view === "INSIGHTS"}
          onClick={() => setView("INSIGHTS")}
          color="slate"
        />
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
        {view === "DASHBOARD" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">
              Clinical Pipeline Performance
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="p-6 transition hover:-translate-y-1">
                <h4 className="mb-2 text-sm font-medium text-slate-500">
                  Total Patients Enrolled
                </h4>
                <div className="text-4xl font-black text-slate-900">1,204</div>
                <div className="mt-3 flex items-center text-sm font-bold text-emerald-600">
                  <Zap size={16} className="mr-1 fill-current" /> +12% from last
                  month
                </div>
              </Card>
              <Card className="p-6 transition hover:-translate-y-1">
                <h4 className="mb-2 text-sm font-medium text-slate-500">
                  Active Site Performance
                </h4>
                <div className="text-4xl font-black text-slate-900">
                  42 Sites
                </div>
                <div className="mt-3 text-sm font-medium text-indigo-600">
                  Top site: Dr. Li Na (85% conv)
                </div>
              </Card>
              <Card className="p-6 transition hover:-translate-y-1">
                <h4 className="mb-2 text-sm font-medium text-slate-500">
                  Matching Pool Coverage
                </h4>
                <div className="text-4xl font-black text-slate-900">3,500+</div>
                <div className="mt-3 cursor-pointer text-sm font-bold text-slate-400 decoration-2 underline-offset-2 hover:text-slate-600 hover:underline">
                  View candidate heatmap
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden p-0 shadow-md">
              <div className="border-b border-slate-100 bg-slate-50/50 p-5 font-bold text-slate-800">
                Ongoing Studies Registry
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Study Title
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Match Queue
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Enrollment Progress
                    </th>
                    <th className="px-6 py-4 font-bold tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trials.map((t) => (
                    <tr
                      key={t.id}
                      className="text-sm transition-colors hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {t.title}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 shadow-sm"
                            ></div>
                          ))}
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500 shadow-sm">
                            +12
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-slate-800 transition-all duration-1000"
                              style={{
                                width: `${(t.enrolled / t.goal) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs font-black text-slate-700">
                            {Math.round((t.enrolled / t.goal) * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            t.status === "recruiting" ? "success" : "warning"
                          }
                        >
                          {t.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {view === "CREATE" && (
          <div className="mx-auto max-w-3xl py-8">
            <div className="mb-10">
              <div className="mb-4 flex items-end justify-between">
                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  Configure New Study
                </h2>
                <span className="mb-1 font-mono text-sm font-medium text-slate-500">
                  Step {step} / 3
                </span>
              </div>
              <div className="flex h-2 space-x-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`flex-1 transition-all duration-500 ${step >= 1 ? "bg-slate-900" : "bg-transparent"}`}
                ></div>
                <div
                  className={`flex-1 transition-all duration-500 ${step >= 2 ? "bg-slate-900" : "bg-transparent"}`}
                ></div>
                <div
                  className={`flex-1 transition-all duration-500 ${step >= 3 ? "bg-slate-900" : "bg-transparent"}`}
                ></div>
              </div>
            </div>

            {step === 1 && (
              <Card className="space-y-6 p-8">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Study Title
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-0"
                    placeholder="e.g. COVID-24 Booster Efficacy Trial"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Therapeutic Area
                    </label>
                    <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white">
                      <option>Oncology</option>
                      <option>Cardiology</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Trial Phase
                    </label>
                    <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white">
                      <option>Phase II</option>
                      <option>Phase III</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
                  >
                    Continue to Inclusion Criteria
                  </button>
                </div>
              </Card>
            )}
            {step === 2 && (
              <Card className="space-y-6 p-8">
                <div>
                  <h4 className="text-lg font-bold text-slate-800">
                    Inclusion/Exclusion Criteria (Matching Keys)
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Our matching engine will use these keywords to identify
                    compatible clinicians based on their patient database
                    patterns.
                  </p>
                </div>
                <textarea
                  rows={8}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-800 outline-none transition focus:border-slate-900 focus:bg-white"
                  placeholder="Patients aged 18-65... No previous history of..."
                  defaultValue="1. Male or Female age >= 18 years&#10;2. Diagnosis of EGFR+ Non-Small Cell Lung Cancer&#10;3. Failed at least one prior systemic therapy"
                />
                <div className="flex space-x-4 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-xl border border-slate-200 py-3 font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-xl bg-slate-900 py-3 font-bold text-white transition hover:bg-slate-800 hover:shadow-lg"
                  >
                    Proceed to Match Preview
                  </button>
                </div>
              </Card>
            )}
            {step === 3 && (
              <div className="space-y-8 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xl shadow-emerald-100">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">
                    Ready to Launch
                  </h3>
                  <p className="text-slate-500">
                    Your protocol is ready for distribution
                  </p>
                </div>

                <Card className="p-8 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-500">
                        Estimated Matching Clinicians
                      </div>
                      <div className="mt-1 text-3xl font-black text-slate-800">
                        156 Matches
                      </div>
                    </div>
                    <div className="rounded-lg bg-indigo-50 px-4 py-2 font-bold text-indigo-600">
                      94% Confidence
                    </div>
                  </div>
                </Card>
                <button
                  onClick={() => {
                    setView("DASHBOARD");
                    setStep(1);
                  }}
                  className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-2xl"
                >
                  Activate Trial & Auto-Invite
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// --- Main App Entry ---
export default function TrialHubApp() {
  const [currentPortal, setCurrentPortal] = useState<
    "ADMIN" | "CLINICIAN" | "SPONSOR_CRO"
  >("ADMIN");

  const getPortalStyles = (portal: typeof currentPortal) => {
    switch (portal) {
      case "ADMIN":
        return "bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/50";
      case "CLINICIAN":
        return "bg-gradient-to-br from-teal-50/50 via-white to-emerald-50/50";
      case "SPONSOR_CRO":
        return "bg-gradient-to-br from-slate-50 via-white to-gray-100/50";
      default:
        return "bg-white";
    }
  };

  return (
    <div
      className={`flex h-screen flex-col font-sans text-slate-900 antialiased transition-colors duration-500 ${getPortalStyles(currentPortal)}`}
    >
      {/* Portal Switcher Navigation */}
      <nav className="sticky top-0 z-50 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 backdrop-blur-xl transition-all">
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-xl font-black tracking-tighter text-slate-900">
            <div className="mr-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-200">
              <span className="text-lg">T</span>
            </div>
            TRIAL<span className="text-violet-600">HUB</span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex space-x-1 rounded-xl bg-slate-100/80 p-1 backdrop-blur-sm">
            {(["ADMIN", "CLINICIAN", "SPONSOR_CRO"] as const).map((p) => {
              const active = currentPortal === p;
              let activeClass = "bg-white text-slate-900 shadow-sm ring-1 ring-black/5";
              if (active) {
                if (p === "ADMIN") activeClass = "bg-white text-violet-700 shadow-sm ring-1 ring-violet-100";
                if (p === "CLINICIAN") activeClass = "bg-white text-teal-700 shadow-sm ring-1 ring-teal-100";
                if (p === "SPONSOR_CRO") activeClass = "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200";
              }

              const displayLabel = p === "SPONSOR_CRO" ? "SPONSOR/CRO" : p;

              return (
                <button
                  key={p}
                  onClick={() => setCurrentPortal(p)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                    active
                      ? activeClass
                      : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <button className="text-slate-400 transition hover:text-slate-600">
            <Search size={20} />
          </button>
          <button className="relative text-slate-400 transition hover:text-slate-600">
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-red-500 shadow-sm"></span>
          </button>
          <div className="h-9 w-9 rounded-full border border-slate-200 bg-slate-100 shadow-inner">
             {/* Simple Avatar Placeholder */}
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
               {currentPortal === "CLINICIAN" ? "DR" : "AD"}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Areas */}
      <div className="flex-1 overflow-hidden">
        {currentPortal === "ADMIN" && (
          <AdminPortal
            trials={INITIAL_TRIALS}
            clinicians={INITIAL_CLINICIANS}
          />
        )}
        {currentPortal === "CLINICIAN" && (
          <ClinicianPortal trials={INITIAL_TRIALS} />
        )}
        {currentPortal === "SPONSOR_CRO" && <SponsorCROPortal trials={INITIAL_TRIALS} />}
      </div>

      {/* Footer Branding Info */}
      <footer className="flex h-10 items-center justify-between border-t border-slate-200/60 bg-white/40 px-6 text-[10px] font-medium text-slate-400 backdrop-blur-sm">
        <div>© 2024 Clinical Trial Management Framework v1.0</div>
        <div className="flex space-x-6">
          <span className="flex items-center space-x-1">
             <ShieldCheck size={12}/> <span>GDPR Compliant</span>
          </span>
           <span className="flex items-center space-x-1">
             <FileText size={12}/> <span>HIPAA Audit Passed</span>
          </span>
          <span className="flex items-center space-x-1 font-bold text-violet-600/70">
            <ShieldCheck size={12}/> <span>Secure Environment</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
