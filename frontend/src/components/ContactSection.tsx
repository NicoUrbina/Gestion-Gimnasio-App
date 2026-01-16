import { useMemo } from "react"

export default function ContactSection() {
  const videoSrc = useMemo(
    () => `${import.meta.env.BASE_URL}video/0_Gym_Exercise_3840x2160.mp4`,
    [],
  )

  return (
    <section id="contact" className="bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-orange-500 font-semibold tracking-widest uppercase text-sm mb-4">
            Contacto
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
            Envíanos un Mensaje
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            Cuéntanos qué necesitas y te responderemos lo antes posible.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-80">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/25 to-transparent" />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="p-7 sm:p-8 bg-white">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Envíanos un mensaje</h3>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                }}
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tu nombre</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tu correo</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    placeholder="tucorreo@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tu teléfono</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    placeholder="+58 412 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tu mensaje</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 min-h-35 resize-none"
                    placeholder="Escribe tu mensaje..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-black uppercase tracking-wide hover:bg-orange-600 transition-colors"
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
