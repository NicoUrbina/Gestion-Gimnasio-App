import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

type Instructor = {
  id: number
  name: string
  role: string
  bio: string
  specialties: string[]
  imagePath: string
}

export default function InstructorsSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  const instructors = useMemo<Instructor[]>(
    () => [
      {
        id: 1,
        name: "Valentina Rivas",
        role: "Entrenadora Funcional",
        bio: "Te acompaña a mejorar fuerza, postura y resistencia con planes por objetivos.",
        specialties: ["HIIT", "Pilates", "Movilidad"],
        imagePath: `${import.meta.env.BASE_URL}Img/entrenadora.jpg`,
      },
      {
        id: 2,
        name: "Matías Calderón",
        role: "Coach de Fuerza",
        bio: "Especialista en técnica y progresión para que entrenes seguro y constante.",
        specialties: ["CrossFit", "Fuerza", "Spinning"],
        imagePath: `${import.meta.env.BASE_URL}Img/entrenador1.jpg`,
      },
      {
        id: 3,
        name: "Diego Navarro",
        role: "Instructor de Combate",
        bio: "Enfoque en disciplina, cardio y coordinación con sesiones intensas y guiadas.",
        specialties: ["Boxeo", "Kickboxing", "Muay Thai"],
        imagePath: `${import.meta.env.BASE_URL}Img/entrenador2.jpg`,
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
      { threshold: 0.18 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      id="instructors"
      ref={(node) => {
        sectionRef.current = node
      }}
      className="bg-linear-to-b from-slate-900 via-slate-950 to-black py-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-orange-500 font-semibold tracking-widest uppercase text-sm mb-4">
            Entrenadores
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
            Conoce a tu Equipo
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            Elige con quién entrenar y agenda una sesión cuando quieras.
          </p>
        </div>

        <div className="space-y-6">
          {instructors.map((instructor, idx) => (
            <div
              key={instructor.name}
              className={`rounded-3xl overflow-hidden border border-white/10 bg-white/8 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition-all duration-300 hover:shadow-[0_24px_70px_rgba(0,0,0,0.55)] ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
                }`}
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              <div className="max-w-4xl mx-auto">
                <div
                  className={`flex flex-col lg:flex-row items-stretch ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                >
                  <div className="p-5 sm:p-6 lg:w-3/5">
                    <div className="text-orange-500 text-xs font-black tracking-widest uppercase mb-3">
                      {instructor.role}
                    </div>
                    <div className="text-white text-2xl sm:text-3xl font-black leading-tight">
                      {instructor.name}
                    </div>
                    <p className="text-slate-300 mt-3 leading-relaxed text-sm sm:text-base">
                      {instructor.bio}
                    </p>

                    <div className="mt-5">
                      <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                        Clases que suele dar
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {instructor.specialties.map((s) => (
                          <span
                            key={s}
                            className="px-3 py-1 rounded-full border border-white/15 bg-black/20 text-white text-xs font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => navigate('/entrenadores', { state: { instructorId: instructor.id } })}
                        className="px-8 py-3 rounded-full bg-orange-500 text-black font-black text-sm uppercase tracking-wide shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-colors"
                      >
                        Agendar con {instructor.name.split(" ")[0]}
                      </button>
                    </div>
                  </div>

                  <div className="lg:w-2/5 p-5 sm:p-6 flex items-start justify-center">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 w-full max-w-sm aspect-4/3">
                      <div className="absolute inset-0 bg-linear-to-r from-black/35 via-black/15 to-transparent pointer-events-none" />
                      <img
                        src={instructor.imagePath}
                        alt={instructor.name}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
