import { useEffect, useState, useRef } from 'react';
import {
    Users,
    Loader2,
    Search,
    MoreVertical,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Award,
    Dumbbell,
    X,
    Calendar,
    Mail,
    User,
    Phone,
} from 'lucide-react';
import { staffService } from '../services/staff';
import type { Staff } from '../types';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 6;

export default function TrainersPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchStaff();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await staffService.getAll();
            setStaff(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar el personal');
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`¿Estás seguro de eliminar a "${name}"? Esta acción no se puede deshacer.`)) return;

        try {
            await staffService.delete(id);
            toast.success('Entrenador eliminado correctamente');
            setStaff(prev => prev.filter(s => s.id !== id));
            setOpenMenuId(null);
        } catch (error: any) {
            const msg = error.response?.data?.detail || 'Error al eliminar';
            toast.error(msg);
        }
    };

    const handleViewDetails = async (id: number) => {
        try {
            setDetailLoading(true);
            setSelectedStaff(null); // reset while loading
            const fullData = await staffService.getById(id);
            setSelectedStaff(fullData);
        } catch (error) {
            toast.error('Error al cargar los detalles');
        } finally {
            setDetailLoading(false);
        }
    };

    // Filtering
    const filteredStaff = staff.filter(s => {
        const name = s.full_name || s.user?.first_name + ' ' + s.user?.last_name || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || s.staff_type === filterType;
        return matchesSearch && matchesType;
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredStaff.length / ITEMS_PER_PAGE));
    const paginatedStaff = filteredStaff.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getStaffTypeBadge = (type: string, display: string) => {
        const colors: Record<string, string> = {
            trainer: 'bg-orange-900/30 text-orange-400 border-orange-500/30',
            receptionist: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
            admin: 'bg-purple-900/30 text-purple-400 border-purple-500/30',
            maintenance: 'bg-gray-800 text-gray-400 border-gray-600/30',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${colors[type] || colors.maintenance}`}>
                {display}
            </span>
        );
    };

    const getName = (member: Staff) => member.full_name || (member.user ? `${member.user.first_name} ${member.user.last_name}` : 'Sin nombre');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Dumbbell className="w-7 h-7 text-orange-500" />
                        Entrenadores
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {staff.length} miembros del personal
                    </p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre..."
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-500"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="trainer">Entrenador</option>
                        <option value="receptionist">Recepcionista</option>
                        <option value="admin">Administrador</option>
                        <option value="maintenance">Mantenimiento</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                ) : filteredStaff.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Users className="w-12 h-12 mb-3" />
                        <p className="text-lg font-medium">No se encontró personal</p>
                        <p className="text-sm mt-1">
                            {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay personal registrado'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tipo</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Especialidades</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {paginatedStaff.map(member => {
                                    const name = getName(member);
                                    const email = member.user?.email || '';

                                    return (
                                        <tr key={member.id} className="hover:bg-zinc-800/50 transition-colors">
                                            {/* Name */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white">{name}</p>
                                                        <p className="text-xs text-gray-400">{email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-6 py-4">
                                                {getStaffTypeBadge(member.staff_type, member.staff_type_display)}
                                            </td>

                                            {/* Specializations */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[250px]">
                                                    {member.specializations && member.specializations.length > 0 ? (
                                                        member.specializations.slice(0, 3).map((spec, i) => (
                                                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 text-gray-300 text-[11px] rounded-full">
                                                                <Award className="w-3 h-3 text-orange-400" />
                                                                {spec}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-gray-500">—</span>
                                                    )}
                                                    {member.specializations && member.specializations.length > 3 && (
                                                        <span className="text-[11px] text-gray-500">+{member.specializations.length - 3} más</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                {member.is_active ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-red-900/30 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
                                                        Inactivo
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end relative" ref={openMenuId === member.id ? menuRef : undefined}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(openMenuId === member.id ? null : member.id);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                                    >
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>

                                                    {openMenuId === member.id && (
                                                        <div className="absolute right-0 top-10 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 py-1 animate-in fade-in duration-200">
                                                            <button
                                                                onClick={() => {
                                                                    handleViewDetails(member.id);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                Ver detalles
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleDelete(member.id, name);
                                                                }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-700 hover:text-red-300 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredStaff.length > 0 && (
                    <div className="px-6 py-3 border-t border-zinc-800 flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredStaff.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredStaff.length)} de {filteredStaff.length} registros
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-zinc-800"
                            >
                                <ChevronLeft className="w-4 h-4 inline -mt-0.5" /> Anterior
                            </button>
                            <span className="text-sm text-gray-400 min-w-[80px] text-center">
                                Pág. {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-zinc-800"
                            >
                                Siguiente <ChevronRight className="w-4 h-4 inline -mt-0.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {(selectedStaff || detailLoading) && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => { setSelectedStaff(null); setDetailLoading(false); }}
                >
                    <div
                        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {detailLoading ? (
                            <div className="flex items-center justify-center h-48">
                                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                            </div>
                        ) : selectedStaff && (
                            <>
                                {/* Modal Header */}
                                <div className="flex items-start justify-between p-6 border-b border-zinc-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/25">
                                            {getName(selectedStaff).charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{getName(selectedStaff)}</h2>
                                            <div className="mt-1">
                                                {getStaffTypeBadge(selectedStaff.staff_type, selectedStaff.staff_type_display)}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedStaff(null)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 space-y-5">
                                    {/* Información Personal */}
                                    <div>
                                        <h3 className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-3">Información Personal</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2.5">
                                                <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[11px] text-gray-500 uppercase font-medium">Nombre completo</p>
                                                    <p className="text-sm text-gray-300">
                                                        {selectedStaff.user ? `${selectedStaff.user.first_name} ${selectedStaff.user.last_name}` : getName(selectedStaff)}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedStaff.user?.email && (
                                                <div className="flex items-center gap-2.5">
                                                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[11px] text-gray-500 uppercase font-medium">Email</p>
                                                        <p className="text-sm text-gray-300">{selectedStaff.user.email}</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2.5">
                                                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[11px] text-gray-500 uppercase font-medium">Teléfono</p>
                                                    <p className="text-sm text-gray-300">
                                                        {selectedStaff.user?.phone || 'No registrado'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[11px] text-gray-500 uppercase font-medium">Estado</p>
                                                    <p className={`text-sm font-medium ${selectedStaff.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {selectedStaff.is_active ? 'Activo' : 'Inactivo'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información Laboral */}
                                    <div>
                                        <h3 className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-3">Información Laboral</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedStaff.hire_date && (
                                                <div className="flex items-center gap-2.5">
                                                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[11px] text-gray-500 uppercase font-medium">Fecha de contratación</p>
                                                        <p className="text-sm text-gray-300">
                                                            {new Date(selectedStaff.hire_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2.5">
                                                <Dumbbell className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[11px] text-gray-500 uppercase font-medium">Instructor</p>
                                                    <p className={`text-sm font-medium ${selectedStaff.is_instructor ? 'text-orange-400' : 'text-gray-400'}`}>
                                                        {selectedStaff.is_instructor ? 'Sí' : 'No'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    {selectedStaff.bio && (
                                        <div>
                                            <h3 className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">Biografía</h3>
                                            <p className="text-sm text-gray-300 bg-zinc-800/50 rounded-xl p-3 border border-zinc-800 leading-relaxed">
                                                {selectedStaff.bio}
                                            </p>
                                        </div>
                                    )}

                                    {/* Specializations */}
                                    <div>
                                        <h3 className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-3 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-orange-400" />
                                            Especialidades
                                        </h3>
                                        {selectedStaff.specializations && selectedStaff.specializations.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedStaff.specializations.map((spec, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium rounded-xl"
                                                    >
                                                        <Award className="w-4 h-4 text-orange-400" />
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No tiene especialidades registradas</p>
                                        )}
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 border-t border-zinc-800 flex justify-end">
                                    <button
                                        onClick={() => setSelectedStaff(null)}
                                        className="px-5 py-2 text-sm font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
