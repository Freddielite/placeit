import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import { ArrowRight, MessageCircle, Bell, BarChart2, Zap } from "lucide-react";

const companyFeatures = [
  { icon: <BarChart2 className="w-4 h-4" />, label: "Real-time application stats" },
  { icon: <Bell className="w-4 h-4" />, label: "New applicant alerts" },
  { icon: <Zap className="w-4 h-4" />, label: "Slot fill notifications" },
];

const studentFeatures = [
  { icon: <Bell className="w-4 h-4" />, label: "New matching placement alerts" },
  { icon: <Zap className="w-4 h-4" />, label: "Application status updates" },
  { icon: <MessageCircle className="w-4 h-4" />, label: "Deadline reminders" },
];

const mockMessages = [
  { from: "PlaceIT Bot", text: "📬 New applicant for Frontend Engineer Intern — Chukwuemeka A.", time: "9:41 AM", bot: true },
  { from: "You", text: "How many spots left?", time: "9:42 AM", bot: false },
  { from: "PlaceIT Bot", text: "You have 4 spots remaining out of 10. 6 applications under review.", time: "9:42 AM", bot: true },
  { from: "PlaceIT Bot", text: "✅ Slot filled! Your SIWES listing is now at full capacity.", time: "2:15 PM", bot: true },
];

export function WhatsAppBot() {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 sm:py-28">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">WhatsApp Integration</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-950 leading-tight tracking-tight">
            Stay updated on{" "}
            <span className="text-[#25D366]">WhatsApp</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base sm:text-lg leading-relaxed">
            No apps to install. Connect your WhatsApp and get placement updates, application alerts, and stats delivered right where you already are.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left — audience cards */}
          <div className="flex-1 flex flex-col gap-5">
            {/* For Companies */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">For Companies</p>
                  <p className="text-[11px] text-gray-400">Real-time dashboard on WhatsApp</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {companyFeatures.map((f) => (
                  <div key={f.label} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-[#25D366] shrink-0">{f.icon}</span>
                    {f.label}
                  </div>
                ))}
              </div>
            </div>

            {/* For Students & Corps */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">For Students & Corps Members</p>
                  <p className="text-[11px] text-gray-400">Never miss a placement opportunity</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {studentFeatures.map((f) => (
                  <div key={f.label} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-primary shrink-0">{f.icon}</span>
                    {f.label}
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/welcome"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 font-bold rounded-xl w-full sm:w-auto justify-center bg-[#25D366] hover:bg-[#22c55e] text-white shadow-lg shadow-[#25D366]/20 border-0"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              Connect Your WhatsApp
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right — mock chat UI */}
          <div className="flex-1 w-full max-w-sm lg:max-w-none">
            <div className="bg-[#f0f2f5] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/60 border border-gray-100">
              {/* Chat header */}
              <div className="bg-[#25D366] px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">PlaceIT Bot</p>
                  <p className="text-white/70 text-[11px]">Online · Placement updates</p>
                </div>
                <div className="ml-auto w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              </div>

              {/* Messages */}
              <div className="px-4 py-5 flex flex-col gap-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZTVkZGQxIiBmaWxsLW9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==')]">
                {mockMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.bot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm",
                        msg.bot
                          ? "bg-white rounded-tl-sm text-gray-800"
                          : "bg-[#dcf8c6] rounded-tr-sm text-gray-800"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1 text-right">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <div className="bg-[#f0f2f5] px-4 py-3 flex items-center gap-3 border-t border-gray-200/60">
                <div className="flex-1 bg-white rounded-full px-4 py-2.5 text-sm text-gray-400">
                  Message PlaceIT Bot…
                </div>
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
