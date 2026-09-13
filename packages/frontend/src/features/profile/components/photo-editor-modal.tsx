import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, RotateCcw, RotateCw, ZoomIn, ZoomOut, Check, Upload, AlertCircle } from 'lucide-react';

interface PhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  isSaving?: boolean;
}

const MAX_OUTPUT_KB = 500; // Max size we'll send (in KB) — compress until under this
const MAX_INPUT_MB = 5;    // Max raw input size in MB

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [inputError, setInputError] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Draw image onto canvas whenever imageSrc, rotation, or scale changes
  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Output canvas is always 400×400 for square avatars
      const SIZE = 400;
      canvas.width = SIZE;
      canvas.height = SIZE;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // Draw with transform: translate to center, rotate, scale, then draw centered
      ctx.save();
      ctx.translate(SIZE / 2, SIZE / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);

      // Fit image into canvas preserving aspect ratio
      const isRotated90 = rotation % 180 !== 0;
      const srcW = isRotated90 ? img.naturalHeight : img.naturalWidth;
      const srcH = isRotated90 ? img.naturalWidth : img.naturalHeight;
      const ratio = Math.min(SIZE / srcW, SIZE / srcH);
      const drawW = img.naturalWidth * ratio;
      const drawH = img.naturalHeight * ratio;

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Estimate output size
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
      setOutputSize(sizeKB);
    };
    img.src = imageSrc;
  }, [imageSrc, rotation, scale]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setInputError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setInputError('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    if (file.size > MAX_INPUT_MB * 1024 * 1024) {
      setInputError(`File is too large. Maximum allowed size is ${MAX_INPUT_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
      setRotation(0);
      setScale(1);
    };
    reader.readAsDataURL(file);
  };

  const rotate = (deg: number) => setRotation((r) => (r + deg + 360) % 360);
  const zoom = (delta: number) => setScale((s) => Math.min(3, Math.max(0.3, +(s + delta).toFixed(2))));

  const handleSave = useCallback(() => {
    if (!canvasRef.current || !imageSrc) return;
    const canvas = canvasRef.current;

    // Compress until under MAX_OUTPUT_KB
    let quality = 0.85;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    while (dataUrl.length * 0.75 > MAX_OUTPUT_KB * 1024 && quality > 0.2) {
      quality -= 0.05;
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    // Convert data URL to File
    const byteStr = atob(dataUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteStr.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i);
    const blob = new Blob([ab], { type: 'image/jpeg' });
    const file = new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' });

    onSave(file);
  }, [imageSrc, onSave]);

  const reset = () => {
    setImageSrc(null);
    setRotation(0);
    setScale(1);
    setInputError(null);
    setOutputSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Profile Photo</h2>
          <button
            onClick={() => { reset(); onClose(); }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Size note */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-xs text-blue-700 dark:text-blue-300">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Max file size: <strong>{MAX_INPUT_MB} MB</strong>. Image will be compressed and cropped to a
              400×400 square. Output will be under <strong>{MAX_OUTPUT_KB} KB</strong>.
            </span>
          </div>

          {/* Upload trigger */}
          {!imageSrc ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to choose a photo</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max {MAX_INPUT_MB} MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <>
              {/* Canvas preview */}
              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-64 h-64 object-contain rounded-full border-4 border-white dark:border-gray-700 shadow"
                  style={{ borderRadius: '50%' }}
                />
              </div>

              {/* Output size indicator */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Preview size: <span className={outputSize > MAX_OUTPUT_KB ? 'text-amber-500 font-semibold' : 'text-emerald-600 font-semibold'}>{outputSize} KB</span>
                {outputSize > MAX_OUTPUT_KB && ' (will be auto-compressed on save)'}
              </p>

              {/* Edit tools */}
              <div className="space-y-3">
                {/* Rotate */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Rotate</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => rotate(-90)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" /> –90°
                    </button>
                    <span className="flex-1 text-center text-sm font-mono text-gray-600 dark:text-gray-400">{rotation}°</span>
                    <button
                      type="button"
                      onClick={() => rotate(90)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <RotateCw className="w-4 h-4" /> +90°
                    </button>
                  </div>
                </div>

                {/* Scale */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Zoom</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => zoom(-0.1)}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="0.3"
                      max="3"
                      step="0.05"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="flex-1 accent-primary"
                    />
                    <button
                      type="button"
                      onClick={() => zoom(0.1)}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-gray-500 w-10 text-right">{Math.round(scale * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Change photo link */}
              <label className="block text-center text-xs text-primary hover:underline cursor-pointer">
                Choose a different photo
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </>
          )}

          {/* Input error */}
          {inputError && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {inputError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => { reset(); onClose(); }}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!imageSrc || isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Photo'}
          </button>
        </div>
      </div>
    </div>
  );
};
