export function ContactHero() {
  return (
    <section className="bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #9ba8d4 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 95% 90% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(71,125,192,0.09)_0%,transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-28 pb-14 sm:pt-36 sm:pb-20 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Contact Us
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-gray-950 leading-tight tracking-tight">
          We&apos;d love to<br />
          <span className="text-primary">hear from you</span>
        </h1>
        <p className="mt-5 text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Questions about placements, partnerships, or the platform? Send us a message and we&apos;ll get back to you within 24 hours.
        </p>
      </div>
    </section>
  );
}
