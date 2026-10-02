import React, { useRef } from 'react';
import { LogoVariant, LOGO_OPTIONS, LogoIcon } from './Logo';
import { X, Check, Upload, Image, RotateCcw, Sparkles } from 'lucide-react';

interface LogoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVariant: LogoVariant;
  customImageDataUrl: string | null;
  onSelectVariant: (variant: LogoVariant) => void;
  onUploadCustomImage: (dataUrl: string | null) => void;
}

export const LogoPickerModal: React.FC<LogoPickerModalProps> = ({
  isOpen,
  onClose,
  selectedVariant,
  customImageDataUrl,
  onSelectVariant,
  onUploadCustomImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUploadCustomImage(result);
        onSelectVariant('gestapp_officiel');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-rose-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-white to-rose-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-rose-500 flex items-center justify-center text-white shadow-xs">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-blue-950">
                Choix du Logo Définitif Gest'app Baby
              </h2>
              <p className="text-xs text-slate-500">
                Choisissez votre création originale Gest'App ou téléversez votre propre image
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Custom Image Banner */}
        <div className="p-4 mx-6 mt-4 bg-gradient-to-r from-blue-50/70 via-purple-50/40 to-rose-50/70 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Vous avez un fichier image sur votre appareil ?
              </p>
              <p className="text-[11px] text-slate-500">
                Importez directement votre image PNG, JPG ou SVG (ex: IMG_3127.png)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Téléverser mon fichier
            </button>
            {customImageDataUrl && (
              <button
                onClick={() => onUploadCustomImage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Supprimer l'image importée et revenir au vectoriel"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Logo Cards List */}
        <div className="p-6 space-y-3 max-h-[55vh] overflow-y-auto">
          {LOGO_OPTIONS.map((opt) => {
            const isSelected = selectedVariant === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => onSelectVariant(opt.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? 'border-rose-500 bg-gradient-to-r from-rose-50/70 via-pink-50/30 to-blue-50/50 shadow-xs ring-2 ring-rose-200/60'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/70'
                }`}
              >
                {/* Visual Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs p-1">
                  <LogoIcon
                    variant={opt.id}
                    customImageDataUrl={opt.id === 'gestapp_officiel' ? customImageDataUrl : null}
                    className="w-12 h-12"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {opt.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isSelected
                        ? 'bg-rose-500 text-white'
                        : opt.id.startsWith('gestapp')
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {opt.description}
                  </p>
                </div>

                {/* Radio / Selection Indicator */}
                <div className="shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-xs scale-110'
                      : 'border-2 border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-rose-100 bg-gradient-to-r from-blue-50/50 to-rose-50/50 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Logo actif : <span className="font-bold text-slate-800">{LOGO_OPTIONS.find(o => o.id === selectedVariant)?.name}</span>
          </p>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-rose-500 hover:from-blue-700 hover:to-rose-600 shadow-md shadow-rose-200/50 transition-all"
          >
            Valider ce logo
          </button>
        </div>
      </div>
    </div>
  );
};
