import { auth, currentUser } from "@clerk/nextjs/server";
import {
  Users,
  ListChecks,
  Bell,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

const recentActivity = [
  {
    id: 1,
    type: "signup",
    waitlist: "Premium Course Launch",
    user: "alex@example.com",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "notification",
    waitlist: "Beta Access",
    user: "Sent to 234 subscribers",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "signup",
    waitlist: "Premium Course Launch",
    user: "maria@example.com",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "signup",
    waitlist: "Beta Access",
    user: "james@example.com",
    time: "5 hours ago",
  },
  {
    id: 5,
    type: "notification",
    waitlist: "Premium Course Launch",
    user: "Sent to 1,200 subscribers",
    time: "Yesterday",
  },
];

const waitlists = [
  {
    id: 1,
    name: "Premium Course Launch",
    subscribers: 1247,
    status: "active",
    growth: "+12%",
    lastNotified: "2 days ago",
  },
  {
    id: 2,
    name: "Beta Access Program",
    subscribers: 389,
    status: "active",
    growth: "+8%",
    lastNotified: "1 week ago",
  },
  {
    id: 3,
    name: "Exclusive Membership",
    subscribers: 82,
    status: "draft",
    growth: "+0%",
    lastNotified: "Never",
  },
];

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "Creator";

  const totalSubscribers = waitlists.reduce((s, w) => s + w.subscribers, 0);
  const activeWaitlists = waitlists.filter((w) => w.status === "active").length;

  const stats = [
    {
      label: "Total Subscribers",
      value: totalSubscribers.toLocaleString(),
      icon: Users,
      trend: "+18%",
      color: "violet",
    },
    {
      label: "Active Waitlists",
      value: activeWaitlists.toString(),
      icon: ListChecks,
      trend: "2 live",
      color: "blue",
    },
    {
      label: "Emails Sent",
      value: "3,412",
      icon: Bell,
      trend: "+24%",
      color: "green",
    },
    {
      label: "Avg. Open Rate",
      value: "61.4%",
      icon: TrendingUp,
      trend: "+3.2%",
      color: "pink",
    },
  ];

  const colorMap: Record<string, string> = {
    violet: "bg-violet-100 text-violet-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    pink: "bg-pink-100 text-pink-600",
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with your waitlists today.
          </p>
        </div>
        <Link
          href="/dashboard/waitlists/new"
          className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-lg hover:bg-violet-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          New Waitlist
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Waitlists table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Your Waitlists</h2>
            <Link
              href="/dashboard/waitlists"
              className="text-violet-600 text-sm font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {waitlists.map((w) => (
              <div
                key={w.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <ListChecks className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{w.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Last notified: {w.lastNotified}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {w.subscribers.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">subscribers</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {w.growth}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      w.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {w.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-gray-100">
            <Link
              href="/dashboard/waitlists/new"
              className="flex items-center gap-2 text-violet-600 text-sm font-medium hover:text-violet-700"
            >
              <Plus className="w-4 h-4" />
              Create new waitlist
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-4 space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === "signup"
                      ? "bg-green-100 text-green-600"
                      : "bg-violet-100 text-violet-600"
                  }`}
                >
                  {activity.type === "signup" ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {activity.user}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {activity.type === "signup" ? "Joined" : ""}{" "}
                    {activity.waitlist}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1">
              Ready to launch your next waitlist?
            </h3>
            <p className="text-violet-200 text-sm">
              Create a new waitlist and start collecting subscribers in minutes.
            </p>
          </div>
          <Link
            href="/dashboard/waitlists/new"
            className="flex-shrink-0 bg-white text-violet-700 font-medium px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors text-sm"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
