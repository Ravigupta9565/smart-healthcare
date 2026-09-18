'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Code2, UserRound, X } from 'lucide-react';

interface User {
  user_id?: number;
  id?: number;
  name?: string;
  email?: string;
  role?: string;
}

type ViewRole = 'patient' | 'doctor';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard/patient',
    icon: '▦',
    roles: ['patient', 'doctor'],
    match: (p: string) => p === '/dashboard/patient' || p.startsWith('/dashboard/patient/'),
  },
  {
    label: 'AI Assistant',
    href: '/dashboard/ai-assistant',
    icon: '🤖',
    roles: ['patient', 'doctor'],
    match: (p: string) => p === '/dashboard/ai-assistant',
  },
  {
    label: 'Scan Analyzer',
    href: '/dashboard/imaging',
    icon: '◉',
    roles: ['patient', 'doctor'],
    match: (p: string) => p === '/dashboard/imaging',
  },
  {
    label: 'Risk Assessment',
    href: '/dashboard/risk-assessment',
    icon: '⚠',
    roles: ['patient', 'doctor'],
    match: (p: string) => p === '/dashboard/risk-assessment',
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: '◒',
    roles: ['patient', 'doctor'],
    match: (p: string) => p === '/dashboard/analytics',
  },
  {
    label: 'Medicine Reminders',
    href: '/dashboard/medicines',
    icon: '💊',
    roles: ['patient'],
    match: (p: string) => p === '/dashboard/medicines',
  },
  {
    label: 'Book Appointment',
    href: '/dashboard/book-appointment',
    icon: '📅',
    roles: ['patient'],
    match: (p: string) => p === '/dashboard/book-appointment',
  },
  {
    label: 'Doctor Portal',
    href: '/dashboard/doctor',
    icon: '🩺',
    roles: ['doctor'],
    match: (p: string) => p === '/dashboard/doctor' || p.startsWith('/dashboard/doctor/'),
  },
  {
    label: 'Project Team',
    href: '/dashboard/team',
    icon: '👥',
    roles: ['patient', 'doctor'],
    match: (p: string) => p === '/dashboard/team',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewRole>('patient');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [developerProfileOpen, setDeveloperProfileOpen] = useState(false);
  const [developerProfileClosing, setDeveloperProfileClosing] = useState(false);

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem('user');
      if (!storedUser) {
        router.replace('/login');
        return;
      }
      const parsedUser = JSON.parse(storedUser) as User;
      if (!parsedUser || typeof parsedUser !== 'object') throw new Error('Invalid user data');
      setUser(parsedUser);
      setActiveView((parsedUser.role as ViewRole) || 'patient');
    } catch (error) {
      console.error('User authentication error:', error);
      window.localStorage.removeItem('user');
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!developerProfileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDeveloperProfile();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [developerProfileOpen]);

  const openDeveloperProfile = () => {
    setDeveloperProfileClosing(false);
    setDeveloperProfileOpen(true);
  };

  const closeDeveloperProfile = () => {
    if (developerProfileClosing) return;
    setDeveloperProfileClosing(true);
    window.setTimeout(() => {
      setDeveloperProfileOpen(false);
      setDeveloperProfileClosing(false);
    }, 160);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('user');
    router.replace('/login');
  };

  const handleViewSwitch = (view: ViewRole) => {
    if (view === 'doctor' && user?.role !== 'doctor') {
      alert('Doctor portal is only available for doctor accounts.');
      return;
    }
    setActiveView(view);
    router.push(view === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-300 text-sm">Loading SmartHealth AI...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const visibleNav = NAV_ITEMS.filter((item) =>
    item.roles.includes(activeView)
  );

  return (
    <div className="dark-dashboard flex h-screen bg-slate-950 text-white overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ───────────────────────────────────────────── */}
      <aside
        className={`animate-slide-in-left
          fixed lg:static inset-y-0 left-0 z-30
          w-60 shrink-0 bg-gray-900 flex flex-col
          transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
              +
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">SmartHealth AI</p>
              <p className="text-gray-400 text-xs mt-0.5">Healthcare Platform</p>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="px-4 py-3 border-b border-gray-800">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Active Role</p>
          <div className="relative">
            <select
              value={activeView}
              onChange={(e) => handleViewSwitch(e.target.value as ViewRole)}
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 appearance-none cursor-pointer focus:outline-none focus:border-teal-500"
            >
              <option value="patient">Patient View</option>
              {user.role === 'doctor' && <option value="doctor">Doctor View</option>}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {visibleNav.map((item) => {
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-900/40'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }
                `}
              >
                <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.name || 'User'}</p>
              <p className="text-gray-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-xs py-2 rounded-lg bg-red-900/30 text-red-400 border border-red-800/50 hover:bg-red-700 hover:text-white transition font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN AREA ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Notice Bar */}
        <div className="bg-slate-900/80 border-b border-slate-700/60 px-4 py-2 flex items-center gap-2 text-xs text-blue-200 shrink-0 backdrop-blur-xl">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold shrink-0">i</span>
          <span>Notice: General health decision-support system. Does not constitute clinical medical diagnosis.</span>
        </div>

        {/* Dashboard Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-900/80 border-b border-slate-700/60 shrink-0 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-slate-300 hover:text-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-semibold text-white text-sm">SmartHealth AI</span>
          </div>
          <button
            type="button"
            onClick={openDeveloperProfile}
            className="inline-flex items-center gap-2 rounded-xl border border-teal-400/25 bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur transition hover:border-teal-300/60 hover:bg-teal-500/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50"
            aria-haspopup="dialog"
            aria-expanded={developerProfileOpen}
          >
            <UserRound className="h-3.5 w-3.5 text-teal-300" />
            <span>Developer Profile</span>
          </button>
        </div>

        {/* Page Content */}
        <main className="relative flex-1 overflow-y-auto bg-slate-950 animate-page-enter">
          <div className="dashboard-holographic-backdrop absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <div className="dashboard-holographic-backdrop__grid" />
            <div className="dashboard-holographic-backdrop__orb dashboard-holographic-backdrop__orb--teal" />
            <div className="dashboard-holographic-backdrop__orb dashboard-holographic-backdrop__orb--blue" />
          </div>
          <div className="relative z-10 min-h-full">
          {children}
          </div>
        </main>
      </div>

      {developerProfileOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm ${
            developerProfileClosing ? 'modal-backdrop-exit' : 'modal-backdrop-enter'
          }`}
          onClick={closeDeveloperProfile}
          role="presentation"
        >
          <section
            className={`relative w-full max-w-sm rounded-2xl border border-teal-400/25 bg-slate-900/95 p-6 text-center text-white shadow-2xl shadow-slate-950/60 backdrop-blur-xl ${
              developerProfileClosing ? 'modal-panel-exit' : 'modal-panel-enter'
            }`}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="developer-profile-title"
          >
            <button
              type="button"
              onClick={closeDeveloperProfile}
              className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              aria-label="Close developer profile"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-teal-400/50 bg-gradient-to-br from-teal-500/30 to-blue-500/20 shadow-lg shadow-teal-950/40">
              <Image
                src="/images/ravi.jpg"
                alt="Ravi Gupta"
                width={80}
                height={80}
                className="h-full w-full scale-110 object-cover"
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Developer Profile</p>
            <h2 id="developer-profile-title" className="mt-2 text-xl font-bold">Ravi Gupta</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              B.Tech CSE (CCML) • 3rd Year | BBD University
            </p>
            <a
              href="https://github.com/Raviguptaji9565"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-teal-400/60 hover:bg-teal-500/15 hover:text-white"
            >
              <Code2 className="h-4 w-4" />
              View GitHub Profile
            </a>
          </section>
        </div>
      )}
    </div>
  );
}