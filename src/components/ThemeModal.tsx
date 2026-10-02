import React from 'react';
import { AppTheme, BoxStyle, BoxRadius } from '../types';
import { THEME_PRESETS, BOX_COLOR_PALETTES, DEFAULT_THEME } from '../utils/theme';
import { 
  X, 
  Palette, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Square, 
  Calendar,
  CheckCircle2,
  Clock,
  Paintbrush
} from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  onUpdateTheme: (updated: AppTheme) => void;
}

const QUICK_COLORS = [
  '#f43f5e', // Rose vif
  '#2563eb', // Bleu roi
  '#4a0e4e', // Violet Gest'App
  '#0284c7', // Cyan lagon
  '#059669', // Vert émeraude
  '#ea580c', // Orange corail
  '#7c3aed', // Violet lavande
  '#d946ef', // Fuchsia pétillant
  '#db2777', // Rose framboise
  '#0f172a', // Noir ardoise
  '#475569', // Gris acier
  '#ca8a04', // Or ambré
];

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  theme,
  onUpdateTheme,
}) => {
  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
    onUpdateTheme({
      ...theme,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      boxColor: preset.boxColor,
      boxStyle: preset.boxStyle,
    });
  };

  const handleApplyBoxPalette = (palette: typeof BOX_COLOR_PALETTES[0]) => {
    onUpdateTheme({
      ...theme,
      boxColor: palette.hex,
      boxBorderColor: palette.border,
      boxStyle: 'custom',
    });
  };

  const handleReset = () => {
    onUpdateTheme(DEFAULT_THEME);
  };

  // Determine current active box background for live preview
  let previewBoxBg = theme.boxColor || '#ffffff';
  if (theme.boxStyle === 'clean') previewBoxBg = '#ffffff';
  else if (theme.boxStyle === 'pastel') previewBoxBg = `${theme.primaryColor}0f`;
  else if (theme.boxStyle === 'intense') previewBoxBg = `${theme.primaryColor}22`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        {/* Header */}
        <div 
          className="px-6 py-4 border-b border-slate-200 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}18, ${theme.secondaryColor}18)`
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
              }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Couleurs du Thème & de Toutes les Cases
              </h2>
              <p className="text-xs text-slate-500">
                Personnalisez la couleur générale et la teinte exacte de chaque case et carte
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

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          
          {/* 1. Live Interactive Preview of Boxes */}
          <div>
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
              Aperçu en Direct de vos Réglages (Cases & Thème)
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Box 1: Metric KPI card preview */}
              <div 
                className="p-3.5 rounded-2xl border transition-all shadow-2xs col-span-1 sm:col-span-2 space-y-2.5"
                style={{
                  backgroundColor: previewBoxBg,
                  borderColor: theme.boxBorderColor || `${theme.primaryColor}35`,
                  borderRadius: theme.borderRadius === 'sharp' ? '4px' : theme.borderRadius === 'standard' ? '10px' : theme.borderRadius === 'extra' ? '24px' : '16px'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1" style={{ color: theme.primaryColor }}>
                    <Clock className="w-3.5 h-3.5" /> Case de Suivi / Métrique
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-white shadow-2xs"
                    style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
                  >
                    Badge Actif
                  </span>
                </div>
                <p className="text-lg font-black text-slate-900">
                  145,50 h <span className="text-xs font-normal text-slate-500">travaillées</span>
                </p>
                <div className="flex gap-2 pt-1">
                  <button 
                    className="px-2.5 py-1 rounded-lg text-white font-bold text-[11px] shadow-2xs"
                    style={{ background: theme.primaryColor }}
                  >
                    Bouton Thème
                  </button>
                  <button 
                    className="px-2.5 py-1 rounded-lg text-white font-bold text-[11px] shadow-2xs"
                    style={{ background: theme.secondaryColor }}
                  >
                    Accent
                  </button>
                </div>
              </div>

              {/* Box 2: Planning day cell preview */}
              <div 
                className="p-3 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between"
                style={{
                  backgroundColor: previewBoxBg,
                  borderColor: theme.boxBorderColor || `${theme.secondaryColor}35`,
                  borderRadius: theme.borderRadius === 'sharp' ? '4px' : theme.borderRadius === 'standard' ? '10px' : theme.borderRadius === 'extra' ? '24px' : '16px'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs text-white" style={{ background: theme.primaryColor }}>
                    12
                  </span>
                  <span className="text-[10px] font-bold uppercase" style={{ color: theme.secondaryColor }}>
                    Lundi
                  </span>
                </div>
                <div className="my-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    Présent 8h
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  Case Jour Planning
                </span>
              </div>
            </div>
          </div>

          {/* 2. SPECIFIC BOX COLOR SECTION (Toutes les cases de l'application) */}
          <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-extrabold text-slate-900 block text-xs flex items-center gap-1.5">
                  <Paintbrush className="w-4 h-4" style={{ color: theme.primaryColor }} />
                  Couleur de Toutes les Cases de l'Application :
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Choisissez la couleur de fond de toutes les cases (cartes, planning, récapitulatifs, etc.)
                </p>
              </div>

              {/* Direct Color Picker for Boxes */}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.boxColor || '#ffffff'}
                  onChange={(e) => onUpdateTheme({
                    ...theme,
                    boxColor: e.target.value,
                    boxStyle: 'custom'
                  })}
                  className="w-10 h-9 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shadow-2xs"
                  title="Sélectionner la couleur exacte des cases avec la pipette"
                />
                <input
                  type="text"
                  value={theme.boxColor || '#ffffff'}
                  onChange={(e) => onUpdateTheme({
                    ...theme,
                    boxColor: e.target.value,
                    boxStyle: 'custom'
                  })}
                  className="w-24 px-2 py-1.5 font-mono font-bold text-xs uppercase border border-slate-300 rounded-lg bg-white"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Quick Box Color Presets */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Teintes Rapides pour les Cases :
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BOX_COLOR_PALETTES.map((pal) => {
                  const isSelected = theme.boxStyle === 'custom' && theme.boxColor?.toLowerCase() === pal.hex.toLowerCase();
                  return (
                    <button
                      key={pal.id}
                      onClick={() => handleApplyBoxPalette(pal)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        isSelected 
                          ? 'border-slate-900 ring-2 ring-slate-400 shadow-xs font-bold scale-[1.02]' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={{ backgroundColor: pal.hex }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border border-slate-300 shrink-0 shadow-2xs" 
                        style={{ backgroundColor: pal.hex }} 
                      />
                      <div className="overflow-hidden">
                        <span className="text-[11px] font-bold text-slate-900 block truncate">
                          {pal.name}
                        </span>
                        <span className="text-[9px] text-slate-500 block truncate">
                          {pal.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode de Rendu des Cases */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Style d'application aux cases :
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'custom', label: 'Couleur Choisi', desc: 'Applique votre couleur libre' },
                  { id: 'clean', label: 'Blanc Net', desc: 'Blanc pur lumineux' },
                  { id: 'pastel', label: 'Pastel Thème', desc: 'Teinte légère assortie' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onUpdateTheme({ ...theme, boxStyle: st.id as BoxStyle })}
                    className={`p-2 rounded-xl text-center border-2 transition-all ${
                      theme.boxStyle === st.id 
                        ? 'border-slate-900 bg-white font-bold text-slate-900 shadow-2xs' 
                        : 'border-slate-200 text-slate-600 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <span className="block font-bold text-[11px]">{st.label}</span>
                    <span className="block text-[9px] text-slate-400">{st.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. COULEURS PRINCIPALES DU THÈME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Couleur Principale */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <label className="font-bold text-slate-800 block text-xs">
                Couleur Principale du Thème :
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => onUpdateTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-12 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shadow-2xs"
                  title="Sélectionner avec la pipette"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => onUpdateTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-28 px-2.5 py-2 font-mono font-bold text-xs uppercase border border-slate-300 rounded-lg bg-white"
                />
              </div>

              {/* Quick Swatches */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => onUpdateTheme({ ...theme, primaryColor: c })}
                    className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 shadow-2xs"
                    style={{ 
                      backgroundColor: c,
                      borderColor: theme.primaryColor.toLowerCase() === c.toLowerCase() ? '#000000' : '#ffffff' 
                    }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Couleur Secondaire / Accents */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <label className="font-bold text-slate-800 block text-xs">
                Couleur Secondaire / Accents :
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => onUpdateTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-12 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shadow-2xs"
                  title="Sélectionner avec la pipette"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => onUpdateTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-28 px-2.5 py-2 font-mono font-bold text-xs uppercase border border-slate-300 rounded-lg bg-white"
                />
              </div>

              {/* Quick Swatches */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => onUpdateTheme({ ...theme, secondaryColor: c })}
                    className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 shadow-2xs"
                    style={{ 
                      backgroundColor: c,
                      borderColor: theme.secondaryColor.toLowerCase() === c.toLowerCase() ? '#000000' : '#ffffff' 
                    }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 4. PALETTES COMPLÈTES EN 1 CLIC */}
          <div>
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2.5">
              Palettes Thématiques Complètes (1 Clic)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {THEME_PRESETS.map((p) => {
                const isActive = theme.primaryColor === p.primary && theme.secondaryColor === p.secondary;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                      isActive 
                        ? 'border-slate-900 bg-white shadow-xs scale-102 ring-2 ring-slate-300' 
                        : 'border-slate-200 hover:border-slate-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div 
                        className="w-6 h-6 rounded-full shadow-2xs shrink-0" 
                        style={{ background: p.previewBg }} 
                      />
                      <span className="font-extrabold text-[11px] text-slate-900 truncate">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 line-clamp-1">
                      {p.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. ARRONDI DES ANGLES DES CASES */}
          <div className="pt-2 border-t border-slate-200">
            <label className="font-bold text-slate-800 block text-xs mb-2 flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-slate-500" />
              Arrondi des Angles de Toutes les Cases :
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'sharp', label: 'Droit (4px)' },
                { id: 'standard', label: 'Standard (10px)' },
                { id: 'rounded', label: 'Doux (16px)' },
                { id: 'extra', label: 'Très Arrondi (24px)' },
              ].map((rad) => (
                <button
                  key={rad.id}
                  onClick={() => onUpdateTheme({ ...theme, borderRadius: rad.id as BoxRadius })}
                  className={`p-2 rounded-xl text-center border-2 transition-all ${
                    theme.borderRadius === rad.id 
                      ? 'border-slate-900 bg-slate-100 font-bold text-slate-900' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-bold text-[11px]">{rad.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Rétablir les couleurs par défaut (Rose & Bleu)
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
            }}
          >
            <Check className="w-4 h-4" />
            Appliquer à toute l'Application
          </button>
        </div>
      </div>
    </div>
  );
};
