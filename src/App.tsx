import React, { useState, useEffect, useMemo } from 'react';
import { Contract, AttendanceDay, AppTheme } from './types';
import { INITIAL_CONTRACTS, generateInitialMonthAttendance } from './data/defaultContracts';
import { calculateMonthSummary } from './utils/idcc3239';
import { getThemeStyles, DEFAULT_THEME } from './utils/theme';
import { Header } from './components/Header';
import { PlanningTab } from './components/PlanningTab';
import { FichePaieTab } from './components/FichePaieTab';
import { PajemploiTab } from './components/PajemploiTab';
import { CongesPayesTab } from './components/CongesPayesTab';
import { RegularisationTab } from './components/RegularisationTab';
import { FinContratTab } from './components/FinContratTab';
import { ContratTab } from './components/ContratTab';
import { GuideIDCCModal } from './components/GuideIDCCModal';
import { NewContractModal } from './components/NewContractModal';
import { LogoVariant } from './components/Logo';
import { LogoPickerModal } from './components/LogoPickerModal';
import { ThemeModal } from './components/ThemeModal';

import { 
  Calendar, 
  FileCheck2, 
  FileSpreadsheet, 
  Palmtree, 
  Scale, 
  FileSignature, 
  FileText,
  AlertCircle
} from 'lucide-react';

type TabType = 'planning' | 'fiche_paie' | 'pajemploi' | 'conges' | 'regularisation' | 'fin_contrat' | 'contrat';

export default function App() {
  // Current date (Default to October 2026 or current)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // 9 = Octobre (0-indexed)

  // Logo variant state with localStorage persistence (Default to user's uploaded Gest'App logo)
  const [logoVariant, setLogoVariant] = useState<LogoVariant>(() => {
    try {
      const saved = localStorage.getItem('gestappbaby_logo_variant') as LogoVariant;
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'gestapp_officiel';
  });

  // Custom uploaded image data URL state
  const [customImageDataUrl, setCustomImageDataUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('gestappbaby_custom_logo_data');
    } catch (e) {
      console.error(e);
      return null;
    }
  });

  // Contracts state with localStorage persistence
  const [contracts, setContracts] = useState<Contract[]>(() => {
    try {
      const saved = localStorage.getItem('nounouexpert_contracts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CONTRACTS;
  });

  const [activeContractId, setActiveContractId] = useState<string>(() => {
    return contracts[0]?.id || INITIAL_CONTRACTS[0].id;
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('planning');

  // Attendance store by key `${contractId}-${year}-${month}`
  const [attendanceStore, setAttendanceStore] = useState<Record<string, AttendanceDay[]>>(() => {
    try {
      const saved = localStorage.getItem('nounouexpert_attendance');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isNewContractOpen, setIsNewContractOpen] = useState(false);
  const [isLogoPickerOpen, setIsLogoPickerOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Theme settings state with localStorage persistence
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('gestappbaby_theme_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_THEME;
  });

  const themeStyles = useMemo(() => getThemeStyles(theme), [theme]);

  // Sync theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gestappbaby_theme_settings', JSON.stringify(theme));
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Sync logo settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gestappbaby_logo_variant', logoVariant);
    } catch (e) {
      console.error(e);
    }
  }, [logoVariant]);

  useEffect(() => {
    try {
      if (customImageDataUrl) {
        localStorage.setItem('gestappbaby_custom_logo_data', customImageDataUrl);
      } else {
        localStorage.removeItem('gestappbaby_custom_logo_data');
      }
    } catch (e) {
      console.error(e);
    }
  }, [customImageDataUrl]);

  // Sync contracts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nounouexpert_contracts', JSON.stringify(contracts));
    } catch (e) {
      console.error(e);
    }
  }, [contracts]);

  // Sync attendance to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nounouexpert_attendance', JSON.stringify(attendanceStore));
    } catch (e) {
      console.error(e);
    }
  }, [attendanceStore]);

  // Active Contract
  const activeContract = useMemo(() => {
    return contracts.find(c => c.id === activeContractId) || contracts[0];
  }, [contracts, activeContractId]);

  // Active Month Attendance
  const currentStoreKey = `${activeContract.id}-${selectedYear}-${selectedMonth}`;
  const currentAttendanceDays = useMemo(() => {
    if (attendanceStore[currentStoreKey]) {
      return attendanceStore[currentStoreKey];
    }
    // Generate initial realistic month data if not yet created
    const generated = generateInitialMonthAttendance(activeContract, selectedYear, selectedMonth);
    return generated;
  }, [attendanceStore, currentStoreKey, activeContract, selectedYear, selectedMonth]);

  // Compute month summary with IDCC 3239 formulas
  const monthSummary = useMemo(() => {
    return calculateMonthSummary(
      activeContract,
      selectedYear,
      selectedMonth,
      currentAttendanceDays
    );
  }, [activeContract, selectedYear, selectedMonth, currentAttendanceDays]);

  // Handlers for attendance updates
  const handleUpdateDay = (updatedDay: AttendanceDay) => {
    const newDays = currentAttendanceDays.map(d => d.date === updatedDay.date ? updatedDay : d);
    setAttendanceStore(prev => ({
      ...prev,
      [currentStoreKey]: newDays
    }));
  };

  const handleApplyDefaultSchedule = () => {
    const generated = generateInitialMonthAttendance(activeContract, selectedYear, selectedMonth);
    setAttendanceStore(prev => ({
      ...prev,
      [currentStoreKey]: generated
    }));
  };

  const handleClearMonth = () => {
    const cleared = currentAttendanceDays.map(d => ({
      ...d,
      status: 'non_accueilli' as const,
      actualHours: 0,
      actualArrival: '',
      actualDeparture: '',
      repasFourni: false,
      gouterFourni: false,
      kmParcourus: 0,
    }));
    setAttendanceStore(prev => ({
      ...prev,
      [currentStoreKey]: cleared
    }));
  };

  const handleSaveContract = (updated: Contract) => {
    setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleAddContract = (newContract: Contract) => {
    setContracts(prev => [...prev, newContract]);
    setActiveContractId(newContract.id);
  };

  const handleExportData = () => {
    const exportData = {
      contracts,
      attendanceStore,
      exportDate: new Date().toISOString(),
      version: 'IDCC 3239 - 2026'
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GestappBaby-IDCC3239-Sauvegarde-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintCurrent = () => {
    window.print();
  };

  const tabs = [
    { id: 'planning', label: 'Planning & Présences', icon: Calendar, badge: `${monthSummary.presentDaysCount}j` },
    { id: 'fiche_paie', label: 'Bulletin de Paie IDCC 3239', icon: FileCheck2, badge: `${monthSummary.totalNetToPay.toFixed(0)}€` },
    { id: 'pajemploi', label: 'Déclaration Pajemploi', icon: FileSpreadsheet, badge: 'Exact' },
    { id: 'conges', label: 'Congés Payés', icon: Palmtree },
    { id: 'regularisation', label: 'Régularisation Annuelle', icon: Scale },
    { id: 'fin_contrat', label: 'Fin de Contrat & Rupture', icon: FileSignature },
    { id: 'contrat', label: 'Contrat de Travail', icon: FileText },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col font-sans text-slate-900 transition-colors"
      style={{
        ...themeStyles,
        background: `linear-gradient(135deg, ${theme.secondaryColor}08 0%, #ffffff 50%, ${theme.primaryColor}08 100%)`
      }}
    >
      {/* Header */}
      <Header
        contracts={contracts}
        activeContractId={activeContractId}
        onSelectContract={setActiveContractId}
        onNewContract={() => setIsNewContractOpen(true)}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onSelectYear={setSelectedYear}
        onSelectMonth={setSelectedMonth}
        onOpenGuide={() => setIsGuideOpen(true)}
        onExportData={handleExportData}
        onPrintCurrent={handlePrintCurrent}
        logoVariant={logoVariant}
        customImageDataUrl={customImageDataUrl}
        onOpenLogoPicker={() => setIsLogoPickerOpen(true)}
        theme={theme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs Bar with Dynamic Theme */}
        <div 
          className="bg-white/90 backdrop-blur-md mb-6 rounded-2xl p-1.5 shadow-xs overflow-x-auto scrollbar-none border"
          style={{ borderColor: `${theme.primaryColor}25` }}
        >
          <nav className="flex space-x-1.5 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive ? 'text-white scale-[1.02]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                  style={isActive ? {
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    boxShadow: `0 4px 14px ${theme.primaryColor}35`
                  } : undefined}
                >
                  <Icon className="w-4 h-4" style={{ color: isActive ? '#ffffff' : theme.secondaryColor }} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span 
                      className="px-1.5 py-0.2 rounded-full text-[10px] font-black"
                      style={isActive ? {
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        color: '#ffffff'
                      } : {
                        backgroundColor: `${theme.primaryColor}12`,
                        color: theme.primaryColor
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Views */}
        <div className="transition-all duration-150">
          {activeTab === 'planning' && (
            <PlanningTab
              contract={activeContract}
              year={selectedYear}
              month={selectedMonth}
              attendanceDays={currentAttendanceDays}
              onUpdateDay={handleUpdateDay}
              onApplyDefaultSchedule={handleApplyDefaultSchedule}
              onClearMonth={handleClearMonth}
            />
          )}

          {activeTab === 'fiche_paie' && (
            <FichePaieTab
              contract={activeContract}
              summary={monthSummary}
              onPrint={handlePrintCurrent}
            />
          )}

          {activeTab === 'pajemploi' && (
            <PajemploiTab
              contract={activeContract}
              summary={monthSummary}
            />
          )}

          {activeTab === 'conges' && (
            <CongesPayesTab
              contract={activeContract}
            />
          )}

          {activeTab === 'regularisation' && (
            <RegularisationTab
              contract={activeContract}
            />
          )}

          {activeTab === 'fin_contrat' && (
            <FinContratTab
              contract={activeContract}
            />
          )}

          {activeTab === 'contrat' && (
            <ContratTab
              contract={activeContract}
              onSaveContract={handleSaveContract}
            />
          )}
        </div>
      </main>

      {/* Guide IDCC 3239 Modal */}
      <GuideIDCCModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* New Contract Modal */}
      <NewContractModal
        isOpen={isNewContractOpen}
        onClose={() => setIsNewContractOpen(false)}
        onAddContract={handleAddContract}
      />

      {/* Logo Picker Modal */}
      <LogoPickerModal
        isOpen={isLogoPickerOpen}
        onClose={() => setIsLogoPickerOpen(false)}
        selectedVariant={logoVariant}
        customImageDataUrl={customImageDataUrl}
        onSelectVariant={(variant) => {
          setLogoVariant(variant);
          try {
            localStorage.setItem('gestappbaby_logo_variant', variant);
          } catch (e) {
            console.error(e);
          }
        }}
        onUploadCustomImage={(dataUrl) => {
          setCustomImageDataUrl(dataUrl);
          try {
            if (dataUrl) {
              localStorage.setItem('gestappbaby_custom_logo_data', dataUrl);
            } else {
              localStorage.removeItem('gestappbaby_custom_logo_data');
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />

      {/* Theme Customizer Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        theme={theme}
        onUpdateTheme={(newTheme) => {
          setTheme(newTheme);
          try {
            localStorage.setItem('gestappbaby_theme_settings', JSON.stringify(newTheme));
          } catch (e) {
            console.error(e);
          }
        }}
      />
    </div>
  );
}
