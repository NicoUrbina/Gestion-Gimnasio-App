import {
  DollarSign,
  CreditCard,
  ArrowRightLeft,
  Smartphone,
  MoreHorizontal,
} from 'lucide-react';
import type { PaymentMethod } from '../../types';

interface PaymentMethodIconProps {
  method: PaymentMethod;
  className?: string;
}

export default function PaymentMethodIcon({
  method,
  className = 'w-5 h-5',
}: PaymentMethodIconProps) {
  const icons = {
    cash: DollarSign,
    card: CreditCard,
    transfer: ArrowRightLeft,
    mobile: Smartphone,
    other: MoreHorizontal,
  };

  const Icon = icons[method];

  return <Icon className={className} />;
}
