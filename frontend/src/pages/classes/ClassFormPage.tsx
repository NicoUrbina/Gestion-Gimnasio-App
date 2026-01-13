import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { gymClassService, classTypeService } from '../../services/classes';
import type { ClassType, GymClass } from '../../types';

export default function ClassFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  
  const [formData, setFormData] = useState({
    class_type: '',
    title: '',
    description: '',
    start_datetime: '',
    duration_minutes: '60',
    capacity: '20',
    location: 'Sala Principal',
    instructor: '',
  });

  useEffect(() => {
    fetchClassTypes();
    if (isEditing) {
      fetchClass();
    }
  }, [id]);

  const fetchClassTypes = async () => {
    try {
      const data = await classTypeService.getAll();
      setClassTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching class types:', error);
      setClassTypes([]);
    }
  };

  const fetchClass = async () => {
    try {
      setLoading(true);
      const gymClass = await gymClassService.getById(parseInt(id!));
      
      // Convertir datetime a formato input
      const startDate = new Date(gymClass.start_datetime);
      const endDate = new Date(gymClass.end_datetime);
      const duration = Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
      
      setFormData({
        class_type: gymClass.class_type.toString(),
        title: gymClass.title,
        description: gymClass.description,
        start_datetime: formatDatetimeLocal(startDate),
        duration_minutes: duration.toString(),
        capacity: gymClass.capacity.toString(),
        location: gymClass.location,
        instructor: gymClass.instructor?.toString() || '',
      });
    } catch (error) {
      console.error('Error fetching class:', error);
      alert('Error al cargar la clase');
      navigate('/classes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.class_type || !formData.title || !formData.start_datetime) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setSaving(true);

      // Calcular end_datetime
      const startDate = new Date(formData.start_datetime);
      const endDate = new Date(startDate.getTime() + parseInt(formData.duration_minutes) * 60000);

      const payload: any = {
        class_type: parseInt(formData.class_type),
        title: formData.title,
        description: formData.description,
        start_datetime: startDate.toISOString(),
        end_datetime: endDate.toISOString(),
        capacity: parseInt(formData.capacity),
        location: formData.location,
      };

      if (formData.instructor) {
        payload.instructor = parseInt(formData.instructor);
      }

      if (isEditing) {
        await gymClassService.update(parseInt(id!), payload);
        alert('Clase actualizada exitosamente');
      } else {
        await gymClassService.create(payload);
        alert('Clase creada exitosamente');
      }

      navigate('/classes');
    } catch (error: any) {
      console.error('Error saving class:', error);
      alert(error.response?.data?.message || 'Error al guardar la clase');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill title cuando se selecciona tipo
    if (name === 'class_type' && !formData.title) {
      const selectedType = classTypes.find(t => t.id === parseInt(value));
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          title: selectedType.name,
          duration_minutes: selectedType.default_duration_minutes.toString(),
          capacity: selectedType.default_capacity.toString(),
        }));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/classes')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Editar Clase' : 'Nueva Clase'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditing ? 'Modifica los detalles de la clase' : 'Programa una nueva clase'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Clase */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Clase <span className="text-red-500">*</span>
            </label>
            <select
              name="class_type"
              value={formData.class_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Seleccionar tipo</option>
              {classTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ej: Yoga Matutino"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Fecha y Hora */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha y Hora <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="start_datetime"
              value={formData.start_datetime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Duración */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Duración (minutos)
            </label>
            <input
              type="number"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              min="15"
              step="5"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Capacidad */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Capacidad Máxima
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej: Sala 1, Área de pesas"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción de la clase..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/classes')}
            className="px-6 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditing ? 'Actualizar' : 'Crear'} Clase
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Helper: Format Date to datetime-local input format
 */
function formatDatetimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
