import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Send } from 'lucide-react';
import { assessmentService } from '../../services/assessments';
import toast from 'react-hot-toast';

export default function RequestEvaluationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    personal_goals: '',
    medical_notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.personal_goals.trim()) {
      toast.error('Por favor describe tus objetivos');
      return;
    }

    try {
      setLoading(true);
      await assessmentService.requestEvaluation(formData);
      toast.success('Solicitud enviada! Un entrenador la revisará pronto');
      navigate('/evaluations');
    } catch (error) {
      console.error('Error requesting evaluation:', error);
      toast.error('Error al enviar solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <ClipboardCheck className="w-7 h-7 text-orange-500" />
          Solicitar Evaluación Física
        </h1>
        <p className="text-gray-500 mt-1">
          Solicita una evaluación para que tu entrenador diseñe un plan personalizado
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
        {/* Personal Goals */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-white mb-2">
            Objetivos Personales *
          </label>
          <textarea
            value={formData.personal_goals}
            onChange={(e) => setFormData({ ...formData, personal_goals: e.target.value })}
            placeholder="Ej: Quiero perder peso, ganar masa muscular, mejorar resistencia cardiovascular..."
            rows={5}
            className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Describe lo que quieres lograr con tu entrenamiento
          </p>
        </div>

        {/* Medical Notes */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-white mb-2">
            Notas Médicas
          </label>
          <textarea
            value={formData.medical_notes}
            onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
            placeholder="Ej: Lesión en rodilla derecha, problemas de espalda baja, alergias..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Menciona cualquier condición médica, lesión o restricción
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-blue-900 mb-2">¿Qué incluye la evaluación?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Mediciones corporales completas</li>
            <li>• Tests de fuerza y resistencia</li>
            <li>• Evaluación cardiovascular</li>
            <li>• Análisis de flexibilidad</li>
            <li>• Plan de entrenamiento personalizado</li>
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
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>Enviando...</>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Solicitud
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
