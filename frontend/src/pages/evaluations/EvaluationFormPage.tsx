import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { assessmentService } from '../../services/assessments';
import type { FitnessAssessment } from '../../types/assessments';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

export default function EvaluationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assessment, setAssessment] = useState<Partial<FitnessAssessment>>({});

  useEffect(() => {
    if (id) {
      loadAssessment();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getById(Number(id));
      setAssessment(data);
    } catch (error) {
      console.error('Error loading assessment:', error);
      toast.error('Error al cargar evaluación');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await assessmentService.complete(Number(id), assessment);
      toast.success('Evaluación completada exitosamente');
      navigate('/evaluations');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Error al guardar evaluación');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setAssessment(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          Completar Evaluación Física
        </h1>
        <p className="text-gray-500 mt-1">{assessment.member_name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Medidas Corporales */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Medidas Corporales</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={assessment.weight || ''}
                onChange={(e) => updateField('weight', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
              <input
                type="number"
                step="0.1"
                value={assessment.height || ''}
                onChange={(e) => updateField('height', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">% Grasa</label>
              <input
                type="number"
                step="0.1"
                value={assessment.body_fat_percentage || ''}
                onChange={(e) => updateField('body_fat_percentage', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Masa Muscular (kg)</label>
              <input
                type="number"
                step="0.1"
                value={assessment.muscle_mass || ''}
                onChange={(e) => updateField('muscle_mass', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Circunferencias */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Circunferencias (cm)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pecho</label>
              <input type="number" step="0.1" value={assessment.chest || ''} onChange={(e) => updateField('chest', e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cintura</label>
              <input type="number" step="0.1" value={assessment.waist || ''} onChange={(e) => updateField('waist', e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cadera</label>
              <input type="number" step="0.1" value={assessment.hips || ''} onChange={(e) => updateField('hips', e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
            </div>
          </div>
        </div>

        {/* Nivel de Fitness */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Evaluación de Fitness</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel General</label>
              <select
                value={assessment.fitness_level || ''}
                onChange={(e) => updateField('fitness_level', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
              >
                <option value="">Seleccionar...</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
                <option value="athlete">Atleta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardio (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={assessment.cardio_level || ''}
                onChange={(e) => updateField('cardio_level', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuerza (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={assessment.strength_level || ''}
                onChange={(e) => updateField('strength_level', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flexibilidad (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={assessment.flexibility_level || ''}
                onChange={(e) => updateField('flexibility_level', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Notas del Entrenador</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                value={assessment.observations || ''}
                onChange={(e) => updateField('observations', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recomendaciones</label>
              <textarea
                value={assessment.recommendations || ''}
                onChange={(e) => updateField('recommendations', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-slate-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Guardando...' : 'Completar Evaluación'}
          </button>
        </div>
      </form>
    </div>
  );
}
