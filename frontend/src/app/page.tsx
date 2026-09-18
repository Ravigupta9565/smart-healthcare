import Link from 'next/link';

const FEATURES = [
  {
    icon: '📅',
    title: 'Smart Appointment Booking',
    desc: 'Book consultations with specialist doctors in seconds. Real-time status tracking and confirmation.',
    color: 'bg-blue-100 text-blue-600 border-blue-200',
  },
  {
    icon: '📊',
    title: 'Health Metrics Tracking',
    desc: 'Monitor heart rate, blood pressure, glucose, and sleep — all in one unified health dashboard.',
    color: 'bg-teal-100 text-teal-600 border-teal-200',
  },
  {
    icon: '🤖',
    title: 'AI Health Assistant',
    desc: 'Get instant answers to health questions from our AI assistant, available 24/7.',
    color: 'bg-purple-100 text-purple-600 border-purple-200',
  },
  {
    icon: '⚠️',
    title: 'Risk Assessment',
    desc: 'AI-powered health risk scoring analyzes your vitals and flags potential health concerns early.',
    color: 'bg-amber-100 text-amber-600 border-amber-200',
  },
  {
    icon: '💊',
    title: 'Medicine Reminders',
    desc: 'Never miss a dose. Track daily medications and mark them as taken with a single click.',
    color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  },
  {
    icon: '🩺',
    title: 'Doctor Clinical Portal',
    desc: 'Doctors can manage patient queues, confirm appointments, and track their daily schedule.',
    color: 'bg-rose-100 text-rose-600 border-rose-200',
  },
];

const STATS = [
  { value: '15+', label: 'API Endpoints' },
  { value: '4', label: 'Health Models' },
  { value: '8+', label: 'App Pages' },
  { value: '2', label: 'User Roles' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col animate-page-enter">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-lg text-white transition-transform duration-300 hover:rotate-12">
              +
            </div>
            <span className="text-lg font-bold text-gray-800">
              SmartHealth<span className="text-teal-600"> AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <Link href="#features" className="hover:text-teal-600 transition">Features</Link>
            <Link href="/dashboard/patient" className="hover:text-teal-600 transition">Patient Portal</Link>
            <Link href="/dashboard/doctor" className="hover:text-teal-600 transition">Doctor Portal</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 pt-20 pb-24 px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float animate-delay-300" />

        <div className="hero-background absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="hero-background__glow" />
          <svg
            className="tech-network h-full w-full"
            viewBox="0 0 1200 620"
            preserveAspectRatio="none"
          >
          <g className="tech-network__brain" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M530 302c-30-38-8-86 38-91 13-36 64-42 88-10 38-20 83 8 78 51 39 15 42 70 7 94 7 42-36 69-70 49-30 28-80 17-91-22-42 1-67-32-50-71Z" />
            <path d="M602 212c-18 24-18 48 0 72s18 48 0 72 18 48 0 72M548 254h40l23-27M656 229l-22 38 32 31-40 33 28 36M540 318l38-1 24 25M624 212v26l-22 22M624 362l-22 23" />
            <circle cx="602" cy="212" r="4" />
            <circle cx="548" cy="254" r="3" />
            <circle cx="656" cy="229" r="3" />
            <circle cx="578" cy="317" r="3" />
            <circle cx="624" cy="362" r="3" />
          </g>
          <g className="tech-network__lines" fill="none" strokeLinecap="round">
            <path d="M38 128 185 78 310 170 438 96 580 154 735 68 884 142 1020 78 1170 154" />
            <path d="M78 432 210 348 348 470 488 356 625 448 770 330 918 420 1062 310 1178 392" />
            <path d="M185 78 210 348M310 170 348 470M438 96 488 356M580 154 625 448M735 68 770 330M884 142 918 420M1020 78 1062 310" />
            <path d="M38 128 78 432M1170 154 1178 392" />
          </g>
          <g className="tech-network__streams" fill="none" strokeLinecap="round">
            <path d="M-20 520 C180 400 270 560 460 430 S760 330 940 470 S1120 520 1220 390" />
            <path d="M-20 190 C150 270 240 130 410 215 S700 300 860 190 S1080 110 1220 220" />
          </g>
          <g className="tech-network__nodes">
            {[
              [38, 128], [185, 78], [310, 170], [438, 96], [580, 154], [735, 68],
              [884, 142], [1020, 78], [1170, 154], [78, 432], [210, 348], [348, 470],
              [488, 356], [625, 448], [770, 330], [918, 420], [1062, 310], [1178, 392],
            ].map(([cx, cy], index) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index % 3 === 0 ? 3 : 2} />
            ))}
          </g>
          <g className="tech-network__particles">
            {[
              [136, 275], [270, 118], [405, 294], [538, 520], [710, 228],
              [832, 520], [974, 262], [1108, 470], [1140, 90],
            ].map(([cx, cy], index) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index % 2 === 0 ? 2.5 : 1.5} />
            ))}
          </g>
          <g className="tech-network__helix" fill="none" strokeLinecap="round">
            <path d="M930 164 C1015 204 1015 270 930 310 C845 350 845 416 930 456" />
            <path d="M1010 164 C925 204 925 270 1010 310 C1095 350 1095 416 1010 456" />
            <path d="M950 177 990 177M930 225 1010 225M930 273 1010 273M950 321 990 321M930 369 1010 369M930 417 1010 417" />
          </g>
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-400/10 border border-teal-300/30 text-xs font-semibold text-teal-200 mb-6 animate-slide-in-left">
            <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
            AI-Powered Healthcare Management System
          </div>

          <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 animate-page-enter animate-delay-100">
            Next-Generation{' '}
            <span>
              Healthcare
            </span>{' '}
            for Everyone
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 animate-page-enter animate-delay-200">
            Monitor your health metrics, book appointments, track medications, and get AI health insights —
            all in one professional platform designed for patients and doctors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-page-enter animate-delay-300">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 hover:-translate-y-1 text-white font-semibold rounded-xl transition shadow-lg shadow-teal-600/20 text-center"
            >
              Start Free →
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-gray-50 hover:-translate-y-1 text-gray-700 font-semibold rounded-xl transition border border-gray-200 text-center"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-teal-400">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Everything You Need</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              A comprehensive suite of tools for modern healthcare management
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md hover:border-gray-300 transition-all animate-page-enter"
                style={{ animationDelay: `${(STATS.length + FEATURES.indexOf(f)) * 70}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-teal-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to take control of your health?
          </h2>
          <p className="text-teal-100 text-sm mb-8 max-w-md mx-auto">
            Join SmartHealth AI and access your personal health dashboard, AI assistant, and appointment manager.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-teal-700 hover:bg-teal-50 font-semibold rounded-xl transition text-sm"
            >
              Create Patient Account
            </Link>
            <Link
              href="/dashboard/patient"
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition text-sm border border-teal-500"
            >
              View Demo Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center text-white text-xs font-bold">+</div>
          <span className="font-bold text-gray-700">SmartHealth AI</span>
        </div>
        <p className="text-xs text-gray-400">© 2026 SmartHealth AI — AI-Powered Healthcare Platform. For informational purposes only.</p>
      </footer>
    </div>
  );
}
