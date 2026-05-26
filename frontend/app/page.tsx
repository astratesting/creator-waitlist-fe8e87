import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { ArrowRight, Star, Users, Bell, Zap } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Waitlists Created", value: "12,400+" },
  { label: "Signups Collected", value: "2.1M+" },
  { label: "Emails Delivered", value: "98.7%" },
  { label: "Creator Launches", value: "8,900+" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Course Creator",
    avatar: "PS",
    text: "I launched my photography course to 3,200 waitlist members on day one. CreatorWaitlist made it effortless to collect signups and fire off the launch email.",
    stars: 5,
  },
  {
    name: "Marcus Chen",
    role: "Newsletter Writer",
    avatar: "MC",
    text: "My paid newsletter launch had 900 subscribers waiting before I wrote a single issue. The referral tracking alone tripled my list.",
    stars: 5,
  },
  {
    name: "Aisha Okonkwo",
    role: "App Developer",
    avatar: "AO",
    text: "Building in public is so much easier when you have a real waitlist. Seeing 400+ people wait for your product is incredible motivation.",
    stars: 5,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-violet-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by creators worldwide
            </h2>
            <p className="text-violet-200 text-lg">
              Numbers that prove waitlists work
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-violet-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Live in 3 minutes flat
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              No developer needed. No complex setup. Just a link that collects
              your audience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Zap className="w-6 h-6" />,
                title: "Create your waitlist",
                desc: "Sign in, name your waitlist, customize the landing page. Takes 2 minutes.",
              },
              {
                step: "02",
                icon: <Users className="w-6 h-6" />,
                title: "Share your link",
                desc: "Post to Twitter, your bio, or embed on your site. Fans join with one click — no account needed.",
              },
              {
                step: "03",
                icon: <Bell className="w-6 h-6" />,
                title: "Launch with a blast",
                desc: "When you're ready, hit Send. Everyone on your list gets a beautiful notification instantly.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-4 left-8 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-6 mt-2">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Creators love CreatorWaitlist
            </h2>
            <p className="text-xl text-gray-500">
              Real results from real creators
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
              >
                <div className="flex mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your next launch starts with a waitlist
          </h2>
          <p className="text-xl text-violet-100 mb-10 max-w-2xl mx-auto">
            Stop guessing who&apos;s interested. Build your audience before you
            build your product.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-8 py-4 rounded-xl hover:bg-violet-50 transition-colors text-lg shadow-lg"
          >
            Start for free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-violet-200 text-sm mt-4">
            No credit card required · Free forever plan available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">CreatorWaitlist</span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} CreatorWaitlist. Built for creators.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
