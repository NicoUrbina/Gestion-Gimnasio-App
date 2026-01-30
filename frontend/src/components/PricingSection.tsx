import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import PaymentModal from "./PaymentModal"

type PricingPlan = {
  badge: string
  kicker: string
  title: string
  priceLine: string
  subtitle: string
  features: string[]
  ctaLabel: string
  secondaryLabel: string
  highlighted?: boolean
}

interface PricingSectionProps {
  fontClassName?: string
}

export default function PricingSection({ fontClassName }: PricingSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const navigate = useNavigate()

  const plans = useMemo<PricingPlan[]>(
    () => [
      {
        badge: "3$ /día",
        kicker: "Plan diario",
        title: "Por Día",
        priceLine: "3$ /día",
        subtitle: "Acceso al gimnasio + asesoría básica",
        features: ["Acceso completo al gimnasio", "1 clase grupal", "Soporte en recepción"],
        ctaLabel: "Elegir plan",
        secondaryLabel: "Ver detalles",
      },
      {
        badge: "25$ /mes",
        kicker: "Más popular",
        title: "Por Mes",
        priceLine: "25$ /mes",
        subtitle: "Ideal para entrenar con constancia",
        features: ["Acceso completo al gimnasio", "Clases grupales incluidas", "Evaluación inicial", "Soporte 24/7"],
        ctaLabel: "Elegir plan",
        secondaryLabel: "Ver detalles",
        highlighted: true,
      },
      {
        badge: "50$ / 3 meses",
        kicker: "Plan trimestral",
        title: "3 Meses",
        priceLine: "50$ / 3 meses",
        subtitle: "Mejor valor para tu progreso",
        features: [
          "Acceso completo al gimnasio",
          "Clases grupales incluidas",
          "Evaluación + plan básico",
          "Prioridad en reservas",
        ],
        ctaLabel: "Elegir plan",
        secondaryLabel: "Ver detalles",
      },
    ],
    [],
  )

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [])

  const handlePlanSelection = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  return (
    <section
      id="memberships"
      ref={(node) => {
        sectionRef.current = node
      }}
      className={`bg-gradient-to-b from-slate-950 via-slate-950 to-black py-20 px-4 ${fontClassName ?? ""}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-orange-500 font-semibold tracking-widest uppercase text-sm mb-4">
            Membresías
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
            Planes y Precios
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            Elige el plan que mejor se adapta a tu ritmo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, idx) => (
            <div
              key={plan.title}
              className={`group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(0,0,0,0.55)] ${plan.highlighted ? "ring-1 ring-orange-500/40" : ""
                } ${isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
                }`}
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 blur-3xl" />
              </div>

              <div className="p-7 sm:p-8">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white text-black text-xs font-bold">
                    {plan.badge}
                  </span>
                  <div className="text-slate-300 text-sm font-semibold">{plan.kicker}</div>
                </div>

                <div className="mb-4">
                  <div className="text-white text-3xl font-black leading-tight">{plan.title}</div>
                </div>

                <div className="mb-2">
                  <div className="text-white text-lg font-bold">{plan.priceLine}</div>
                  <div className="text-slate-400 text-sm mt-2">{plan.subtitle}</div>
                </div>

                <div className="h-px bg-white/10 my-6" />

                <ul className="space-y-3 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-slate-200 text-sm">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/15 text-orange-400">
                        <span className="block w-2 h-2 rounded-full bg-orange-500" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan)}
                  className="w-full px-5 py-3 rounded-full bg-orange-500 text-black font-bold text-sm uppercase tracking-wide shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-colors"
                >
                  {plan.ctaLabel}
                </button>
                <button
                  onClick={() => navigate('/planes-y-precios')}
                  className="mt-3 w-full px-5 py-3 rounded-full border border-white/15 bg-black/20 text-white font-semibold text-sm hover:bg-white/5 transition-colors"
                >
                  {plan.secondaryLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
      />
    </section>
  )
}
