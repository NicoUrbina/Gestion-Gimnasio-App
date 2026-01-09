import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface MemberFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_notes: string;
}

const initialFormData: MemberFormData = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  medical_notes: '',
};

export default function MemberFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState<MemberFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && id) {
      fetchMember();
    }
  }, [id]);

  const fetchMember = async () => {
    try {
      const response = await api.get(`/members/${id}/`);
      const member = response.data;
      setFormData({
        email: member.user?.email || '',
        password: '', // No se muestra la contraseña
        first_name: member.user?.first_name || '',
        last_name: member.user?.last_name || '',
        phone: member.phone || '',
        date_of_birth: member.date_of_birth || '',
        gender: member.gender || '',
        address: member.address || '',
        emergency_contact_name: member.emergency_contact_name || '',
        emergency_contact_phone: member.emergency_contact_phone || '',
        medical_notes: member.medical_notes || '',
      });
    } catch (error) {
      toast.error('Error al cargar el miembro');
      navigate('/members');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!isEditing && !formData.password) newErrors.password = 'La contraseña es requerida';
    if (!formData.first_name) newErrors.first_name = 'El nombre es requerido';
    if (!formData.last_name) newErrors.last_name = 'El apellido es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      // Limpiar datos antes de enviar (convertir vacíos a null)
      const payload = {
        ...formData,
        date_of_birth: formData.date_of_birth || null,
        phone: formData.phone || '',
        gender: formData.gender || '',
        address: formData.address || '',
        emergency_contact_name: formData.emergency_contact_name || '',
        emergency_contact_phone: formData.emergency_contact_phone || '',
        medical_notes: formData.medical_notes || '',
      };

      if (isEditing) {
        await api.patch(`/members/${id}/`, payload);
        toast.success('Miembro actualizado correctamente');
      } else {
        await api.post('/members/', payload);
        toast.success('Miembro creado correctamente');
      }
      navigate('/members');
    } catch (error: any) {
      console.error('Error creating/updating member:', error);
      const data = error.response?.data;
      
      // Mensaje detalle general
      let message = data?.detail || 'Error al guardar el miembro';
      
      // Errores de validación específicos
      if (data && typeof data === 'object') {
        const validationErrors = Object.entries(data)
          .map(([key, value]: [string, any]) => {
            if (Array.isArray(value)) return `${key}: ${value[0]}`;
            return `${key}: ${value}`;
          })
          .filter(msg => !msg.includes('detail'))
          .join('. ');
          
        if (validationErrors) {
          message = validationErrors;
        }
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/members')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Editar Miembro' : 'Nuevo Miembro'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditing ? 'Actualiza la información del miembro' : 'Registra un nuevo miembro del gimnasio'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de Cuenta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Información de Cuenta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isEditing}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.email ? 'border-red-500' : 'border-slate-200'
                } ${isEditing ? 'bg-slate-50' : ''}`}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Información Personal */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={isEditing}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.first_name ? 'border-red-500' : 'border-slate-200'
                } ${isEditing ? 'bg-slate-50' : ''}`}
                placeholder="Nombre"
              />
              {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Apellido *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={isEditing}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.last_name ? 'border-red-500' : 'border-slate-200'
                } ${isEditing ? 'bg-slate-50' : ''}`}
                placeholder="Apellido"
              />
              {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Género
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Calle, número, ciudad..."
              />
            </div>
          </div>
        </div>

        {/* Contacto de Emergencia */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Contacto de Emergencia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre del Contacto
              </label>
              <input
                type="text"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Teléfono del Contacto
              </label>
              <input
                type="tel"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>
        </div>

        {/* Notas Médicas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Notas Médicas</h2>
          <textarea
            name="medical_notes"
            value={formData.medical_notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
            placeholder="Alergias, condiciones médicas, restricciones de ejercicio..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/members')}
            className="px-6 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditing ? 'Guardar Cambios' : 'Crear Miembro'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
