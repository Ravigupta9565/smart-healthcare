'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900/80 border-b border-slate-700/60 shrink-0 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-white text-sm">SmartHealth AI</span>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 animate-page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}