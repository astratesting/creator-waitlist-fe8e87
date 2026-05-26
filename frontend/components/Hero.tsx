"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, CheckCircle, Play } from "lucide-react";

const trustedBy = [
  "Course Creators",
  "Newsletter Writers",
  "App Developers",
  "Podcasters",
  "Community Builders",
];

export default function Hero() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-100/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-pink-100/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 text-sm text-violet-700 font-medium mb-8">
              <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              Now with AI-powered signups — launching soon
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
              Launch your next
              <br />
              <span className="gradient-text">big thing</span>
              <br />
              with a crowd ready
            </h1>

            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-lg">
              CreatorWaitlist lets you collect signups, build anticipation, and
              notify your audience the moment you&apos;re live — all in one
              place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex flex-1 max-w-sm bg-gray-100 rounded-xl p-1">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none"
                />
                <SignUpButton mode="modal" initialValues={{ emailAddress: email }}>
                  <button className="flex-shrink-0 bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-1.5">
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </SignUpButton>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-500">
              {[
                "Free plan forever — no credit card needed",
                "Up to 500 subscribers on the free tier",
                "Unlimited email notifications",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mock dashboard preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Mock browser bar */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-400 text-center">
                  app.creatorwaitlist.com/dashboard
                </div>
              </div>

              {/* Mock dashboard */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      My Waitlists
                    </div>
                    <div className="text-xs text-gray-500">
                      3 active waitlists
                    </div>
                  </div>
                  <div className="bg-violet-600 text-white text-xs px-3 py-1.5 rounded-lg">
                    + New Waitlist
                  </div>
                </div>

                {/* Mock stat cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Subscribers", value: "1,718" },
                    { label: "Emails Sent", value: "3,412" },
                    { label: "Open Rate", value: "61%" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-white rounded-xl p-3 border border-gray-100"
                    >
                      <div className="text-lg font-bold text-gray-900">
                        {s.value}
                      </div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mock waitlist rows */}
                {[
                  {
                    name: "Premium Course Launch",
                    count: "1,247",
                    status: "active",
                  },
                  { name: "Beta Access Program", count: "389", status: "active" },
                  {
                    name: "Exclusive Membership",
                    count: "82",
                    status: "draft",
                  },
                ].map((w) => (
                  <div
                    key={w.name}
                    className="bg-white rounded-xl p-3 border border-gray-100 mb-2 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {w.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {w.count} subscribers
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        w.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating notification */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-900">
                  Email blast sent!
                </div>
                <div className="text-xs text-gray-400">
                  1,247 subscribers notified
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider">
            Built for
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {trustedBy.map((category) => (
              <span
                key={category}
                className="text-gray-500 font-medium text-sm bg-gray-100 px-4 py-2 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
