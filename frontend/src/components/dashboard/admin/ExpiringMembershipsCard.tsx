import { AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExpiringMember {
  id: number;
  member_name: string;
  end_date: string;
  days_remaining: number;
}

interface ExpiringMembershipsCardProps {
  memberships: ExpiringMember[];
}

export default function ExpiringMembershipsCard({ memberships }: ExpiringMembershipsCardProps) {
  const navigate = useNavigate();

  if (!memberships || memberships.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            Membresías por Vencer
          </h3>
          <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded-full">
            TODO BIEN
          </span>
        </div>
        <p className="text-gray-400 text-center py-4">
          No hay membresías próximas a vencer
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-orange-500/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            Membresías por Vencer
          </h3>
        </div>
        <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full uppercase">
          {memberships.length} Próximas
        </span>
      </div>

      <div className="space-y-2">
        {memberships.slice(0, 5).map((membership) => (
          <div
            key={membership.id}
            className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            onClick={() => navigate(`/members/${membership.id}`)}
          >
            <div>
              <p className="font-semibold text-white text-sm">
                {membership.member_name}
              </p>
              <p className="text-xs text-gray-400">
                Vence en {membership.days_remaining} día{membership.days_remaining !== 1 ? 's' : ''}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </div>
        ))}
      </div>

      {memberships.length > 5 && (
        <button
          onClick={() => navigate('/memberships?filter=expiring')}
          className="w-full mt-4 py-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors"
        >
          Ver todas ({memberships.length})
        </button>
      )}
    </div>
  );
}
