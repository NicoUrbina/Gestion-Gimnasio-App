import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { membersService, type Member } from '../../services/members';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface MemberSelectorProps {
    selectedMemberId: number | null;
    onMemberChange: (memberId: number | null) => void;
}

export default function MemberSelector({ selectedMemberId, onMemberChange }: MemberSelectorProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    // Get user from Zustand store
    const user = useAuthStore((state) => state.user);

    console.log('🔍 MemberSelector - User:', user);
    console.log('🔍 MemberSelector - User role:', user?.role?.name);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            setLoading(true);
            console.log('🔍 MemberSelector - Loading members...');
            const data = await membersService.getAll();
            console.log('🔍 MemberSelector - Members loaded:', data.length);
            setMembers(data);
        } catch (error: any) {
            console.error('❌ MemberSelector - Error loading members:', error);
            toast.error('Error al cargar miembros');
        } finally {
            setLoading(false);
        }
    };

    // Only show for trainers, admins, and staff
    if (!user || !user.role || user.role.name === 'member') {
        console.log('🔍 MemberSelector - Not showing (user is member or null)');
        return null;
    }

    console.log('🔍 MemberSelector - Showing selector for:', user.role.name);
    return (
        <div className="bg-zinc-900 rounded-xl border-2 border-zinc-800 p-6 mb-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-bold text-white mb-2">
                        Ver progreso de:
                    </label>

                    {loading ? (
                        <div className="text-sm text-gray-400">Cargando miembros...</div>
                    ) : (
                        <select
                            value={selectedMemberId || ''}
                            onChange={(e) => onMemberChange(e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 font-medium transition-colors"
                        >
                            <option value="">Mi progreso</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.full_name} ({member.email})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
}
