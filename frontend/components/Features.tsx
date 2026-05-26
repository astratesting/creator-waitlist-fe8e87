import {
  ListChecks,
  Bell,
  BarChart3,
  Share2,
  Shield,
  Zap,
  Users,
  Palette,
} from "lucide-react";

const features = [
  {
    icon: ListChecks,
    title: "Unlimited Waitlists",
    description:
      "Create as many waitlists as you need. Course launches, product betas, newsletter editions — manage them all from one dashboard.",
    color: "violet",
  },
  {
    icon: Bell,
    title: "One-Click Email Blasts",
    description:
      "When you're ready to launch, hit send. Beautiful, branded emails go out instantly to every subscriber on your list.",
    color: "blue",
  },
  {
    icon: Users,
    title: "Referral Tracking",
    description:
      "Reward your biggest fans. Every subscriber gets a unique link — track who's sending you the most signups and give them priority access.",
    color: "green",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Watch signups roll in live. See open rates, click rates, and referral stats so you know what's working before you launch.",
    color: "pink",
  },
  {
    icon: Share2,
    title: "Embeddable Signup Forms",
    description:
      "Drop a single line of code anywhere — your website, Notion page, or blog — and start collecting emails immediately.",
    color: "orange",
  },
  {
    icon: Shield,
    title: "Clerk-Powered Auth",
    description:
      "Enterprise-grade authentication out of the box. Sign in with Google, GitHub, or email. Your data stays secure.",
    color: "red",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    description:
      "Your waitlist, your brand. Upload your logo, pick your colors, and write your own copy. No CreatorWaitlist watermark.",
    color: "indigo",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description:
      "Supabase Realtime keeps your dashboard live. See new signups the moment they happen — no page refresh needed.",
    color: "yellow",
  },
];

const colorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    border: "group-hover:border-violet-200",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "group-hover:border-blue-200",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    border: "group-hover:border-green-200",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    border: "group-hover:border-pink-200",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    border: "group-hover:border-orange-200",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
    border: "group-hover:border-red-200",
  },
  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    border: "group-hover:border-indigo-200",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    border: "group-hover:border-yellow-200",
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4">
            Everything you need
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Built for creators who ship
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Every tool you need to go from idea to launch — with your audience
            already waiting.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const colors = colorMap[feature.color];
            return (
              <div
                key={feature.title}
                className={`group p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200 ${colors.border}`}
              >
                <div
                  className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-5`}
                >
                  <feature.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tech stack callout */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Built on infrastructure you can trust
            </h3>
            <p className="text-gray-500">
              CreatorWaitlist runs on battle-tested tech — fast, secure, and
              scalable.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                name: "Next.js 14",
                desc: "App Router + Server Components",
              },
              { name: "Clerk Auth", desc: "Secure authentication" },
              { name: "Supabase", desc: "Postgres + Realtime" },
              { name: "Vercel", desc: "Edge-deployed globally" },
            ].map((tech) => (
              <div key={tech.name} className="text-center">
                <div className="font-bold text-gray-900 text-sm">
                  {tech.name}
                </div>
                <div className="text-gray-500 text-xs mt-0.5">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
