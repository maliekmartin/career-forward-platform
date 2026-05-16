"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Lightbulb, Heart } from "lucide-react";

export default function AboutPage() {
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
            <Link href="/about" className="text-sm font-medium text-[#7C5FF5] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-[#7C5FF5] transition-colors">
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

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA] text-white rounded-full px-5 py-2.5 mb-6 shadow-lg shadow-[#7C5FF5]/30">
              <Users className="w-4 h-4" />
              <span className="text-sm font-semibold">About Career Forward</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Your Path to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA]">
                Employment
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're building the ultimate workforce development platform to help job seekers land their dream careers with AI-powered tools and real-time market insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Career Forward exists to transform the job search experience for everyone. We believe finding meaningful employment shouldn't be overwhelming, time-consuming, or confusing.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                By combining cutting-edge AI technology with real-time labor market data, we're creating a platform that empowers job seekers with the tools, insights, and guidance they need to succeed.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you're a recent graduate, career changer, or re-entering the workforce, Career Forward is here to move you forward.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7C5FF5]/20 to-[#A78BFA]/20 rounded-3xl blur-3xl" />
                <Image
                  src="/compass-ai.svg"
                  alt="Career Forward Mission"
                  width={500}
                  height={500}
                  className="relative z-10 w-full max-w-md mx-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-[#F3E8FF] to-white">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we build and every decision we make.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Job Seeker First",
                description: "Every feature is designed with our users' success in mind. Your career goals drive our product decisions.",
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "We leverage the latest AI and technology to make job searching smarter, faster, and more effective.",
              },
              {
                icon: Target,
                title: "Results-Driven",
                description: "We measure our success by yours. Getting you hired is our ultimate goal.",
              },
              {
                icon: Heart,
                title: "Accessibility",
                description: "Premium career tools should be accessible to everyone, not just those who can afford expensive services.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl border border-[#7C5FF5]/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Founder Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7C5FF5]/20 to-[#A78BFA]/20 rounded-3xl blur-3xl" />
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                  <Image
                    src="/founder-headshot.jpg"
                    alt="Maliek Martin - Founder"
                    width={600}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>

            {/* Founder Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA] text-white rounded-full px-5 py-2.5 mb-6 shadow-lg shadow-[#7C5FF5]/30">
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">Meet Our Founder</span>
              </div>

              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Maliek Martin
              </h2>
              <p className="text-xl text-[#7C5FF5] font-semibold mb-6">
                Founder & CEO
              </p>

              <p className="text-lg text-gray-600 italic mb-6 border-l-4 border-[#7C5FF5] pl-4">
                "Community-Driven | Operationally Focused"
              </p>

              <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                <p>
                  Maliek Martin is a workforce development expert and entrepreneur based in Spokane, Washington, with over 8 years of experience in Talent Acquisition, Business Development, and Team Management. Throughout his corporate and staffing recruiting career, he developed a deep understanding of both sides of the hiring equation, helping companies identify top talent while guiding job seekers through the overwhelming process of landing their ideal roles.
                </p>
                <p>
                  This dual perspective revealed a critical gap: while employers have access to sophisticated recruiting tools, job seekers navigate fragmented systems with outdated resources. Through his consulting firm, Martin Built Strategies, Maliek has helped numerous organizations optimize their operations and growth strategies, but his passion extends beyond business development into genuine workforce transformation.
                </p>
                <p>
                  Career Forward represents his vision to democratize access to premium career resources. By combining deep recruiting expertise with cutting-edge AI technology and real-time labor market insights powered by Lightcast, he is creating the comprehensive platform that levels the playing field and helps everyone find meaningful employment.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Button
                  asChild
                  className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-8 shadow-lg shadow-[#7C5FF5]/30"
                >
                  <Link href="/contact">
                    Connect with Maliek
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-br from-[#F3E8FF] to-white">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Our Story
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-gradient-to-br from-[#F3E8FF] to-white border border-[#7C5FF5]/20 rounded-3xl p-10">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Career Forward was born from a simple observation: job searching is broken. Despite countless job boards and career services, job seekers still struggle to organize their applications, optimize their resumes, and make informed career decisions.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We saw an opportunity to leverage AI and real-time labor market data to create something better—a comprehensive platform that brings together resume building, application tracking, interview preparation, and career coaching in one place.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Based in Spokane, Washington, we're starting with deep market intelligence for Washington State, with plans to expand nationwide. Our partnership with Lightcast gives us access to the most comprehensive labor market data available, helping job seekers make informed decisions about their careers.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're launching in Q2 2027 with early access for our waitlist members. Join us on this journey to transform how people find meaningful work.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA]">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Move Forward?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands on the waitlist for exclusive early access to Career Forward.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white hover:bg-white/90 text-[#7C5FF5] rounded-full px-12 h-14 text-lg font-semibold shadow-2xl hover:scale-105 transition-all"
            >
              <Link href="/waitlist">
                Join the Waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
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
