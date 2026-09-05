"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email us",
    value: "support@getplaceit.com",
    href: "mailto:support@getplaceit.com",
    accent: "bg-primary/8 text-primary border-primary/15",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: "WhatsApp / Call",
    value: "+234 808 104 7072",
    href: "https://wa.me/2348081047072",
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: "Based in",
    value: "Lagos, Nigeria",
    href: null,
    accent: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: "Response time",
    value: "Within 24 hours",
    href: null,
    accent: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

const subjects = [
  "SIWES placement question",
  "NYSC PPA question",
  "Company listing enquiry",
  "Partnership / collaboration",
  "Technical issue",
  "Other",
];

export function ContactBody() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", agree: false });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section className="bg-[#f7f8fc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* Left: contact info */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 leading-tight">Contact info</h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Reach us directly or use the form — either works. We&apos;re a small team and we read every message.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {contactInfo.map((c) => (
                <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${c.accent}`}>
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors truncate block">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust note */}
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-900 mb-1">We take support seriously</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Whether you&apos;re a student stuck on an application or a company with a listing question — we respond personally, not with bots.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="flex-1 w-full">
            {submitted ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-10 sm:p-14 flex flex-col items-center gap-5 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Message sent!</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-sm">
                    We&apos;ve received your message and will get back to you at <strong>{form.email}</strong> within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "", agree: false }); }}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-7 sm:p-10">
                <h3 className="text-xl font-black text-gray-900 mb-6">Send a message</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full name</label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Adaeze Okonkwo"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="rounded-xl border-gray-200 focus:border-primary/40 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="rounded-xl border-gray-200 focus:border-primary/40 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="" disabled>Select a subject...</option>
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-sm font-semibold text-gray-700">Message</label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us what's on your mind..."
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="min-h-32 rounded-xl border-gray-200 focus:border-primary/40 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  {/* Agree */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={form.agree}
                      onChange={handleChange}
                      required
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                    />
                    <span className="text-sm text-gray-500">
                      I agree to the{" "}
                      <a href="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</a>
                      {" "}and{" "}
                      <a href="/terms-of-service" className="text-primary font-semibold hover:underline">Terms of Use</a>.
                    </span>
                  </label>

                  <Button
                    type="submit"
                    disabled={loading || !form.agree}
                    className="w-full sm:w-auto self-start gap-2 rounded-xl font-bold px-8 py-3 text-sm shadow-sm shadow-primary/25 disabled:opacity-50"
                    size="default"
                  >
                    {loading ? "Sending..." : "Send message"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
