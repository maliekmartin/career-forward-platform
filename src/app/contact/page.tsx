"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSuccess(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-[#7C5FF5]/10 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex h-20 items-center justify-between px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/branding/1.png"
              alt="Career Forward"
              width={180}
              height={50}
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#7C5FF5] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium text-[#7C5FF5] transition-colors">
              Contact
            </Link>
            <Link href="/careers" className="text-sm font-medium text-gray-700 hover:text-[#7C5FF5] transition-colors">
              Careers
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="sm"
              asChild
              className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-8 h-11 shadow-lg shadow-[#7C5FF5]/30"
            >
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#F3E8FF] via-white to-[#E9D5FF]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,95,245,0.08),transparent_60%)]" />

        <div className="max-w-4xl mx-auto px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA] text-white rounded-full px-5 py-2.5 mb-6 shadow-lg shadow-[#7C5FF5]/30">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-semibold">Get in Touch</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Contact{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA]">
                Career Forward
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about Career Forward? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                Let's Connect
              </h2>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Email Us
                    </h3>
                    <a
                      href="mailto:support@martinbuiltstrategies.com"
                      className="text-[#7C5FF5] hover:underline text-lg"
                    >
                      support@martinbuiltstrategies.com
                    </a>
                    <p className="text-gray-600 text-sm mt-1">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Location
                    </h3>
                    <p className="text-gray-600">
                      Spokane, Washington
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#F3E8FF] to-white border border-[#7C5FF5]/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Launching Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  Career Forward is currently in development and will launch in Q2 2027. Join our waitlist to be among the first to access the platform.
                </p>
                <Button
                  asChild
                  className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-8 shadow-lg shadow-[#7C5FF5]/30"
                >
                  <Link href="/waitlist">Join the Waitlist</Link>
                </Button>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white border border-[#7C5FF5]/20 rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Send us a Message
                </h2>

                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 text-sm font-medium">
                      Message sent successfully! We'll be in touch soon.
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="h-12 rounded-xl border-gray-200 focus:border-[#7C5FF5] focus:ring-[#7C5FF5]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="h-12 rounded-xl border-gray-200 focus:border-[#7C5FF5] focus:ring-[#7C5FF5]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help?"
                      className="h-12 rounded-xl border-gray-200 focus:border-[#7C5FF5] focus:ring-[#7C5FF5]/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className="rounded-xl border-gray-200 focus:border-[#7C5FF5] focus:ring-[#7C5FF5]/20 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-xl font-medium shadow-lg shadow-[#7C5FF5]/30"
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#F3E8FF] to-white border-t border-[#7C5FF5]/10 py-16">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="md:col-span-1">
              <Image
                src="/branding/1.png"
                alt="Career Forward"
                width={210}
                height={60}
                className="mb-4"
              />
              <p className="text-[#7C5FF5] font-semibold text-lg mb-3">
                Your Path to Employment
              </p>
            </div>

            <div>
              <h3 className="text-gray-900 font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-bold mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#7C5FF5]/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Career Forward. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-600">Launching Q2 2027</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
