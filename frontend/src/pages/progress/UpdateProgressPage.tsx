import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, TrendingUp, Scale, Ruler } from 'lucide-react';
import { progressService } from '../../services/progress';
import toast from 'react-hot-toast';

export default function UpdateProgressPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    body_fat_percentage: '',
    muscle_mass: '',
    chest: '',
    waist: '',
    hips: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.weight && !formData.body_fat_percentage && !formData.waist) {
      toast.error('Ingresa al menos un dato para registrar');
      return;
    }

    try {
      setSaving(true);
      
      // Convert empty strings to null
      const dataToSend = {
        date: formData.date,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : null,
        chest: formData.chest ? parseFloat(formData.chest) : null,
        waist: formData.waist ? parseFloat(formData.waist) : null,
        hips: formData.hips ? parseFloat(formData.hips) : null,
        notes: formData.notes,
      };

      await progressService.createLog(dataToSend);
      toast.success('¡Progreso registrado exitosamente!');
      navigate('/progress/evolution');
    } catch (error: any) {
      console.error('Error saving progress:', error);
      toast.error(error.response?.data?.detail || 'Error al guardar progreso');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-orange-500" />
          Registrar Progreso
        </h1>
        <p className="text-gray-500 mt-1">Actualiza tus medidas para ver tu evolución</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
          <div className="mb-4">
            <label className="block text-sm font-bold text-white mb-2">
              Fecha de Registro
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
              required
            />
          </div>
        </div>

        {/* Peso y Composición */}
        <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-orange-500" />
            Peso y Composición Corporal
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="300"
                value={formData.weight}
                onChange={(e) => updateField('weight', e.target.value)}
                placeholder="75.5"
                className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (cm)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="250"
                value={formData.height}
                onChange={(e) => updateField('height', e.target.value)}
                placeholder="175"
                className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">Para calcular tu IMC</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                % Grasa Corporal
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.body_fat_percentage}
                onChange={(e) => updateField('body_fat_percentage', e.target.value)}
                placeholder="18.5"
                className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Masa Muscular (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={formData.muscle_mass}
                onChange={(e) => updateField('muscle_mass', e.target.value)}
                placeholder="60.5"
                className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Medidas Corporales */}
        <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-orange-500" />
            Medidas Corporales (cm)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pecho
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={formData.chest}
                onChange={(e) => updateField('chest', e.target.value)}
                placeholder="95"
                className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cintura
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={formData.waist}
                onChange={(e) => updateField('waist', e.target.value)}
                placeholder="80"
                className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cadera
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={formData.hips}
                onChange={(e) => updateField('hips', e.target.value)}
                placeholder="95"
                className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Notas Personales
          </h2>
          <textarea
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Cómo te sientes, cambios que has notado, nivel de energía, etc."
            rows={4}
            className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 Consejos</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Regístrate siempre a la misma hora (preferiblemente en ayunas por la mañana)</li>
            <li>• Usa la misma báscula y cinta métrica para consistencia</li>
            <li>• No es necesario completar todos los campos, solo los que tengas disponibles</li>
            <li>• Registra tus medidas al menos una vez por semana para ver progreso</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border-2 border-zinc-700 rounded-xl font-bold text-white hover:bg-zinc-800/50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Guardando...' : 'Guardar Progreso'}
          </button>
        </div>
      </form>
    </div>
  );
}
