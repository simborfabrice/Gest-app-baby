import React from 'react';
import { Contract, AppTheme } from '../types';
import { Logo, LogoVariant } from './Logo';
import { 
  Calendar, 
  BookOpen, 
  Plus, 
  Printer, 
  Download, 
  ShieldCheck, 
  UserCheck,
  Palette,
  Sliders,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  contracts: Contract[];
  activeContractId: string;
  onSelectContract: (id: string) => void;
  onNewContract: () => void;
  selectedYear: number;
  selectedMonth: number;
  onSelectYear: (year: number) => void;
  onSelectMonth: (month: number) => void;
  onOpenGuide: () => void;
  onExportData: () => void;
  onPrintCurrent: () => void;
  logoVariant: LogoVariant;
  customImageDataUrl?: string | null;
  onOpenLogoPicker: () => void;
  theme: AppTheme;
  onOpenThemeModal: () => void;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const Header: React.FC<HeaderProps> = ({
  contracts,
  activeContractId,
  onSelectContract,
  onNewContract,
  selectedYear,
  selectedMonth,
  onSelectYear,
  onSelectMonth,
  onOpenGuide,
  onExportData,
  onPrintCurrent,
  logoVariant,
  customImageDataUrl,
  onOpenLogoPicker,
  theme,
  onOpenThemeModal,
}) => {
  const activeContract = contracts.find(c => c.id === activeContractId) || contracts[0];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-40 shadow-xs" style={{ borderColor: `${theme.primaryColor}20` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with fixed logo in the top-left */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 gap-3 border-b border-slate-100/80">
          {/* Fixed Logo in Top-Left with click-to-change button */}
          <div className="flex items-center gap-2.5">
            <Logo
              variant={logoVariant}
              customImageDataUrl={customImageDataUrl}
              onOpenPicker={onOpenLogoPicker}
            />
            
            <button
              onClick={onOpenLogoPicker}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors shadow-2xs hover:scale-102"
              style={{
                color: theme.primaryColor,
                backgroundColor: `${theme.primaryColor}12`,
                borderColor: `${theme.primaryColor}30`
              }}
              title="Choisir le logo officiel ou téléverser votre fichier"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Changer Logo</span>
            </button>

            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
              CCN IDCC 3239
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={onOpenThemeModal}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all shadow-xs hover:scale-102"
              style={{
                color: theme.primaryColor,
                backgroundColor: `${theme.primaryColor}15`,
                borderColor: `${theme.primaryColor}40`
              }}
              title="Changer les couleurs du thème et de toutes les cases"
            >
              <div className="flex items-center -space-x-1">
                <span className="w-3 h-3 rounded-full border border-white shadow-2xs" style={{ backgroundColor: theme.primaryColor }} />
                <span className="w-3 h-3 rounded-full border border-white shadow-2xs" style={{ backgroundColor: theme.secondaryColor }} />
                <span className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: theme.boxColor || '#ffffff' }} />
              </div>
              <span>Couleurs & Cases</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shadow-2xs"
              title="Consulter le mémo juridique IDCC 3239"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
              Guide IDCC
            </button>

            <button
              onClick={onExportData}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
              title="Exporter les données au format JSON"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Sauvegarder
            </button>

            <button
              onClick={onPrintCurrent}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-xl text-white transition-all shadow-xs"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
              }}
              title="Imprimer la vue en cours"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Imprimer
            </button>
          </div>
        </div>

        {/* Lower bar: Child / Contract switcher & Month Navigator */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 gap-3">
          {/* Contracts tabs / selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-blue-900/60 uppercase tracking-wider flex items-center mr-1">
              <UserCheck className="w-3.5 h-3.5 mr-1 text-blue-500" /> Enfant :
            </span>
            {contracts.map(contract => {
              const isSelected = contract.id === activeContractId;
              return (
                <button
                  key={contract.id}
                  onClick={() => onSelectContract(contract.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    isSelected ? 'shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                  style={isSelected ? {
                    color: theme.primaryColor,
                    backgroundColor: `${theme.primaryColor}14`,
                    borderColor: `${theme.primaryColor}50`,
                  } : undefined}
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: isSelected ? theme.primaryColor : '#94a3b8' }} 
                  />
                  <span>{contract.childFirstName} {contract.childLastName}</span>
                  <span 
                    className="px-1.5 py-0.2 rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: `${theme.secondaryColor}15`,
                      color: theme.secondaryColor
                    }}
                  >
                    {contract.anneeType === 'complete' ? '52 sem' : `${contract.weeksPerYear} sem`}
                  </span>
                </button>
              );
            })}

            <button
              onClick={onNewContract}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-dashed transition-colors whitespace-nowrap"
              style={{
                color: theme.secondaryColor,
                borderColor: `${theme.secondaryColor}50`,
                backgroundColor: `${theme.secondaryColor}08`
              }}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Nouveau contrat
            </button>
          </div>

          {/* Month & Year Selectors */}
          <div 
            className="flex items-center justify-between sm:justify-end gap-2 p-1.5 rounded-xl border"
            style={{
              backgroundColor: `${theme.primaryColor}08`,
              borderColor: `${theme.primaryColor}20`
            }}
          >
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 ml-1" style={{ color: theme.secondaryColor }} />
              <select
                value={selectedMonth}
                onChange={(e) => onSelectMonth(Number(e.target.value))}
                className="text-xs font-bold bg-transparent border-0 text-slate-800 focus:ring-0 cursor-pointer"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(Number(e.target.value))}
              className="text-xs font-bold bg-transparent border-0 text-slate-800 focus:ring-0 cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {activeContract && (
              <span className="text-[11px] font-medium text-slate-600 border-l border-slate-300 pl-2 hidden lg:inline">
                <span className="font-bold" style={{ color: theme.secondaryColor }}>{activeContract.weeklyHours}h</span>/sem • <span className="font-bold" style={{ color: theme.primaryColor }}>{activeContract.hourlyRateNet.toFixed(2)}€</span> net/h
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
