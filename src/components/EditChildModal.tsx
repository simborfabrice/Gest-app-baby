import React, { useState, useEffect } from 'react';
import { Contract, AnneeType } from '../types';
import { netToBrut, brutToNet } from '../utils/idcc3239';
import { 
  X, 
  Baby, 
  UserCheck, 
  HeartPulse, 
  FileText, 
  Coins, 
  AlertCircle, 
  Save, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldAlert, 
  Calendar,
  Sparkles,
  Check,
  Clock
} from 'lucide-react';

interface EditChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  onSaveContract: (updatedContract: Contract) => void;
  onDeleteContract?: (contractId: string) => void;
  primaryColor?: string;
  secondaryColor?: string;
}

type ModalTab = 'identite' | 'parents' | 'sante' | 'contrat' | 'habitudes';

/**
 * Calculate human-friendly age string from birth date
 */
function calculateAgeString(birthDateStr: string): string {
  if (!birthDateStr) return '';
  const birth = new Date(birthDateStr);
  const now = new Date();
  
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) {
    months--;
  }

  if (months < 0) return 'À naître';
  if (months === 0) {
    const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return `${Math.max(0, days)} jours`;
  }
  if (months < 12) return `${months} mois`;
  
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) return `${years} an${years > 1 ? 's' : ''}`;
  return `${years} an${years > 1 ? 's' : ''} et ${remMonths} mois`;
}

export const EditChildModal: React.FC<EditChildModalProps> = ({
  isOpen,
  onClose,
  contract,
  onSaveContract,
  onDeleteContract,
  primaryColor = '#f43f5e',
  secondaryColor = '#2563eb',
}) => {
  const [formData, setFormData] = useState<Contract>({ ...contract });
  const [activeTab, setActiveTab] = useState<ModalTab>('identite');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Re-sync when modal opens or contract changes
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...contract });
      setActiveTab('identite');
      setConfirmDelete(false);
      setSavedSuccess(false);
    }
  }, [isOpen, contract]);

  if (!isOpen) return null;

  const ageLabel = calculateAgeString(formData.childBirthDate);

  const handleHourlyRateNetChange = (netVal: number) => {
    setFormData(prev => ({
      ...prev,
      hourlyRateNet: netVal,
      hourlyRateBrut: Number(netToBrut(netVal, prev.isAlsaceMoselle).toFixed(4)),
    }));
  };

  const handleAnneeTypeChange = (type: AnneeType) => {
    setFormData(prev => ({
      ...prev,
      anneeType: type,
      weeksPerYear: type === 'complete' ? 52 : Math.min(prev.weeksPerYear || 44, 46),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContract(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleDelete = () => {
    if (onDeleteContract) {
      onDeleteContract(contract.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header with Child Avatar, Name and Age */}
        <div 
          className="px-6 py-4 border-b border-slate-200 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}14)`
          }}
        >
          <div className="flex items-center gap-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs font-black text-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
              }}
            >
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Fiche Enfant : {formData.childFirstName} {formData.childLastName}
                </h2>
                {ageLabel && (
                  <span 
                    className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                    style={{
                      backgroundColor: `${primaryColor}18`,
                      color: primaryColor,
                    }}
                  >
                    {ageLabel}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Informations administratives, médicales, parents et contrat IDCC 3239
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50/70 overflow-x-auto scrollbar-none">
          <nav className="flex space-x-2 min-w-max pb-2.5">
            {[
              { id: 'identite', label: '1. Identité Enfant', icon: Baby },
              { id: 'parents', label: '2. Parents & Contacts', icon: UserCheck },
              { id: 'sante', label: '3. Santé & Sécurité', icon: HeartPulse },
              { id: 'contrat', label: '4. Contrat & Tarifs IDCC 3239', icon: Coins },
              { id: 'habitudes', label: '5. Habitudes & Notes', icon: Sparkles },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ModalTab)}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'text-white shadow-xs scale-102' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  style={isActive ? {
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                  } : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 space-y-5">
          
          {/* TAB 1: IDENTITÉ DE L'ENFANT */}
          {activeTab === 'identite' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Prénom de l'enfant * :
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.childFirstName}
                    onChange={(e) => setFormData({ ...formData, childFirstName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400 font-semibold"
                    placeholder="Ex: Léa"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nom de famille de l'enfant :
                  </label>
                  <input
                    type="text"
                    value={formData.childLastName}
                    onChange={(e) => setFormData({ ...formData, childLastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400 font-semibold"
                    placeholder="Ex: Martin"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    Date de naissance * :
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.childBirthDate}
                    onChange={(e) => setFormData({ ...formData, childBirthDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                  {ageLabel && (
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Âge actuel : <strong>{ageLabel}</strong>
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Genre / Sexe :
                  </label>
                  <select
                    value={formData.childGender || 'non_precise'}
                    onChange={(e) => setFormData({ ...formData, childGender: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400 bg-white"
                  >
                    <option value="non_precise">Non précisé</option>
                    <option value="fille">Fille</option>
                    <option value="garcon">Garçon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Statut du contrat :
                  </label>
                  <select
                    value={formData.active ? 'actif' : 'archive'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'actif' })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400 bg-white font-semibold"
                  >
                    <option value="actif">🟢 Actif (En accueil)</option>
                    <option value="archive">⚪ Archivé / Fin de contrat</option>
                  </select>
                </div>
              </div>

              {/* Informative ID Card Banner */}
              <div 
                className="p-4 rounded-2xl border flex items-center justify-between"
                style={{
                  backgroundColor: `${primaryColor}08`,
                  borderColor: `${primaryColor}25`
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black shadow-2xs" style={{ color: primaryColor }}>
                    {formData.childFirstName.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-slate-900">
                      {formData.childFirstName} {formData.childLastName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formData.anneeType === 'complete' ? 'Année Complète (52 sem)' : `Année Incomplète (${formData.weeksPerYear} sem)`} • {formData.weeklyHours}h/semaine
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  {formData.hourlyRateNet.toFixed(2)} € net/h
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: PARENTS & CONTACTS */}
          {activeTab === 'parents' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Parent 1 (Responsable légal principal) * :
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nom et Prénom * :</label>
                    <input
                      type="text"
                      required
                      value={formData.parent1Name}
                      onChange={(e) => setFormData({ ...formData, parent1Name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Ex: Sophie Martin"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Téléphone portable :</label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Adresse email :</label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="sophie.martin@example.fr"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  Parent 2 (Co-employeur / Conjoint) :
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nom et Prénom (optionnel) :</label>
                    <input
                      type="text"
                      value={formData.parent2Name || ''}
                      onChange={(e) => setFormData({ ...formData, parent2Name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Ex: Thomas Martin"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">N° Employeur Pajemploi :</label>
                    <input
                      type="text"
                      value={formData.pajemploiEmployerNumber || ''}
                      onChange={(e) => setFormData({ ...formData, pajemploiEmployerNumber: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Ex: PAJ-89372917"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Adresse du domicile familial :
                </label>
                <input
                  type="text"
                  value={formData.parentAddress}
                  onChange={(e) => setFormData({ ...formData, parentAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  placeholder="Ex: 14 rue des Lilas, 75015 Paris"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SANTÉ & SÉCURITÉ */}
          {activeTab === 'sante' && (
            <div className="space-y-4">
              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <h3 className="font-extrabold text-xs text-rose-950 uppercase">
                    Allergies & Intolérances Médicales / Alimentaires :
                  </h3>
                </div>
                <textarea
                  rows={2}
                  value={formData.allergies || ''}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-rose-300 rounded-xl bg-white focus:ring-2 focus:ring-rose-500"
                  placeholder="Ex: Allergie aux arachides / Intolérance lactose / PAI en place..."
                />
                <span className="text-[11px] text-rose-800 block">
                  ⚠️ En cas d'allergie sévère, veillez à détenir une ordonnance valide et la trousse d'urgence (PAI).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Médecin Traitant / Pédiatre :
                  </label>
                  <input
                    type="text"
                    value={formData.medicalDoctor || ''}
                    onChange={(e) => setFormData({ ...formData, medicalDoctor: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    placeholder="Ex: Dr. Roche (01 45 67 89 00)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Régime Alimentaire / Consignes Repas :
                  </label>
                  <input
                    type="text"
                    value={formData.dietaryRequirements || ''}
                    onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    placeholder="Ex: Sans sel ajouté, purée lisse, végétarien..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Personnes autorisées à récupérer l'enfant :
                  </label>
                  <input
                    type="text"
                    value={formData.authorizedPickupPersons || ''}
                    onChange={(e) => setFormData({ ...formData, authorizedPickupPersons: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    placeholder="Ex: Grand-mère Marie (06 11 22 33 44), Oncle Julien"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Seules les personnes déclarées par écrit peuvent venir chercher l'enfant.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Contact d'urgence alternatif :
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact || ''}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    placeholder="Ex: Tante Claire - 06 99 88 77 66"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTRAT & TARIFS IDCC 3239 */}
          {activeTab === 'contrat' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Régime conventionnel (CCN IDCC 3239) :
                  </label>
                  <select
                    value={formData.anneeType}
                    onChange={(e) => handleAnneeTypeChange(e.target.value as AnneeType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold"
                  >
                    <option value="complete">Année Complète (52 semaines)</option>
                    <option value="incomplete">Année Incomplète (≤ 46 semaines)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Semaines programmées / an :
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    disabled={formData.anneeType === 'complete'}
                    value={formData.weeksPerYear}
                    onChange={(e) => setFormData({ ...formData, weeksPerYear: Number(e.target.value) || 52 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl disabled:bg-slate-100 disabled:text-slate-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Heures d'accueil hebdo :
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="60"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Tarifs Salaires */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold uppercase text-slate-800 block">
                  Rémunération Horaire :
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Taux horaire Net (€) * :</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.05"
                        min="2.5"
                        max="20"
                        required
                        value={formData.hourlyRateNet}
                        onChange={(e) => handleHourlyRateNetChange(Number(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-xs font-bold text-slate-600">€</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Taux horaire Brut (€) :</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.01"
                        readOnly
                        value={formData.hourlyRateBrut}
                        className="w-full px-3 py-1.5 text-xs font-mono bg-slate-100 border border-slate-300 rounded-lg text-slate-600"
                      />
                      <span className="text-xs font-bold text-slate-600">€</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Majoration heures sup &gt;45h :</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="10"
                        max="50"
                        value={formData.overtimeRatePercentage}
                        onChange={(e) => setFormData({ ...formData, overtimeRatePercentage: Number(e.target.value) || 10 })}
                        className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-xs font-bold text-slate-600">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indemnités conventionnelles */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold uppercase text-slate-800 block">
                  Indemnités Quotidiennes :
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Repas fourni (€) :</label>
                    <input
                      type="number"
                      step="0.10"
                      value={formData.repasTarif}
                      onChange={(e) => setFormData({ ...formData, repasTarif: Number(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Goûter (€) :</label>
                    <input
                      type="number"
                      step="0.10"
                      value={formData.gouterTarif}
                      onChange={(e) => setFormData({ ...formData, gouterTarif: Number(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Km parcouru (€/km) :</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.kmTarif}
                      onChange={(e) => setFormData({ ...formData, kmTarif: Number(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Date début contrat :</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HABITUDES & NOTES */}
          {activeTab === 'habitudes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Doudou, Rituel d'endormissement & Rythme de sommeil :
                </label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  placeholder="Ex: Doudou lapin obligatoire pour les siestes. Dort généralement de 13h à 15h. Aime écouter des berceuses douces..."
                />
              </div>

              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Mise à jour automatique des plannings et calculs :
                </p>
                <p className="text-blue-800 text-[11px]">
                  Toute modification apportée ici (taux horaire, tarifs repas, volume hebdomadaire, coordonnées des parents) s'actualisera instantanément dans tous les plannings, bulletins de paie IDCC 3239 et déclarations Pajemploi.
                </p>
              </div>
            </div>
          )}

          {/* Delete confirmation danger box */}
          {confirmDelete && (
            <div className="bg-rose-50 border border-rose-300 p-4 rounded-2xl space-y-2 animate-in fade-in duration-150">
              <p className="font-extrabold text-xs text-rose-950 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Confirmer la suppression de la fiche de {formData.childFirstName} ?
              </p>
              <p className="text-[11px] text-rose-800">
                Cette action supprimera cet enfant de votre liste de contrats actifs.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Oui, supprimer définitivement
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {onDeleteContract && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center justify-center text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Supprimer cet enfant
              </button>
            )}

            <div className="flex items-center justify-end gap-2.5 sm:ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:scale-102"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    Enregistré !
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer la fiche enfant
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
