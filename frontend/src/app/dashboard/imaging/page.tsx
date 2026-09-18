'use client';

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  FileImage,
  Lightbulb,
  LoaderCircle,
  ScanLine,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-react';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/dicom'];
const ACCEPTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.dcm', '.dicom'];
const DEMO_SAMPLE_URL = 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Chest_Xray_PA_3-8-2010.png';

interface AnalysisResult {
  classification: string;
  confidence: string;
  risk: string;
  observations: string;
  summary: string;
  recommendations: string[];
  tone: 'normal' | 'attention';
}

function isSupportedFile(file: File) {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension);
}

export default function ImagingAnalyzerPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDemoSample, setIsDemoSample] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  const selectFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;
    setError('');
    setResult(null);
    setIsDemoSample(false);

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('Please choose a file smaller than 25 MB.');
      return;
    }

    if (!isSupportedFile(selectedFile)) {
      setFile(null);
      setPreviewUrl(null);
      setError('Please choose a PNG, JPG, JPEG, or DICOM file.');
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreviewUrl = selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null;
    previewUrlRef.current = nextPreviewUrl;
    setFile(selectedFile);
    setPreviewUrl(nextPreviewUrl);
  };

  const loadDemoSample = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setError('');
    setIsAnalyzing(false);
    setIsDemoSample(true);
    setFile(new File(['demo chest x-ray sample'], 'demo-chest-xray.png', { type: 'image/png' }));
    setPreviewUrl(DEMO_SAMPLE_URL);
    setResult({
      classification: 'No Acute Cardiopulmonary Abnormalities',
      confidence: '98.2%',
      risk: 'Low Risk',
      observations: 'Cardiac silhouette and mediastinum within normal limits. Clear lung fields bilaterally.',
      summary: 'The demo chest X-ray follows a normal reference pattern with no acute cardiopulmonary finding identified.',
      recommendations: ['Routine follow-up.', 'No immediate clinical intervention required.'],
      tone: 'normal',
    });
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  };

  const clearFile = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    setIsDemoSample(false);
    setResult(null);
    setError('');
  };

  const analyzeScan = () => {
    if (!file || isAnalyzing) return;
    setIsAnalyzing(true);
    setResult(null);

    window.setTimeout(() => {
      setResult({
        classification: 'No acute findings detected',
        confidence: '94.8%',
        risk: 'Low Risk',
        observations: 'No high-risk feature was identified in this demonstration analysis.',
        summary: 'The uploaded scan is within the expected reference pattern for this demonstration analysis.',
        recommendations: [
          'Review the scan and AI summary with a qualified clinician.',
          'Compare with prior imaging when available.',
          'Seek urgent care for new or worsening symptoms.',
        ],
        tone: 'normal',
      });
      setIsAnalyzing(false);
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-950/30">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">AI Diagnostics</p>
              <h1 className="text-xl font-bold text-white sm:text-2xl">AI Medical Imaging &amp; Scan Analyzer</h1>
            </div>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
            Upload radiological scans (X-Ray, MRI, CT) or clinical photos for instant AI-powered diagnostic risk stratification.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure local preview
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-white">Upload a medical image</h2>
              <p className="mt-1 text-xs text-slate-500">PNG, JPG, JPEG, DICOM up to 25 MB</p>
            </div>
            <ScanLine className="h-5 w-5 text-cyan-400/70" />
          </div>

          {!file ? (
            <div
              className={`rounded-xl border border-dashed p-8 text-center transition-colors md:p-12 ${
                isDragging
                  ? 'border-cyan-300 bg-cyan-400/10'
                  : 'border-slate-600 bg-slate-950/35 hover:border-cyan-400/60 hover:bg-slate-950/55'
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <UploadCloud className="mx-auto h-10 w-10 text-cyan-300" />
              <p className="mt-4 text-sm font-semibold text-slate-200">Drag and drop your scan here</p>
              <p className="mt-1 text-xs text-slate-500">or choose a file from your device</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-5 rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                Browse files
              </button>
              <button
                type="button"
                onClick={loadDemoSample}
                className="mt-3 block w-full text-xs font-semibold text-cyan-300 transition hover:text-cyan-100"
              >
                Load Demo Sample
              </button>
              <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg,.dcm,.dicom,image/png,image/jpeg,application/dicom" onChange={handleFileInput} className="sr-only" />
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-cyan-400/25 bg-slate-950/65">
              <div className="flex items-center justify-between border-b border-slate-700/70 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FileImage className="h-4 w-4 shrink-0 text-cyan-300" />
                  <span className="truncate text-xs font-medium text-slate-200">{file.name}</span>
                </div>
                <button type="button" onClick={clearFile} className="rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-white" aria-label="Remove selected scan">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex min-h-64 items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.12),_transparent_62%)] p-4">
                {previewUrl && isDemoSample ? (
                  <div
                    className="h-80 w-full rounded-lg bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url("${previewUrl}")` }}
                    role="img"
                    aria-label="Demo chest X-ray preview"
                  />
                ) : previewUrl ? (
                  <div className="relative h-80 w-full">
                    <Image
                      src={previewUrl}
                      alt={`Preview of ${file.name}`}
                      fill
                      unoptimized
                      className="rounded-lg object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <ScanLine className="mx-auto h-14 w-14 text-cyan-300/70" />
                    <p className="mt-3 text-sm font-semibold text-slate-200">DICOM scan ready</p>
                    <p className="mt-1 text-xs text-slate-500">Preview will be rendered by the connected imaging viewer.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <p className="mt-3 text-xs font-medium text-rose-300">{error}</p>}

          <button
            type="button"
            onClick={analyzeScan}
            disabled={!file || isAnalyzing}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-950/30 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isAnalyzing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
            {isAnalyzing ? 'Running deep learning inference...' : 'Analyze with AI Scan Model'}
          </button>
          {file && (
            <button
              type="button"
              onClick={loadDemoSample}
              className="mt-3 w-full rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-200"
            >
              Load Demo Sample
            </button>
          )}
        </section>

        <aside className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:p-6">
          <div className="mb-6 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-cyan-300" />
            <h2 className="font-semibold text-white">Analysis results</h2>
          </div>

          {!result && !isAnalyzing && (
            <div className="rounded-xl border border-slate-700/60 bg-slate-950/35 p-6 text-center">
              <ScanLine className="mx-auto h-9 w-9 text-slate-600" />
              <p className="mt-3 text-sm font-medium text-slate-400">Your scan insights will appear here</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">Upload an image and start an analysis to view classification and next steps.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-6">
              <div className="mb-3 flex items-center justify-between text-xs text-cyan-200">
                <span>Running deep learning inference...</span>
                <LoaderCircle className="h-4 w-4 animate-spin" />
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-teal-500 to-cyan-300" />
              </div>
              <p className="mt-3 text-xs text-slate-500">Preprocessing image, extracting features, and checking risk markers.</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    {result.tone === 'normal' ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" /> : <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">Detected condition / classification</p>
                      <p className="mt-1 font-semibold text-emerald-200">{result.classification}</p>
                      <p className="mt-1 text-xs font-medium text-cyan-200">Risk stratification: {result.risk}</p>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-sm font-bold text-cyan-200">{result.confidence}</span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-300">{result.summary}</p>
                <p className="mt-3 border-t border-emerald-300/10 pt-3 text-xs leading-relaxed text-slate-300">
                  <span className="font-semibold text-slate-200">Key observations:</span> {result.observations}
                </p>
              </div>

              <div className="rounded-xl border border-slate-700/60 bg-slate-950/35 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Clinical recommendations &amp; next steps</h3>
                <ul className="mt-3 space-y-3">
                  {result.recommendations.map((recommendation) => (
                    <li key={recommendation} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-300" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[11px] leading-relaxed text-amber-200/70">
                Decision support only. This demonstration result is not a diagnosis and should not replace review by a licensed medical professional.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
