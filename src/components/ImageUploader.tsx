import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Grid,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { CLINICAL_SAMPLES } from '../utils/clinicalData.ts';

interface ImageUploaderProps {
  currentImage: string | null;
  onSelectImage: (dataUri: string, metadata?: any) => void;
  onClearImage: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  showDermatoscopeGrid: boolean;
  onToggleGrid: () => void;
  cameraOpen: boolean;
  onOpenCamera: () => void;
  onCloseCamera: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onSelectImage,
  onClearImage,
  onAnalyze,
  isAnalyzing,
  showDermatoscopeGrid,
  onToggleGrid,
  cameraOpen,
  onOpenCamera,
  onCloseCamera,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterMode, setFilterMode] = useState<'normal' | 'contrast' | 'mono' | 'invert'>('normal');
  const [showMetadataForm, setShowMetadataForm] = useState(false);

  // Clinical context form state
  const [location, setLocation] = useState('Trunk / Back');
  const [duration, setDuration] = useState('1 - 6 months');
  const [symptoms, setSymptoms] = useState<string[]>(['Recent expansion or change']);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Camera stream management
  useEffect(() => {
    if (cameraOpen) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } } })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Camera access denied or failed:', err);
          setCameraError('Unable to access device camera. Please check browser permissions or upload an image file.');
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [cameraOpen]);

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.92);
      onSelectImage(dataUri, { location, duration, symptoms });
      onCloseCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSelectImage(reader.result, { location, duration, symptoms });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSelectImage(reader.result, { location, duration, symptoms });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSymptom = (sym: string) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const getFilterClass = () => {
    switch (filterMode) {
      case 'contrast':
        return 'contrast-150 saturate-125';
      case 'mono':
        return 'grayscale contrast-125';
      case 'invert':
        return 'invert hue-rotate-180';
      default:
        return '';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header toolbar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-teal-400" />
            Lesion Ingestion &amp; Dermatoscope Inspection
          </h2>
          <p className="text-xs text-slate-400">
            Upload macroscopic clinical photo or dermatoscopic close-up (JPG, PNG, WEBP)
          </p>
        </div>

        {currentImage && (
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={onToggleGrid}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                showDermatoscopeGrid
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Toggle Millimeter Dermatoscope Grid Overlay"
              aria-label="Toggle calibrated grid overlay"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">mm Grid</span>
            </button>

            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
              aria-label="Zoom in lesion view"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 1))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
              aria-label="Zoom out lesion view"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Zoom"
              aria-label="Reset zoom level"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-[1px] bg-slate-800 mx-1" />

            <button
              onClick={onClearImage}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition-colors"
              title="Remove Current Image"
              aria-label="Clear image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main image viewer or drop zone */}
      <div className="p-4 sm:p-6">
        {currentImage ? (
          <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center min-h-[340px] max-h-[460px]">
            {/* Image render with zoom & filter */}
            <div
              className="relative transition-transform duration-150 ease-out flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={currentImage}
                alt="Selected dermatological lesion"
                className={`max-w-full max-h-[420px] object-contain rounded-lg ${getFilterClass()}`}
              />

              {/* Dermatoscope Calibrated Overlay Grid */}
              {showDermatoscopeGrid && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(20, 184, 166, 0.3) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(20, 184, 166, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px',
                  }}
                >
                  {/* Calibrated center reticle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-teal-400/60 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                    </div>
                  </div>
                  {/* Scale watermark */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 border border-teal-500/40 text-[10px] font-mono text-teal-300">
                    Grid Scale: 2mm / division
                  </div>
                </div>
              )}
            </div>

            {/* Filter mode pill */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 p-1 rounded-lg text-[11px] backdrop-blur-sm">
              <span className="text-slate-400 px-1">Filter:</span>
              {(['normal', 'contrast', 'mono', 'invert'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors ${
                    filterMode === mode
                      ? 'bg-teal-600 text-white font-medium'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Zoom indicator */}
            {zoomLevel > 1 && (
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-[10px] font-mono text-teal-300">
                {Math.round(zoomLevel * 100)}%
              </div>
            )}
          </div>
        ) : (
          /* Empty state drop zone */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-700 hover:border-teal-500 rounded-2xl p-8 sm:p-12 text-center bg-slate-950/40 transition-colors flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4 text-teal-400">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base font-semibold text-white mb-1">
              Drop skin lesion photo here, or select an option
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-6">
              For optimal accuracy, take a well-lit photo parallel to the skin surface. Avoid direct flash glare.
            </p>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/25 flex items-center gap-2 transition-transform active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload From Device</span>
              </button>

              <button
                onClick={onOpenCamera}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-transform active:scale-95"
              >
                <Camera className="w-4 h-4 text-teal-400" />
                <span>Use Live Camera</span>
              </button>

              <button
                onClick={() => {
                  const sample = CLINICAL_SAMPLES[0];
                  onSelectImage(sample.imageDataUri, {
                    location: sample.location,
                    duration: sample.duration,
                    symptoms: sample.symptoms,
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Load Sample Case</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* Clinical context collapsible */}
        <div className="mt-4 border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden">
          <button
            onClick={() => setShowMetadataForm(!showMetadataForm)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors"
            aria-expanded={showMetadataForm}
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-teal-400" />
              <span>Optional Clinical Context (Anatomy, Duration, Symptoms)</span>
            </div>
            {showMetadataForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMetadataForm && (
            <div className="p-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Anatomical Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="Trunk / Back">Trunk / Back</option>
                  <option value="Face / Cheek / Forehead">Face / Cheek / Forehead</option>
                  <option value="Scalp">Scalp</option>
                  <option value="Neck">Neck</option>
                  <option value="Upper Extremity / Arm">Upper Extremity / Arm</option>
                  <option value="Lower Extremity / Leg">Lower Extremity / Leg</option>
                  <option value="Acral (Hands / Feet / Nails)">Acral (Hands / Feet / Nails)</option>
                  <option value="Flexural Folds (Elbows/Knees/Groin)">Flexural Folds</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Duration Observed</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="< 1 month (recent acute onset)">&lt; 1 month (recent acute onset)</option>
                  <option value="1 - 6 months (progressive changes)">1 - 6 months (progressive changes)</option>
                  <option value="6 - 12 months">6 - 12 months</option>
                  <option value="> 1 year (chronic / stable)">&gt; 1 year (chronic / stable)</option>
                  <option value="Congenital / Life-long">Congenital / Life-long</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Associated Symptoms</label>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {[
                    'Pruritus (Itching)',
                    'Bleeding or oozing',
                    'Crusting / Scaling',
                    'Recent size enlargement',
                    'Pain / Tenderness',
                    'Color darkening',
                  ].map((sym) => (
                    <label key={sym} className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={symptoms.includes(sym)}
                        onChange={() => toggleSymptom(sym)}
                        className="rounded border-slate-700 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="truncate">{sym}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary Analysis Trigger */}
        <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>Voice Command: Say &ldquo;Analyze image&rdquo; or press button</span>
          </div>

          <button
            onClick={onAnalyze}
            disabled={!currentImage || isAnalyzing}
            className={`px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all shadow-lg ${
              !currentImage || isAnalyzing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white shadow-teal-500/30 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running Multimodal ML Classifier...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Analyze Lesion (ML Prediction)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-400" />
                Live Camera Capture
              </h3>
              <button
                onClick={onCloseCamera}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <div className="relative bg-black min-h-[320px] flex items-center justify-center overflow-hidden">
              {cameraError ? (
                <div className="p-6 text-center text-xs text-rose-300">
                  <p className="mb-3">{cameraError}</p>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      onCloseCamera();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold"
                  >
                    Select Local File Instead
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className="w-full h-auto max-h-[380px] object-cover"
                  />
                  {/* Viewfinder crosshairs */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-2 border-dashed border-teal-400/80 flex items-center justify-center">
                      <div className="w-2 h-2 bg-teal-400 rounded-full" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 text-[10px] text-teal-300 font-mono">
                    Center lesion inside reticle
                  </div>
                </>
              )}
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-between gap-3">
              <button
                onClick={onCloseCamera}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={handleCapturePhoto}
                disabled={Boolean(cameraError)}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-teal-600/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Capture Snapshot</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
