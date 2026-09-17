'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiUrl } from '@/lib/api';
import DownloadPdfButton from '@/components/DownloadPdfButton';

interface User {
  user_id?: number;
  id?: number;
  name?: string;
  email?: string;
  role?: string;
}

interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  reason: string;
  status: string;
  doctor_name?: string;
}

interface HealthMetrics {
  heart_rate: number | null;
  systolic_bp: number | null;
  diastolic_bp: number | null;
  blood_glucose: number | null;
  sleep_duration: number | null;
}

interface Medicine {
  id: number;
  name: string;
  dosage?: string;
  instructions?: string;
  is_taken: boolean;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  unit,
  status,
  statusColor,
  icon,
  accentColor,
}: {
  label: string;
  value: string;
  unit: string;
  status: string;
  statusColor: string;
  icon: string;
  accentColor: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow`}>
      <p className={`text-xs font-medium text-gray-500 mb-3`}>{label}</p>
      <div className="flex items-end gap-1.5 mb-1">
        <span className="text-3xl font-bold text-gray-800 leading-none">{value}</span>
        <span className={`text-sm text-gray-400 mb-0.5`}>{unit}</span>
      </div>
      <div className={`flex items-center gap-1 mt-2`}>
        <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
        <span className={`text-xs font-medium ${statusColor.replace('bg-', 'text-')}`}>{status}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [metrics, setMetrics] = useState<HealthMetrics>({
    heart_rate: 72,
    systolic_bp: 120,
    diastolic_bp: 80,
    blood_glucose: 95,
    sleep_duration: 7.5,
  });
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const fetchAppointments = useCallback(async (patientId: number) => {
    try {
      const res = await fetch(apiUrl(`/api/appointments/patient/${patientId}`));
      if (res.ok) {
        const data = (await res.json()) as Appointment[];
        setAppointments(data);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  }, []);

  const fetchMetrics = useCallback(async (userId: number) => {
    try {
      const res = await fetch(apiUrl(`/api/health-metrics/user/${userId}/latest`));
      if (res.ok) {
        const data = await res.json() as HealthMetrics;
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to fetch health metrics:', err);
    }
  }, []);

  const fetchMedicines = useCallback(async (userId: number) => {
    try {
      const res = await fetch(apiUrl(`/api/medicines/user/${userId}`));
      if (res.ok) {
        const data = (await res.json()) as Medicine[];
        setMedicines(data);
      }
    } catch (err) {
      console.error('Failed to fetch medicines:', err);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { router.replace('/login'); return; }
    try {
      const parsed = JSON.parse(storedUser) as User;
      const userId = parsed.user_id || parsed.id || 1;
      setUser(parsed);
      Promise.all([
        fetchAppointments(userId),
        fetchMetrics(userId),
        fetchMedicines(userId),
      ]).finally(() => setLoading(false));
    } catch {
      router.replace('/login');
    }
  }, [router, fetchAppointments, fetchMetrics, fetchMedicines]);

  const handleMarkTaken = async (medicineId: number, currentState: boolean) => {
    const userId = user?.user_id || user?.id || 1;
    try {
      const res = await fetch(apiUrl(`/api/medicines/${medicineId}/taken`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_taken: !currentState }),
      });
      if (res.ok) {
        await fetchMedicines(userId);
      }
    } catch (err) {
      console.error('Failed to update medicine:', err);
    }
  };

  if (!isClient) return null;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  const nextAppointment = appointments.find(
    (a) => a.status?.toLowerCase() !== 'cancelled'
  );
  const pendingCount = appointments.filter((a) => a.status?.toLowerCase() === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status?.toLowerCase() === 'confirmed').length;

  const metricCards = [
    {
      label: 'Heart Rate',
      value: metrics.heart_rate ? String(metrics.heart_rate) : '—',
      unit: 'bpm',
      status: 'Normal Range',
      statusColor: 'bg-emerald-500',
      icon: '❤',
      accentColor: 'text-rose-500',
    },
    {
      label: 'Blood Pressure',
      value: metrics.systolic_bp && metrics.diastolic_bp
        ? `${metrics.systolic_bp}/${metrics.diastolic_bp}`
        : '—',
      unit: 'mmHg',
      status: 'Optimal',
      statusColor: 'bg-emerald-500',
      icon: '🩺',
      accentColor: 'text-blue-500',
    },
    {
      label: 'Blood Glucose',
      value: metrics.blood_glucose ? String(metrics.blood_glucose) : '—',
      unit: 'mg/dL',
      status: 'Fasting Normal',
      statusColor: 'bg-emerald-500',
      icon: '🩸',
      accentColor: 'text-amber-500',
    },
    {
      label: 'Sleep Duration',
      value: metrics.sleep_duration ? String(metrics.sleep_duration) : '—',
      unit: 'hrs',
      status: 'Rested',
      statusColor: 'bg-emerald-500',
      icon: '😴',
      accentColor: 'text-indigo-500',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

      {/* Demo Banner */}
      <div className="bg-teal-600 rounded-xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 right-12 w-20 h-20 bg-white/5 rounded-full translate-y-6" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block text-xs font-semibold bg-white/20 border border-white/30 rounded px-2 py-0.5 mb-2 uppercase tracking-wider">
              Demo Data — Synthetic Information
            </span>
            <h1 className="text-xl font-bold">Welcome Back, {user.name || 'Patient'}</h1>
            <p className="text-teal-100 text-sm mt-1">
              Your health metrics are synchronized. Next checkup scheduled in 4 days.
            </p>
          </div>
          <DownloadPdfButton
            patientId={user.user_id || user.id}
            label="Download PDF Report"
            className="shrink-0"
          />
        </div>
      </div>

      {/* Health Metrics */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Health Metrics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </div>

      {/* Appointment + Medicine Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Upcoming Consultation */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📋</span>
            <h2 className="font-semibold text-gray-800">Upcoming Consultation</h2>
          </div>
          {nextAppointment ? (
            <div className="space-y-2">
              <p className="font-semibold text-gray-800">
                {nextAppointment.doctor_name || `Doctor #${nextAppointment.doctor_id}`}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(nextAppointment.appointment_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at{' '}
                {new Date(nextAppointment.appointment_date).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full
                ${nextAppointment.status?.toLowerCase() === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-yellow-100 text-yellow-700'
                }`}>
                {nextAppointment.status?.toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm mb-3">No upcoming appointments</p>
              <Link
                href="/dashboard/book-appointment"
                className="inline-block text-xs bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
              >
                Book Now
              </Link>
            </div>
          )}
        </div>

        {/* Medicine Reminders */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">💊</span>
              <h2 className="font-semibold text-gray-800">Medicine Reminders</h2>
            </div>
            <Link
              href="/dashboard/medicines"
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              Manage →
            </Link>
          </div>
          {medicines.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm mb-3">No medicines added</p>
              <Link
                href="/dashboard/medicines"
                className="inline-block text-xs bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
              >
                + Add Medicine
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {medicines.slice(0, 3).map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{med.name}</p>
                    {med.instructions && (
                      <p className="text-xs text-gray-400 mt-0.5">{med.instructions}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleMarkTaken(med.id, med.is_taken)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      med.is_taken
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                  >
                    {med.is_taken ? '✓ Taken' : 'Take'}
                  </button>
                </div>
              ))}
              {medicines.length > 3 && (
                <Link href="/dashboard/medicines" className="block text-center text-xs text-teal-600 hover:underline pt-1">
                  +{medicines.length - 3} more medicines →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Stats + Quick Links Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Total Appointments</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Pending Review</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-2xl font-bold text-emerald-500">{confirmedCount}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Confirmed Visits</p>
        </div>
      </div>

      {/* PDF Medical Report Glassmorphic Card */}
      <DownloadPdfButton
        patientId={user.user_id || user.id}
        variant="glass-card"
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

        {[
          { label: 'Book Appointment', href: '/dashboard/book-appointment', icon: '📅', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
          { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: '🤖', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
          { label: 'Risk Assessment', href: '/dashboard/risk-assessment', icon: '⚠️', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
          { label: 'Add Medicines', href: '/dashboard/medicines', icon: '💊', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition ${action.color}`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-xs font-semibold">{action.label}</span>
          </Link>
        ))}
      </div>

    </div>
  );
}
