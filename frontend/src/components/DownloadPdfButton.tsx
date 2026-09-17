'use client';

import { useState } from 'react';
import { FileDown, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiUrl } from '@/lib/api';

interface DownloadPdfButtonProps {
  patientId?: number;
  className?: string;
  variant?: 'primary' | 'compact' | 'glass-card';
  label?: string;
}

export default function DownloadPdfButton({
  patientId,
  className = '',
  variant = 'primary',
  label = 'Download PDF Report',
}: DownloadPdfButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDownload = async () => {
    if (status === 'loading') return;

    setStatus('loading');
    setErrorMessage(null);

    try {
      // Determine the patient ID from props or localStorage
      let targetId = patientId;
      if (!targetId && typeof window !== 'undefined') {
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            targetId = parsed.user_id || parsed.id;
          } catch {
            // Ignore parse errors and fallback
          }
        }
      }
      targetId = targetId || 1;

      const endpoint = apiUrl(`/api/patients/${targetId}/export-pdf`);
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/pdf',
        },
      });

      if (!response.ok) {
        let detail = `Server responded with status ${response.status}`;
        try {
          const errData = await response.json();
          detail = errData.detail || errData.message || detail;
        } catch {
          // Fallback if not json
        }
        throw new Error(detail);
      }

      // Extract filename from Content-Disposition header if available
      let filename = 'Patient_Medical_Summary.pdf';
      const disposition = response.headers.get('content-disposition');
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename=["']?([^"';]+)["']?/);
        if (match && match[1]) {
          filename = match[1].trim();
        }
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Trigger standard browser download
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Cleanup
      setTimeout(() => {
        if (downloadLink.parentNode) {
          downloadLink.parentNode.removeChild(downloadLink);
        }
        window.URL.revokeObjectURL(blobUrl);
      }, 200);

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: unknown) {
      console.error('PDF export failed:', err);
      const msg = err instanceof Error ? err.message : 'Failed to generate PDF summary';
      setErrorMessage(msg);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  // ─── Compact Glassmorphism Button ──────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={handleDownload}
          disabled={status === 'loading'}
          title="Download PDF Medical Summary"
          className={`group relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold
            bg-slate-900/80 hover:bg-slate-800/90
            text-teal-300 hover:text-white
            border border-teal-500/30 hover:border-teal-400/60
            backdrop-blur-xl shadow-md shadow-teal-950/40 hover:shadow-teal-500/20
            transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
            ${className}`}
        >
          {status === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />}
          {status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          {status === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
          {status === 'idle' && (
            <FileDown className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
          )}

          <span>
            {status === 'loading'
              ? 'Generating...'
              : status === 'success'
              ? 'Downloaded'
              : status === 'error'
              ? 'Error'
              : label}
          </span>
        </button>

        {errorMessage && (
          <div className="absolute top-full left-0 mt-2 z-50 rounded-lg bg-rose-950/90 border border-rose-500/40 p-2 text-[11px] text-rose-200 shadow-xl backdrop-blur-md max-w-xs">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  // ─── Glassmorphism Action Card Variant ─────────────────────────────────────
  if (variant === 'glass-card') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-teal-950/50 p-4 text-white shadow-xl shadow-teal-950/30 backdrop-blur-xl transition-all duration-300 hover:border-teal-400/60 ${className}`}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-teal-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              Official Health Documentation
            </div>
            <h3 className="mt-1 text-sm font-bold text-slate-100">Download Medical Summary (PDF)</h3>
            <p className="text-xs text-slate-400">
              Generates a verified, multi-page clinical report with biometrics, medications, and AI risk stratification.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 hover:border-teal-400 px-4 py-2.5 text-xs font-semibold text-teal-200 hover:text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-inner"
          >
            {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-teal-300" />}
            {status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {status === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {status === 'idle' && <FileDown className="w-4 h-4 text-teal-300" />}
            <span>
              {status === 'loading'
                ? 'Generating PDF...'
                : status === 'success'
                ? 'PDF Downloaded!'
                : status === 'error'
                ? 'Retry Download'
                : 'Export PDF Report'}
            </span>
          </button>
        </div>
        {errorMessage && (
          <p className="mt-2 text-xs text-rose-300">
            ⚠️ {errorMessage}
          </p>
        )}
      </div>
    );
  }

  // ─── Primary Dark Glassmorphism Button (Default) ───────────────────────────
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleDownload}
        disabled={status === 'loading'}
        className={`group relative inline-flex items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold
          bg-slate-900/85 hover:bg-slate-800/90
          text-teal-200 hover:text-white
          border border-teal-500/30 hover:border-teal-400/70
          backdrop-blur-xl shadow-lg shadow-teal-950/30 hover:shadow-teal-500/20
          transition-all duration-300 active:scale-[0.97]
          disabled:opacity-60 disabled:cursor-not-allowed
          ${className}`}
      >
        {/* Subtle glass reflection highlight */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/30 to-transparent" />

        {status === 'loading' && (
          <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-4 h-4 text-rose-400" />
        )}
        {status === 'idle' && (
          <FileDown className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform duration-200" />
        )}

        <span className="tracking-wide">
          {status === 'loading'
            ? 'Generating PDF...'
            : status === 'success'
            ? 'Downloaded!'
            : status === 'error'
            ? 'Download Failed'
            : label}
        </span>
      </button>

      {errorMessage && (
        <div className="absolute left-0 top-full mt-2 z-50 rounded-lg border border-rose-500/40 bg-slate-950/95 p-2 text-xs text-rose-300 shadow-2xl backdrop-blur-xl">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
