import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  CreditCard,
  Calendar,
  Activity,
  Mail,
  Phone,
  MapPin,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Snowflake,
} from 'lucide-react';
import api from '../services/api';
import type { Member, Membership } from '../types';
import toast from 'react-hot-toast';

export default function MemberDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMemberData();
    }
  }, [id]);

  const fetchMemberData = async () => {
    try {
      const [memberRes, membershipsRes] = await Promise.all([
        api.get(`/members/${id}/`),
        api.get(`/memberships/?member=${id}`),
      ]);
      setMember(memberRes.data);
      setMemberships(membershipsRes.data.results || membershipsRes.data);
    } catch (error) {
      toast.error('Error al cargar el miembro');
      navigate('/members');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
      active: {
        color: 'text-emerald-700',
        bg: 'bg-emerald-100',
        icon: <CheckCircle2 className="w-5 h-5" />,
        label: 'Activo',
      },
      inactive: {
        color: 'text-slate-600',
        bg: 'bg-slate-100',
        icon: <XCircle className="w-5 h-5" />,
        label: 'Inactivo',
      },
      expired: {
        color: 'text-red-700',
        bg: 'bg-red-100',
        icon: <Clock className="w-5 h-5" />,
        label: 'Vencido',
      },
      frozen: {
        color: 'text-blue-700',
        bg: 'bg-blue-100',
        icon: <Snowflake className="w-5 h-5" />,
        label: 'Congelado',
      },
    };
    return configs[status] || configs.inactive;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-slate-500">Miembro no encontrado</p>
      </div>
    );
  }

  const status = getStatusConfig(member.subscription_status);
  const activeMembership = memberships.find((m) => m.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/members')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {member.user?.first_name} {member.user?.last_name}
          </h1>
          <p className="text-slate-500 mt-1">Detalles del miembro</p>
        </div>
        <button
          onClick={() => navigate(`/members/${id}/edit`)}
          className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
        >
          <Edit className="w-5 h-5" />
          Editar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                {member.user?.first_name?.charAt(0) || 'M'}
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                {member.user?.first_name} {member.user?.last_name}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium mt-3 ${status.bg} ${status.color}`}
              >
                {status.icon}
                {status.label}
              </span>
            </div>

            <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">{member.user?.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">{member.phone}</span>
                </div>
              )}
              {member.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">{member.address}</span>
                </div>
              )}
              {member.date_of_birth && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">
                    {new Date(member.date_of_birth).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
              {member.gender && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">
                    {member.gender === 'M' ? 'Masculino' : member.gender === 'F' ? 'Femenino' : 'Otro'}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {member.joined_date
                    ? new Date(member.joined_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })
                    : '-'}
                </p>
                <p className="text-sm text-slate-500">Miembro desde</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {member.days_inactive || 0}
                </p>
                <p className="text-sm text-slate-500">Días inactivo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Membership */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-400" />
                Membresía Actual
              </h3>
              <button
                onClick={() => navigate(`/memberships/new?member=${id}`)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                + Nueva Membresía
              </button>
            </div>

            {activeMembership ? (
              <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{activeMembership.plan_name}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Vence: {new Date(activeMembership.end_date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">
                      {activeMembership.days_remaining}
                    </p>
                    <p className="text-sm text-slate-500">días restantes</p>
                  </div>
                </div>
                {activeMembership.is_expiring_soon && (
                  <div className="mt-3 p-2 bg-amber-100 text-amber-700 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    La membresía vence pronto
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Sin membresía activa</p>
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          {(member.emergency_contact_name || member.emergency_contact_phone) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contacto de Emergencia</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{member.emergency_contact_name || 'No especificado'}</p>
                  <p className="text-sm text-slate-500">{member.emergency_contact_phone || 'Sin teléfono'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Medical Notes */}
          {member.medical_notes && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-slate-400" />
                Notas Médicas
              </h3>
              <p className="text-slate-600 whitespace-pre-wrap">{member.medical_notes}</p>
            </div>
          )}

          {/* Membership History */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Historial de Membresías</h3>
            </div>
            {memberships.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                No hay historial de membresías
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {memberships.map((membership) => (
                  <div key={membership.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-900">{membership.plan_name}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(membership.start_date).toLocaleDateString('es-ES')} -{' '}
                        {new Date(membership.end_date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        membership.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : membership.status === 'expired'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {membership.status_display}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
