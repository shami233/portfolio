"use client";

import { useState, type FormEvent } from "react";
import { Mail, Phone, Send, CheckCircle2, Loader2 } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { socialLinks } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate sending
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }, 1500);
  };

  const contactMethods = [
    {
      label: "Email",
      value: socialLinks.email,
      icon: Mail,
      href: `mailto:${socialLinks.email}`,
    },
    {
      label: "Phone",
      value: socialLinks.phone,
      icon: Phone,
      href: `tel:${socialLinks.phone.replace(/\s/g, "")}`,
    },
    {
      label: "GitHub",
      value: "@shamimukasa",
      icon: GithubIcon,
      href: socialLinks.github,
    },
    {
      label: "LinkedIn",
      value: "in/shamimukasa",
      icon: LinkedinIcon,
      href: socialLinks.linkedin,
    },
    {
      label: "WhatsApp",
      value: "Chat with me",
      icon: WhatsappIcon,
      href: socialLinks.whatsapp,
    },
  ];

  return (
    <section id="contact" className="section">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[420px] -translate-x-1/2 rounded-full bg-white/5 blur-[120px] sm:h-[400px] sm:w-[600px] sm:blur-[150px]" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's Build Something"
          highlight="Amazing"
          description="Have a project in mind or want to collaborate? I'd love to hear from you."
        />

        <div className="grid gap-6 lg:grid-cols-5 lg:gap-12">
          {/* Contact methods */}
          <div className="space-y-3 lg:col-span-2 lg:space-y-4">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  method.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="glass glass-hover group flex items-center gap-4 rounded-2xl p-4 sm:p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 sm:h-12 sm:w-12">
                  <method.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-eyebrow mb-1 text-gray-500">
                    {method.label}
                  </p>
                  <p className="text-sm break-words text-white">
                    {method.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="glass-strong space-y-5 rounded-2xl p-5 sm:space-y-6 sm:rounded-3xl sm:p-7 md:p-8"
            >
              <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                <div className="floating-input">
                  <input
                    type="text"
                    id="name"
                    placeholder=" "
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <label htmlFor="name">Your Name</label>
                </div>
                <div className="floating-input">
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <label htmlFor="email">Your Email</label>
                </div>
              </div>

              <div className="floating-input">
                <textarea
                  id="message"
                  rows={5}
                  placeholder=" "
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
                <label htmlFor="message">Your Message</label>
              </div>

              <button
                type="submit"
                disabled={status !== "idle"}
                className="btn-gold tap inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "idle" && (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Send Message
                  </>
                )}
                {status === "sending" && (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Sending...
                  </>
                )}
                {status === "sent" && (
                  <>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Message Sent!
                  </>
                )}
              </button>

              {/* Success message */}
              {status === "sent" && (
                <p className="text-center text-white text-sm animate-pulse">
                  Thank you for reaching out! I&apos;ll get back to you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}