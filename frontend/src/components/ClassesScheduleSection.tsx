import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

type ScheduleClass = {
  time: string
  name: string
  trainer: string
}

type DaySchedule = {
  day: string
  classes: ScheduleClass[]
}

export default function ClassesScheduleSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  const schedule = useMemo<DaySchedule[]>(
    () => [
      {
        day: "LUNES",
        classes: [
          { time: "09:00 - 10:00", name: "Yoga", trainer: "Ana Pérez" },
          { time: "11:30 - 12:30", name: "Cardio Blast", trainer: "Sara López" },
          { time: "18:00 - 19:00", name: "HIIT", trainer: "Laura Díaz" },
        ],
      },
      {
        day: "MARTES",
        classes: [
          { time: "08:00 - 09:00", name: "Pilates", trainer: "Juan Gómez" },
          { time: "10:00 - 11:00", name: "Yoga", trainer: "Ana Pérez" },
          { time: "18:30 - 19:30", name: "Boxeo", trainer: "Leo Martín" },
        ],
      },
      {
        day: "MIÉRCOLES",
        classes: [
          { time: "07:30 - 08:30", name: "Muay Thai", trainer: "Zeki Álvarez" },
          { time: "12:00 - 12:30", name: "Zumba", trainer: "Sara López" },
          { time: "18:30 - 19:30", name: "CrossFit", trainer: "Tomás Ruiz" },
        ],
      },
      {
        day: "JUEVES",
        classes: [
          { time: "09:00 - 10:00", name: "Spinning", trainer: "Laura Green" },
          { time: "07:00 - 08:00", name: "Yoga", trainer: "Ana Pérez" },
          { time: "17:00 - 18:00", name: "Kickboxing", trainer: "Marco Devis" },
        ],
      },
      {
        day: "VIERNES",
        classes: [
          { time: "07:00 - 08:00", name: "Yoga Matutino", trainer: "Juan Gómez" },
          { time: "08:30 - 09:30", name: "Muay Thai", trainer: "Zeki Álvarez" },
          { time: "18:30 - 19:30", name: "Dance Fit", trainer: "Laura Green" },
        ],
      },
      {
        day: "SÁBADO",
        classes: [
          { time: "09:00 - 10:00", name: "Meditación", trainer: "John Smith" },
          { time: "17:00 - 18:00", name: "Body Pump", trainer: "Mike Johnson" },
        ],
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
      id="classes"
      ref={(node) => {
        sectionRef.current = node
      }}
      className="bg-linear-to-b from-black via-black to-slate-950 py-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-orange-500 font-semibold tracking-widest uppercase text-sm mb-4">
            Horario
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
            Horario de Clases
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            Plan de entrenamiento por hora. Reserva tu cupo cuando quieras.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 lg:gap-6">
          {schedule.map((day, idx) => (
            <div
              key={day.day}
              className={`rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.55)] ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
                }`}
              style={{ transitionDelay: `${idx * 90}ms` }}
            >
              <div className="bg-orange-500 text-black text-xs font-black tracking-widest uppercase text-center py-3">
                {day.day}
              </div>

              <div className="p-4 space-y-3">
                {day.classes.map((c) => (
                  <div
                    key={`${day.day}-${c.time}-${c.name}`}
                    className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"
                  >
                    <div className="text-orange-400 text-xs font-bold tracking-wide">
                      {c.time}
                    </div>
                    <div className="text-white font-extrabold mt-1">
                      {c.name}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {c.trainer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate('/step1-schedule')}
            className="px-10 py-4 rounded-full bg-orange-500 text-black font-black text-sm uppercase tracking-wide shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-colors"
          >
            Agendar una cita
          </button>
        </div>
      </div>
    </section>
  )
}
