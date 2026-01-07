import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Compass,
  FileText,
  Video,
  Briefcase,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/career-quest-logo.png"
              alt="Career Quest"
              width={150}
              height={40}
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Your Career Journey{" "}
            <span className="text-primary">Starts Here</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Career Quest guides you through every step of your job search — from
            discovering your strengths to landing your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Start Your Quest
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Already have an account? Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Career Quest Helps You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Compass className="h-8 w-8 text-primary" />}
              title="Career Discovery"
              description="Explore your interests and skills with guided assessments to find your ideal career path."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-primary" />}
              title="Resume Builder"
              description="Create professional resumes with our easy-to-use builder and 10+ templates."
            />
            <FeatureCard
              icon={<Video className="h-8 w-8 text-primary" />}
              title="Interview Prep"
              description="Learn winning interview techniques from expert video workshops."
            />
            <FeatureCard
              icon={<Briefcase className="h-8 w-8 text-primary" />}
              title="Job Tracking"
              description="Keep organized with our built-in application tracker and job board."
            />
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Your 5-Step Career Quest
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Follow our proven pathway designed by workforce development
            professionals to help you succeed.
          </p>
          <div className="space-y-6">
            <StageCard
              number={1}
              title="Research & Discovery"
              description="Set career goals and explore your options through assessments and labor market research."
            />
            <StageCard
              number={2}
              title="Prepare for Success"
              description="Build your resume, craft cover letters, and develop your professional presence."
            />
            <StageCard
              number={3}
              title="Start Your Job Search"
              description="Access job boards, learn strategic search techniques, and track your applications."
            />
            <StageCard
              number={4}
              title="Ace the Interview"
              description="Master interview skills with expert training and practice techniques."
            />
            <StageCard
              number={5}
              title="Stay Connected"
              description="Continue growing and share your success with the workforce community."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Begin?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Join thousands of job seekers who have successfully navigated their
            career journey with Career Quest.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-brand text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/career-quest-logo.png"
                alt="Career Quest"
                width={120}
                height={32}
                className="brightness-0 invert mb-4"
              />
              <p className="text-white/70 text-sm">
                Empowering job seekers on their career journey.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  <Link href="/register" className="hover:text-white">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/signin" className="hover:text-white">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  <a
                    href="https://worksourcewa.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    WorkSource Washington
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Career Quest. A WorkSource
              Spokane Initiative.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background rounded-xl p-6 shadow-sm border">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function StageCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="flex-1 pb-6 border-b last:border-0">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
