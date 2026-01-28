import { Link } from 'react-router-dom';
import {
  CreditCard,
  ArrowLeft,
  DollarSign,
  Wallet,
  Building2,
  Smartphone,
  Save,
  ToggleLeft,
  ToggleRight,
  FileText,
  Percent,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import SettingsNav from '../../components/settings/SettingsNav';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'transfer' | 'mobile';
  icon: typeof DollarSign;
  enabled: boolean;
  instructions?: string;
}

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: 'cash',
    name: 'Efectivo',
    type: 'cash',
    icon: DollarSign,
    enabled: true,
    instructions: 'Pago en efectivo en recepción',
  },
  {
    id: 'card',
    name: 'Tarjeta de Débito/Crédito',
    type: 'card',
    icon: CreditCard,
    enabled: true,
    instructions: 'Punto de venta disponible en recepción',
  },
  {
    id: 'transfer',
    name: 'Transferencia Bancaria',
    type: 'transfer',
    icon: Building2,
    enabled: true,
    instructions: 'Banco: Banesco\nCuenta: 0134-0000-00-0000000000\nRIF: J-12345678-9',
  },
  {
    id: 'mobile',
    name: 'Pago Móvil',
    type: 'mobile',
    icon: Smartphone,
    enabled: true,
    instructions: 'Teléfono: 0412-1234567\nCédula: V-12345678\nBanco: Banesco',
  },
  {
    id: 'zelle',
    name: 'Zelle',
    type: 'transfer',
    icon: Wallet,
    enabled: false,
    instructions: 'Email: pagos@gympro.com',
  },
];

export default function PaymentsSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(16);
  const [invoicePrefix, setInvoicePrefix] = useState('GYM');
  const [requireApproval, setRequireApproval] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const toggleMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) =>
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Configuración de pagos guardada');
  };

  return (
    <div className="space-y-6">
      <SettingsNav />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/settings"
          className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-orange-500" />
            Configuración de Pagos
          </h1>
          <p className="text-gray-400 text-sm">
            Métodos de pago y facturación
          </p>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-orange-500" />
          Configuración General
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Moneda
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="USD">USD - Dólar Americano</option>
              <option value="VES">VES - Bolívar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="COP">COP - Peso Colombiano</option>
              <option value="MXN">MXN - Peso Mexicano</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <span className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Tasa de Impuesto (%)
              </span>
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              min="0"
              max="100"
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Prefijo de Factura
              </span>
            </label>
            <input
              type="text"
              value={invoicePrefix}
              onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
              maxLength={5}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="GYM"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ejemplo: {invoicePrefix}-2026-00001
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <label className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-700 transition-colors">
            <div>
              <p className="font-medium text-white">Requerir aprobación de pagos</p>
              <p className="text-sm text-gray-400">
                Los pagos pendientes deben ser aprobados por un administrador
              </p>
            </div>
            <button
              onClick={() => setRequireApproval(!requireApproval)}
              className="text-2xl"
            >
              {requireApproval ? (
                <ToggleRight className="w-10 h-10 text-green-400" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-gray-500" />
              )}
            </button>
          </label>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Métodos de Pago</h2>

        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className={`p-4 rounded-xl border transition-colors ${method.enabled
                  ? 'bg-zinc-800 border-zinc-700'
                  : 'bg-zinc-900 border-zinc-800 opacity-60'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${method.enabled ? 'bg-orange-500/20' : 'bg-zinc-700'
                      }`}>
                      <Icon className={`w-5 h-5 ${method.enabled ? 'text-orange-400' : 'text-gray-500'
                        }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{method.name}</p>
                      {method.instructions && (
                        <pre className="text-sm text-gray-400 mt-2 whitespace-pre-wrap font-sans">
                          {method.instructions}
                        </pre>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleMethod(method.id)}
                    className="flex-shrink-0"
                  >
                    {method.enabled ? (
                      <ToggleRight className="w-8 h-8 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Los métodos habilitados aparecerán como opciones disponibles al registrar un pago.
        </p>
      </div>

      {/* Invoice Footer */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Pie de Factura</h2>

        <textarea
          rows={3}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
          placeholder="Texto que aparecerá al final de las facturas..."
          defaultValue="Gracias por su preferencia. Este documento no tiene validez fiscal."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Link
          to="/settings"
          className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
        >
          Cancelar
        </Link>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
}
