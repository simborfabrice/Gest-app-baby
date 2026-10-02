import React, { useState } from 'react';
import { Contract, DaySchedule, AnneeType } from '../types';
import { netToBrut, brutToNet } from '../utils/idcc3239';
import { 
  FileText, 
  Printer, 
  Save, 
  Baby, 
  UserCheck, 
  Clock, 
  Coins, 
  Calendar, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface ContratTabProps {
  contract: Contract;
  onSaveContract: (updated: Contract) => void;
}

export const ContratTab: React.FC<ContratTabProps> = ({ contract, onSaveContract }) => {
  const [formData, setFormData] = useState<Contract>(contract);
  const [viewMode, setViewMode] = useState<'edit' | 'contract_doc'>('edit');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync internal state when contract changes from outside
  React.useEffect(() => {
    setFormData(contract);
  }, [contract]);

  const handleHourlyNetChange = (net: number) => {
    const brut = netToBrut(net, formData.isAlsaceMoselle);
    setFormData(prev => ({ ...prev, hourlyRateNet: net, hourlyRateBrut: brut }));
  };

  const handleHourlyBrutChange = (brut: number) => {
    const net = brutToNet(brut, formData.isAlsaceMoselle);
    setFormData(prev => ({ ...prev, hourlyRateBrut: brut, hourlyRateNet: net }));
  };

  const handleScheduleChange = (idx: number, field: keyof DaySchedule, value: any) => {
    setFormData(prev => {
      const newSchedule = [...prev.weeklySchedule];
      newSchedule[idx] = { ...newSchedule[idx], [field]: value };
      
      // Recompute plannedHours if start or end changed
      if (field === 'startTime' || field === 'endTime' || field === 'active') {
        const item = newSchedule[idx];
        if (item.active && item.startTime && item.endTime) {
          const [sh, sm] = item.startTime.split(':').map(Number);
          const [eh, em] = item.endTime.split(':').map(Number);
          const startM = sh * 60 + sm;
          const endM = eh * 60 + em;
          if (endM > startM) {
            item.plannedHours = Number(((endM - startM) / 60).toFixed(2));
          } else {
            item.plannedHours = 0;
          }
        } else {
          item.plannedHours = 0;
        }
      }

      // Recompute weeklyHours
      const totalWeeklyHours = Number(
        newSchedule.reduce((acc, d) => acc + (d.active ? d.plannedHours : 0), 0).toFixed(2)
      );

      return {
        ...prev,
        weeklySchedule: newSchedule,
        weeklyHours: totalWeeklyHours,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContract(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Base mensualisée
  const weeks = formData.anneeType === 'complete' ? 52 : formData.weeksPerYear;
  const baseMonthlyHours = Number(((formData.weeklyHours * weeks) / 12).toFixed(2));
  const baseMonthlySalaryNet = Number((baseMonthlyHours * formData.hourlyRateNet).toFixed(2));
  const baseMonthlySalaryBrut = Number((baseMonthlyHours * formData.hourlyRateBrut).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Header and Toggle */}
      <div className="theme-box p-6 border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Contrat de Travail Assistante Maternelle (CCN IDCC 3239)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Modèle conventionnel officiel conforme aux accords de branche du particulier employeur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'edit' ? 'contract_doc' : 'edit')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {viewMode === 'edit' ? 'Voir le contrat rédigé à signer' : 'Modifier les clauses du contrat'}
          </button>

          {viewMode === 'contract_doc' && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Imprimer le contrat
            </button>
          )}
        </div>
      </div>

      {viewMode === 'edit' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Parents & Assmat */}
          <div className="theme-box p-6 border shadow-2xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-rose-600" />
              1. Les Parties Contractantes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employeur */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-xs uppercase text-slate-700">Le Particulier Employeur</h4>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-0.5">Parent 1 (Nom et prénom) :</label>
                  <input
                    type="text"
                    required
                    value={formData.parent1Name}
                    onChange={(e) => setFormData({ ...formData, parent1Name: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-0.5">Parent 2 (Optionnel) :</label>
                  <input
                    type="text"
                    value={formData.parent2Name || ''}
                    onChange={(e) => setFormData({ ...formData, parent2Name: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">Téléphone :</label>
                    <input
                      type="text"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">Email :</label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-0.5">Adresse du domicile :</label>
                  <input
                    type="text"
                    value={formData.parentAddress}
                    onChange={(e) => setFormData({ ...formData, parentAddress: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Salarié */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-xs uppercase text-slate-700">L'Assistant(e) Maternel(le)</h4>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-0.5">Nom et prénom :</label>
                  <input
                    type="text"
                    required
                    value={formData.assmatName}
                    onChange={(e) => setFormData({ ...formData, assmatName: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">N° Agrément :</label>
                    <input
                      type="text"
                      value={formData.assmatAgrementNumber}
                      onChange={(e) => setFormData({ ...formData, assmatAgrementNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">Date délivrance agrément :</label>
                    <input
                      type="date"
                      value={formData.assmatAgrementDate}
                      onChange={(e) => setFormData({ ...formData, assmatAgrementDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-0.5">Adresse d'accueil :</label>
                  <input
                    type="text"
                    value={formData.assmatAddress}
                    onChange={(e) => setFormData({ ...formData, assmatAddress: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-0.5">Téléphone professionnel :</label>
                  <input
                    type="text"
                    value={formData.assmatPhone}
                    onChange={(e) => setFormData({ ...formData, assmatPhone: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Enfant */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Baby className="w-4 h-4 text-teal-600" />
              2. L'Enfant Accueilli
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-0.5">Prénom :</label>
                <input
                  type="text"
                  required
                  value={formData.childFirstName}
                  onChange={(e) => setFormData({ ...formData, childFirstName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-0.5">Nom de famille :</label>
                <input
                  type="text"
                  required
                  value={formData.childLastName}
                  onChange={(e) => setFormData({ ...formData, childLastName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-0.5">Date de naissance :</label>
                <input
                  type="date"
                  value={formData.childBirthDate}
                  onChange={(e) => setFormData({ ...formData, childBirthDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-0.5">Médecin traitant :</label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Martin (01 23 45 67 89)"
                  value={formData.medicalDoctor || ''}
                  onChange={(e) => setFormData({ ...formData, medicalDoctor: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-0.5">Allergies / Particularités :</label>
                <input
                  type="text"
                  placeholder="Aucune allergie connue..."
                  value={formData.allergies || ''}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Régime d'accueil & Horaires */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              3. Modalités d'Accueil & Horaires Hebdomadaires (IDCC 3239)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Type de Mensualisation :</label>
                <select
                  value={formData.anneeType}
                  onChange={(e) => setFormData({ ...formData, anneeType: e.target.value as AnneeType })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
                >
                  <option value="complete">Année Complète (52 semaines)</option>
                  <option value="incomplete">Année Incomplète (≤ 46 semaines)</option>
                </select>
              </div>

              {formData.anneeType === 'incomplete' && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Nombre de semaines programmées par an :
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="46"
                    value={formData.weeksPerYear}
                    onChange={(e) => setFormData({ ...formData, weeksPerYear: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Ex: 36 (scolaire), 42 ou 44 semaines</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date d'effet du contrat :</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 font-bold border-b text-slate-700 text-[11px] uppercase">
                  <tr>
                    <th className="p-2.5">Jour</th>
                    <th className="p-2.5 text-center">Accueil</th>
                    <th className="p-2.5">Arrivée</th>
                    <th className="p-2.5">Départ</th>
                    <th className="p-2.5 text-right">Durée Journalière</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formData.weeklySchedule.map((d, idx) => (
                    <tr key={d.dayOfWeek} className={d.active ? 'bg-white' : 'bg-slate-50/50 text-slate-400'}>
                      <td className="p-2.5 font-semibold">{d.dayName}</td>
                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={d.active}
                          onChange={(e) => handleScheduleChange(idx, 'active', e.target.checked)}
                          className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="time"
                          disabled={!d.active}
                          value={d.startTime}
                          onChange={(e) => handleScheduleChange(idx, 'startTime', e.target.value)}
                          className="px-2 py-1 border border-slate-200 rounded text-xs disabled:opacity-40"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="time"
                          disabled={!d.active}
                          value={d.endTime}
                          onChange={(e) => handleScheduleChange(idx, 'endTime', e.target.value)}
                          className="px-2 py-1 border border-slate-200 rounded text-xs disabled:opacity-40"
                        />
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-800">
                        {d.active ? `${d.plannedHours} h` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold text-slate-900 border-t">
                  <tr>
                    <td colSpan={4} className="p-2.5 uppercase text-xs">Total Heures Hebdomadaires</td>
                    <td className="p-2.5 text-right font-mono text-sm text-rose-700">{formData.weeklyHours} h / semaine</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Section 4: Tarifs et Indemnités */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600" />
              4. Rémunération & Indemnités Conventionnelles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Taux Horaire Net :</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.05"
                    min="3.00"
                    max="15.00"
                    value={formData.hourlyRateNet}
                    onChange={(e) => handleHourlyNetChange(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500 font-bold text-rose-700"
                  />
                  <span className="text-xs font-bold text-slate-500">€ Net</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Taux Horaire Brut (calculé) :</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.05"
                    value={formData.hourlyRateBrut}
                    onChange={(e) => handleHourlyBrutChange(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500 bg-slate-50"
                  />
                  <span className="text-xs font-bold text-slate-500">€ Brut</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Majoration Heures Sup (&gt;45h) :
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={formData.overtimeRatePercentage}
                    onChange={(e) => setFormData({ ...formData, overtimeRatePercentage: Number(e.target.value) || 10 })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Minimum conventionnel : 10%</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Indemnité de Repas :</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={formData.repasTarif}
                    onChange={(e) => setFormData({ ...formData, repasTarif: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-slate-500">€ / repas</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <div>
                <p className="text-xs font-bold uppercase text-slate-700">Salaire Mensuel de Base Prévu :</p>
                <p className="text-xs text-slate-500">
                  {formData.weeklyHours}h × {weeks} sem / 12 = <span className="font-bold text-slate-700">{baseMonthlyHours}h / mois</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-rose-700">{baseMonthlySalaryNet.toFixed(2)} € Net</span>
                <span className="text-xs text-slate-500 block">({baseMonthlySalaryBrut.toFixed(2)} € Brut)</span>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveSuccess ? 'Contrat enregistré avec succès !' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      ) : (
        /* Printable Complete Contract Document */
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-8 max-w-4xl mx-auto printable-area text-slate-800 text-xs leading-relaxed space-y-6">
          <div className="text-center border-b pb-4">
            <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">
              Contrat de Travail à Durée Indéterminée
            </h1>
            <p className="text-xs font-bold text-rose-700 mt-1">
              Assistant(e) Maternel(le) Agréé(e) du Particulier Employeur
            </p>
            <p className="text-[10px] text-slate-500">
              Conformément à la Convention Collective Nationale des Particuliers Employeurs et de l'Emploi à Domicile (IDCC 3239)
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold uppercase text-slate-900 text-xs border-b pb-1">Entre les soussignés :</h3>
            <p>
              <strong>L'Employeur :</strong><br />
              {formData.parent1Name} {formData.parent2Name ? `et ${formData.parent2Name}` : ''}<br />
              Demeurant à : {formData.parentAddress}<br />
              Téléphone : {formData.parentPhone} • Email : {formData.parentEmail}
            </p>
            <p>
              <strong>Le Salarié :</strong><br />
              {formData.assmatName}<br />
              Demeurant et exerçant à : {formData.assmatAddress}<br />
              Titulaire de l'agrément n° <span className="font-mono">{formData.assmatAgrementNumber}</span> délivré le {formData.assmatAgrementDate} par le Conseil Départemental.
            </p>

            <h3 className="font-bold uppercase text-slate-900 text-xs border-b pb-1 pt-2">Article 1 - Objet du Contrat & Enfant Accueilli</h3>
            <p>
              Le présent contrat est conclu pour l'accueil de l'enfant <strong>{formData.childFirstName} {formData.childLastName}</strong>, né(e) le {formData.childBirthDate}.
            </p>

            <h3 className="font-bold uppercase text-slate-900 text-xs border-b pb-1 pt-2">Article 2 - Période d'Essai</h3>
            <p>
              Le présent contrat prend effet le <strong>{formData.startDate}</strong>. Conformément aux dispositions de la convention collective IDCC 3239, il est convenu d'une période d'essai de 2 mois (si accueil 1 à 3 jours par semaine) ou 3 mois (si accueil 4 jours ou plus par semaine).
            </p>

            <h3 className="font-bold uppercase text-slate-900 text-xs border-b pb-1 pt-2">Article 3 - Durée du Travail & Modalités d'Accueil</h3>
            <p>
              L'accueil est convenu sur la base d'une <strong>{formData.anneeType === 'complete' ? 'Année Complète de 52 semaines' : `Année Incomplète de ${formData.weeksPerYear} semaines`}</strong>, pour une durée hebdomadaire de <strong>{formData.weeklyHours} heures</strong> réparties comme suit :
            </p>
            <ul className="list-disc pl-6 space-y-0.5 font-medium">
              {formData.weeklySchedule.filter(s => s.active).map(s => (
                <li key={s.dayOfWeek}>{s.dayName} : de {s.startTime} à {s.endTime} ({s.plannedHours} heures)</li>
              ))}
            </ul>

            <h3 className="font-bold uppercase text-slate-900 text-xs border-b pb-1 pt-2">Article 4 - Rémunération Mensualisée</h3>
            <p>
              Le salaire horaire brut est fixé à <strong>{formData.hourlyRateBrut.toFixed(2)} €</strong> (soit <strong>{formData.hourlyRateNet.toFixed(2)} € Net</strong>).<br />
              Le salaire mensuel brut s'élève à <strong>{baseMonthlySalaryBrut.toFixed(2)} €</strong> (soit <strong>{baseMonthlySalaryNet.toFixed(2)} € Net</strong>), calculé selon la formule légale : ({formData.weeklyHours}h × {weeks} sem) / 12 = {baseMonthlyHours} heures mensualisées.
            </p>

            <h3 className="font-bold uppercase text-slate-900 text-xs border-b pb-1 pt-2">Article 5 - Heures Supplémentaires & Complémentaires</h3>
            <p>
              Les heures accomplies au-delà de 45 heures hebdomadaires constituent des heures supplémentaires obligatoirement majorées de <strong>{formData.overtimeRatePercentage}%</strong>, bénéficiant des exonérations fiscales et d'allègement de cotisations en vigueur.
            </p>

            <h3 className="font-bold uppercase text-slate-900 text-xs border-b pb-1 pt-2">Article 6 - Indemnités d'Entretien et de Repas</h3>
            <p>
              L'indemnité d'entretien est versée au réel pour chaque journée d'accueil effectif conformément au barème conventionnel IDCC 3239 (minimum légal de 2,65 € pour moins de 6h43 et 3,74 € pour 9h). Les repas fournis par la salariée sont facturés {formData.repasTarif.toFixed(2)} € par repas.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <p className="font-bold mb-16">Fait à ........................................, le {formData.startDate}<br />Signature du Particulier Employeur :</p>
                <div className="border-b border-dashed border-slate-300 w-3/4"></div>
              </div>
              <div>
                <p className="font-bold mb-16">Fait à ........................................, le {formData.startDate}<br />Signature de l'Assistant(e) Maternel(le) :</p>
                <div className="border-b border-dashed border-slate-300 w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
