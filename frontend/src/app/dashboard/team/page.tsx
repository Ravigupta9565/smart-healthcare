'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Deliverable {
  icon: string;
  text: string;
}

interface TeamMemberCard {
  id: string;
  cardIndex: string;
  tag: string;
  tagIcon: string;
  ribbon: string;
  name: string;
  role: string;
  institution: string;
  image?: string;
  initials: string;
  avatarBg: string;
  executiveContribution: string;
  coreDeliverables: Deliverable[];
  techStack: string[];
}

const TEAM_CARDS: TeamMemberCard[] = [
  {
    id: 'ravi-gupta',
    cardIndex: '01 / 04',
    tag: 'Team Leader',
    tagIcon: '⚙️',
    ribbon: '👑 TEAM LEADER',
    name: 'Ravi Gupta',
    role: 'Team Lead • Full-Stack Architect & Cloud Lead',
    institution: 'BBD University • Academic Capstone 2026',
    image: '/images/ravi.jpg',
    initials: 'RG',
    avatarBg: 'from-cyan-600 via-teal-700 to-blue-900',
    executiveContribution:
      'Conceived, engineered, and steered the complete platform architecture: FastAPI REST Gateway, 6 Healthcare Clinical Engines (AI Symptom Triage, Heart & Diabetic Risk Scoring, Appointment Sync, Medicine Reminders), Multi-Engine AI integration, and production cloud deployments on Render & Vercel.',
    coreDeliverables: [
      { icon: '⚡', text: 'FastAPI REST Gateway & 15+ Secure Healthcare Endpoints' },
      { icon: '🌐', text: 'Multi-Engine AI Clinical Assistant (Gemini & Rule Inference)' },
      { icon: '📊', text: 'Interactive Patient & Doctor Clinical Portals (Next.js 16)' },
      { icon: '⚙️', text: 'SQLite / SQLAlchemy Healthcare Data Persistence & Auth' },
    ],
    techStack: [
      'Python 3.13',
      'FastAPI',
      'Next.js 16',
      'React 19',
      'TailwindCSS',
      'SQLite',
      'JWT Auth',
      'Render Cloud',
    ],
  },
  {
    id: 'dhuru-madhuwal',
    cardIndex: '02 / 04',
    tag: 'Core Developer',
    tagIcon: '⚙️',
    ribbon: '🧠 DEVELOPER LEAD',
    name: 'Dhuru',
    role: 'Core Developer • Developer Lead',
    institution: 'BBD University • Academic Capstone 2026',
    image: '/images/dhuru.jpg',
    initials: 'DM',
    avatarBg: 'from-indigo-600 via-purple-700 to-cyan-900',
    executiveContribution:
      'Spearheaded the healthcare intelligence pipelines, designing predictive risk assessment algorithms for cardiovascular disease, diabetes, and symptom triage heuristic models powered by Google Gemini AI with high clinical confidence thresholds.',
    coreDeliverables: [
      { icon: '⚡', text: 'Google Gemini AI Clinical Health Assistant Engine' },
      { icon: '🌐', text: 'Cardiovascular & Diabetes Multi-Factor Risk Scoring' },
      { icon: '📊', text: 'Interactive Symptom Triage & Anomaly Detection Pipeline' },
      { icon: '⚙️', text: 'Biometric Health Analytics & Diagnostic Confidence Logic' },
    ],
    techStack: [
      'Python 3.13',
      'Google Gemini AI',
      'Scikit-learn',
      'Pandas',
      'NumPy',
      'FastAPI',
      'Pydantic v2',
    ],
  },
  {
    id: 'shikhar-srivastava',
    cardIndex: '03 / 04',
    tag: 'Lead Author',
    tagIcon: '✦',
    ribbon: '✍️ GIT CONTRIBUTOR',
    name: 'Shikhar',
    role: 'Lead Author • Git Contributor',
    institution: 'BBD University • Academic Capstone 2026',
    image: '/images/shikhar.jpg',
    initials: 'SS',
    avatarBg: 'from-emerald-600 via-teal-700 to-cyan-900',
    executiveContribution:
      'Architected the modern responsive frontend interface, clinical appointment scheduler, real-time vital graphs with Recharts, and accessible patient-doctor experience workflows with sleek cybernetic micro-interactions.',
    coreDeliverables: [
      { icon: '⚡', text: 'Responsive Modern Healthcare Dashboard & Clinical UI' },
      { icon: '🌐', text: 'Interactive Recharts Vitals Analytics & Trend Visualizer' },
      { icon: '📊', text: 'Medicine Schedule Tracker & Instant Dispense Logger' },
      { icon: '⚙️', text: 'Tailwind CSS Design System with Micro-interactions' },
    ],
    techStack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Recharts',
      'Lucide Icons',
      'HTML5/CSS3',
    ],
  },
  {
    id: 'sachin-yadav',
    cardIndex: '04 / 04',
    tag: 'Backend Engineer',
    tagIcon: '⚡',
    ribbon: '🗄️ BACKEND & DB LEAD',
    name: 'Sachin',
    role: 'Backend Engineer • Database & API Lead',
    institution: 'BBD University • Academic Capstone 2026',
    image: '/images/sachin.jpg',
    initials: 'SY',
    avatarBg: 'from-blue-600 via-indigo-700 to-cyan-900',
    executiveContribution:
      'Designed reliable backend services, healthcare data models, authentication flows, and API infrastructure that keep appointments, medicines, and clinical metrics consistent across the platform.',
    coreDeliverables: [
      { icon: '⚡', text: 'Healthcare Database Schema & SQLAlchemy Models' },
      { icon: '🌐', text: 'Appointments, Medicines & Health Metrics APIs' },
      { icon: '📊', text: 'Secure Authentication and Role-Based Access' },
      { icon: '⚙️', text: 'Backend Data Integrity and Service Integration' },
    ],
    techStack: [
      'Python 3.13',
      'FastAPI',
      'SQLAlchemy',
      'SQLite',
      'Pydantic v2',
      'Bcrypt',
    ],
  },
];

export default function TeamPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');
  const [isAnimating, setIsAnimating] = useState(false);

  const activeCard = TEAM_CARDS[currentIndex];

  const handleNext = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % TEAM_CARDS.length);
    setTimeout(() => setIsAnimating(false), 250);
  }, []);

  const handlePrev = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + TEAM_CARDS.length) % TEAM_CARDS.length);
    setTimeout(() => setIsAnimating(false), 250);
  }, []);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'flashcard') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, viewMode]);

  return (
    <div className="min-h-full w-full bg-[#050813] text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 lg:p-8 relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Ambient Neon Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />

      {/* Top Header & Status Bar */}
      <header className="w-full max-w-2xl flex items-center justify-between mb-4 sm:mb-6 px-1 z-10">
        {/* Left: Engineering Flashcard Counter */}
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs sm:text-sm font-semibold tracking-wide">
          <span className="text-base sm:text-lg animate-pulse">📢</span>
          <span>Engineering Flashcard</span>
          <span className="text-cyan-600">•</span>
          <span className="text-cyan-300 font-bold tracking-wider">
            {viewMode === 'flashcard' ? activeCard.cardIndex : `ALL 04 CARDS`}
          </span>
        </div>

        {/* Right: Live App badge & Close/Back Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live App Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[11px] font-medium shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>Live App</span>
          </div>

          {/* Grid / Flashcard View Mode Switcher */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'flashcard' ? 'grid' : 'flashcard')}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all font-mono"
            title="Toggle View Mode"
          >
            {viewMode === 'flashcard' ? '▦ Grid' : '🗂 Flashcard'}
          </button>

          {/* Close Action */}
          <button
            type="button"
            onClick={() => router.back()}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0b1325] border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-all shadow-sm"
            title="Close / Back"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Main Flashcard View */}
      {viewMode === 'flashcard' ? (
        <div className="w-full flex flex-col items-center z-10">
          {/* Interactive Flashcard Card */}
          <div
            className={`w-full max-w-[440px] sm:max-w-[460px] relative rounded-[28px] sm:rounded-[32px] bg-[#070e1b]/95 border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.22)] backdrop-blur-md p-5 sm:p-7 transition-all duration-300 ${
              isAnimating ? 'opacity-80 scale-[0.98]' : 'opacity-100 scale-100'
            }`}
          >
            {/* Card Inner Top Header Row */}
            <div className="flex items-center justify-between gap-2 mb-4 sm:mb-5">
              {/* Left Pill: Team Leader / Role Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 text-xs font-semibold shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                <span>{activeCard.tagIcon}</span>
                <span>{activeCard.tag}</span>
              </div>

              {/* Right: Tap to Swap interactive button */}
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400/85 hover:text-cyan-300 transition-colors cursor-pointer group active:scale-95"
                title="Click to swap to next team member"
              >
                <span className="transition-transform duration-300 group-hover:rotate-180">🔄</span>
                <span className="font-medium">Tap to Swap</span>
              </button>
            </div>

            {/* Profile Avatar with Glowing Cyan Neon Rings & Overlapping Ribbon */}
            <div className="relative flex flex-col items-center justify-center my-3 sm:my-4">
              {/* Circular Avatar Container */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-cyan-400 ring-offset-4 ring-offset-[#070e1b] shadow-[0_0_28px_rgba(6,182,212,0.45)] overflow-hidden bg-gradient-to-br from-slate-900 to-cyan-950 flex items-center justify-center">
                {activeCard.image ? (
                  <Image
                    src={activeCard.image}
                    alt={`${activeCard.name} profile photo`}
                    fill
                    sizes="(max-width: 640px) 112px, 128px"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${activeCard.avatarBg} flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white tracking-wider`}
                  >
                    {activeCard.initials}
                  </div>
                )}
              </div>

              {/* Overlapping Ribbon Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-[#061826] border border-cyan-400 text-cyan-300 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.35)]">
                  {activeCard.ribbon}
                </span>
              </div>
            </div>

            {/* Member Identity & Subtitle */}
            <div className="text-center mt-5 mb-4">
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight leading-snug">
                {activeCard.name}
              </h1>
              <p className="text-xs sm:text-[13px] font-semibold text-cyan-400 mt-1">
                {activeCard.role}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium tracking-wide">
                {activeCard.institution}
              </p>
            </div>

            {/* Section: EXECUTIVE CONTRIBUTION */}
            <div className="mt-4 sm:mt-5 text-left">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-cyan-500/90 mb-1.5">
                EXECUTIVE CONTRIBUTION
              </h2>
              <p className="text-xs sm:text-[12.5px] text-slate-300 leading-relaxed font-normal">
                {activeCard.executiveContribution}
              </p>
            </div>

            {/* Section: CORE DELIVERABLES AUTHORED */}
            <div className="mt-4 sm:mt-5 text-left">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-cyan-500/90 mb-2.5">
                CORE DELIVERABLES AUTHORED
              </h2>
              <div className="space-y-2">
                {activeCard.coreDeliverables.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 bg-[#0c1527] border border-cyan-950/80 hover:border-cyan-500/30 rounded-xl px-3.5 py-2.5 transition-colors shadow-sm text-xs sm:text-[12.5px] text-slate-200"
                  >
                    <span className="text-cyan-400 text-sm shrink-0">{item.icon}</span>
                    <span className="leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Tech Stack Pills (Bottom) */}
            <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {activeCard.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-[#0b1325] border border-slate-700/60 hover:border-cyan-500/40 hover:text-cyan-300 text-slate-300 text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md font-mono transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Member Navigator Pills & Arrows */}
          <div className="w-full max-w-[440px] sm:max-w-[460px] flex items-center justify-between mt-5 gap-2 px-1">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08101f] border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 text-xs font-mono transition-all"
            >
              <span>←</span>
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Member Switcher Dots / Quick Tabs */}
            <div className="flex items-center gap-1.5">
              {TEAM_CARDS.map((member, idx) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    setIsAnimating(true);
                    setCurrentIndex(idx);
                    setTimeout(() => setIsAnimating(false), 250);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    currentIndex === idx
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.3)] font-bold'
                      : 'bg-[#08101f] text-slate-400 border border-slate-800/80 hover:text-slate-200'
                  }`}
                  title={member.name}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08101f] border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 text-xs font-mono transition-all"
            >
              <span className="hidden sm:inline">Next</span>
              <span>→</span>
            </button>
          </div>

          {/* Interactive Keyboard Hint */}
          <p className="text-[11px] text-slate-500 mt-3 font-mono text-center">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">←</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">→</kbd> or tap card to swap
          </p>
        </div>
      ) : (
        /* Grid Showcase Mode (All 4 Cards Displayed) */
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 z-10 my-4 animate-page-enter">
          {TEAM_CARDS.map((member, idx) => (
            <div
              key={member.id}
              className={`rounded-[26px] bg-[#070e1b]/95 border ${
                currentIndex === idx ? 'border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]' : 'border-cyan-950/60'
              } p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-cyan-400 font-mono font-bold">{member.cardIndex}</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-[10px]">
                    {member.tag}
                  </span>
                </div>

                <div className="relative w-20 h-20 mx-auto my-2 rounded-full ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#070e1b] overflow-hidden">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-lg font-bold text-white`}
                    >
                      {member.initials}
                    </div>
                  )}
                </div>

                <div className="text-center mt-3">
                  <h3 className="font-bold text-white text-base">{member.name}</h3>
                  <p className="text-[11px] font-medium text-cyan-400 mt-0.5">{member.role}</p>
                </div>

                <div className="mt-3 text-left">
                  <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider mb-1">
                    Deliverables
                  </p>
                  <ul className="space-y-1">
                    {member.coreDeliverables.slice(0, 3).map((item, i) => (
                      <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-cyan-400 shrink-0">{item.icon}</span>
                        <span className="line-clamp-1">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{member.techStack[0]}</span>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setViewMode('flashcard');
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline underline-offset-4"
                >
                  View Card →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Navigation Link */}
      <footer className="mt-8 mb-2 text-center z-10">
        <Link
          href="/dashboard/patient"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <span>←</span>
          <span>Back to SmartHealth AI Dashboard</span>
        </Link>
      </footer>
    </div>
  );
}
