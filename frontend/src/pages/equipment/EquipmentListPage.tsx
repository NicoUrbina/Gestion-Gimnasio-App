/**
 * Equipment List Page - Lista de equipos del gimnasio
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Dumbbell, Plus, Search, Filter } from 'lucide-react';

interface Equipment {
    id: number;
    name: string;
    category: number;
    category_name?: string;
    brand: string;
    model: string;
    status: string;
    location: string;
    last_maintenance: string | null;
    next_maintenance: string | null;
}

export default function EquipmentListPage() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            const response = await api.get('/equipment/');
            setEquipment(response.data);
        } catch (error) {
            toast.error('Error al cargar el equipamiento');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEquipment = equipment.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !selectedStatus || item.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            available: 'bg-green-100 text-green-800',
            in_use: 'bg-blue-100 text-blue-800',
            maintenance: 'bg-yellow-100 text-yellow-800',
            out_of_order: 'bg-red-100 text-red-800',
        };
        const labels: Record<string, string> = {
            available: 'Disponible',
            in_use: 'En uso',
            maintenance: 'Mantenimiento',
            out_of_order: 'Fuera de servicio',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Equipamiento</h1>
                    <p className="text-slate-600 mt-1">Gestión de equipos del gimnasio</p>
                </div>
                <Link
                    to="/equipment/new"
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold uppercase tracking-wide hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Equipo
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar equipos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="">Todos los estados</option>
                            <option value="available">Disponible</option>
                            <option value="in_use">En uso</option>
                            <option value="maintenance">Mantenimiento</option>
                            <option value="out_of_order">Fuera de servicio</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEquipment.length === 0 ? (
                    <div className="col-span-full bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <Dumbbell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron equipos</h3>
                        <p className="text-slate-600">Intenta ajustar los filtros</p>
                    </div>
                ) : (
                    filteredEquipment.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                                {getStatusBadge(item.status)}
                            </div>
                            <div className="space-y-2 text-sm">
                                {item.brand && (
                                    <p className="text-slate-600">
                                        <span className="font-semibold">Marca:</span> {item.brand}
                                    </p>
                                )}
                                {item.location && (
                                    <p className="text-slate-600">
                                        <span className="font-semibold">Ubicación:</span> {item.location}
                                    </p>
                                )}
                            </div>
                            <Link
                                to={`/equipment/${item.id}/edit`}
                                className="block mt-4 w-full text-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition"
                            >
                                Ver Detalles
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
