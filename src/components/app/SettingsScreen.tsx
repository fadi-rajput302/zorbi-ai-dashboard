import { motion } from "framer-motion";
import {
  Bell,
  Check,
  Crown,
  Globe,
  KeyRound,
  Languages,
  Lock,
  Mail,
  Monitor,
  Palette,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GlassPanel, ScreenHeader } from "./common";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/60 px-4 py-3.5 ring-1 ring-white/80">
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold text-slate-800">{title}</div>
        <div className="mt-0.5 text-xs text-slate-400">{description}</div>
      </div>
      {control}
    </div>
  );
}

function SwitchControl({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <Switch
      checked={on}
      onCheckedChange={setOn}
      className="shrink-0 data-[state=checked]:bg-indigo-500"
    />
  );
}

const PREMIUM_FEATURES = [
  "Unlimited uploads & storage",
  "AI Tutor available 24/7",
  "Advanced quiz analytics",
  "Priority support",
];

export function SettingsScreen() {
  const [name, setName] = useState("Fahad");
  const [email, setEmail] = useState("fahad@student.com");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Light");

  const saveProfile = () =>
    toast("Profile saved", { description: "Your changes are up to date." });

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Settings"
        subtitle="Manage your account, preferences and subscription."
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="glass h-auto w-full flex-wrap justify-start gap-1 rounded-2xl p-2">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "account", label: "Account", icon: KeyRound },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "appearance", label: "Appearance", icon: Palette },
            { id: "language", label: "Language", icon: Languages },
            { id: "privacy", label: "Privacy", icon: Shield },
            { id: "subscription", label: "Subscription", icon: Crown },
          ].map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-[0_8px_18px_-8px_rgba(99,102,241,0.6)]"
            >
              <Icon className="size-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile">
            <GlassPanel className="max-w-2xl p-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 ring-2 ring-white shadow-[0_10px_24px_-12px_rgba(99,102,241,0.6)]">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-violet-400 text-xl font-bold text-white">
                    {name.charAt(0)?.toUpperCase() ?? "F"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-base font-bold text-slate-900">{name}</div>
                  <div className="text-xs text-slate-400">Student · Level 7</div>
                  <button
                    type="button"
                    onClick={() =>
                      toast("Upload photo", {
                        description: "Photo upload is coming soon.",
                      })
                    }
                    className="mt-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-600 ring-1 ring-slate-200/80 transition-all hover:ring-indigo-200"
                  >
                    Change photo
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Full name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border-white/80 bg-white/80 shadow-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Email
                  </label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="rounded-xl border-white/80 bg-white/80 shadow-sm"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Role
                  </label>
                  <div className="flex h-10 items-center rounded-xl bg-slate-100 px-3.5 text-sm text-slate-500">
                    Student
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    School
                  </label>
                  <Input
                    defaultValue="Sunrise High School"
                    className="rounded-xl border-white/80 bg-white/80 shadow-sm"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={saveProfile}
                className="mt-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(99,102,241,0.7)] transition-all hover:-translate-y-px"
              >
                Save changes
              </button>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="account">
            <GlassPanel className="max-w-2xl space-y-4 p-6">
              <SettingRow
                title="Email address"
                description="Used for sign-in and notifications"
                control={
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail className="size-4 text-slate-300" />
                    {email}
                  </div>
                }
              />
              <SettingRow
                title="Change password"
                description="Use a strong, unique password"
                control={
                  <button
                    type="button"
                    onClick={() =>
                      toast("Password reset", {
                        description: "We've emailed you a reset link.",
                      })
                    }
                    className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-indigo-600 ring-1 ring-slate-200/80 transition-all hover:ring-indigo-200"
                  >
                    Reset password
                  </button>
                }
              />
              <SettingRow
                title="Two-factor authentication"
                description="Extra security for your account"
                control={<SwitchControl defaultOn />}
              />
              <div className="rounded-2xl bg-rose-50/70 px-4 py-3.5 ring-1 ring-rose-100/80">
                <div className="text-[13.5px] font-semibold text-rose-600">
                  Danger zone
                </div>
                <p className="mt-0.5 text-xs text-rose-400">
                  Deleting your account removes all materials and progress.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    toast("Delete account", {
                      description: "This is disabled in the demo.",
                    })
                  }
                  className="mt-3 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-rose-500 ring-1 ring-rose-200 transition-all hover:bg-rose-50"
                >
                  Delete account
                </button>
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="notifications">
            <GlassPanel className="max-w-2xl space-y-4 p-6">
              <SettingRow
                title="Daily study reminders"
                description="A gentle nudge to keep your streak alive"
                control={<SwitchControl defaultOn />}
              />
              <SettingRow
                title="Quiz & assignment alerts"
                description="When quizzes open or deadlines approach"
                control={<SwitchControl defaultOn />}
              />
              <SettingRow
                title="Streak notifications"
                description="Celebrate milestones and warn before a break"
                control={<SwitchControl defaultOn />}
              />
              <SettingRow
                title="Study group activity"
                description="New messages, shares and members"
                control={<SwitchControl defaultOn />}
              />
              <SettingRow
                title="Weekly progress email"
                description="A summary every Sunday evening"
                control={<SwitchControl />}
              />
            </GlassPanel>
          </TabsContent>

          <TabsContent value="appearance">
            <GlassPanel className="max-w-2xl p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { id: "Light", icon: Monitor, hint: "Bright & clean" },
                  { id: "Dark", icon: Palette, hint: "Coming soon" },
                  { id: "System", icon: Monitor, hint: "Follow device" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      if (option.id === "Dark") {
                        toast("Dark mode", {
                          description: "Coming soon — light glass stays for now.",
                        });
                        return;
                      }
                      setTheme(option.id);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl p-5 text-center transition-all",
                      theme === option.id
                        ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_14px_28px_-14px_rgba(99,102,241,0.8)]"
                        : "bg-white/80 text-slate-600 ring-1 ring-slate-200/80 hover:ring-indigo-200",
                    )}
                  >
                    <option.icon className="size-5" />
                    <span className="text-xs font-bold">{option.id}</span>
                    <span
                      className={cn(
                        "text-[10px]",
                        theme === option.id ? "text-white/70" : "text-slate-400",
                      )}
                    >
                      {option.hint}
                    </span>
                  </button>
                ))}
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="language">
            <GlassPanel className="max-w-2xl space-y-4 p-6">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/60 px-4 py-3.5 ring-1 ring-white/80">
                <div>
                  <div className="text-[13.5px] font-semibold text-slate-800">
                    App language
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    Zorbi can also tutor in this language
                  </div>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40 rounded-full border-white/80 bg-white/80 shadow-sm">
                    <Globe className="size-4 text-slate-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["English", "العربية", "اردو", "Español", "Français"].map(
                      (lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <SettingRow
                title="Auto-translate materials"
                description="Translate uploads into your app language"
                control={<SwitchControl />}
              />
            </GlassPanel>
          </TabsContent>

          <TabsContent value="privacy">
            <GlassPanel className="max-w-2xl space-y-4 p-6">
              <SettingRow
                title="Profile visibility"
                description="Allow classmates to find you in groups"
                control={<SwitchControl defaultOn />}
              />
              <SettingRow
                title="Leaderboard participation"
                description="Show your points and streak publicly"
                control={<SwitchControl defaultOn />}
              />
              <SettingRow
                title="Share quiz results"
                description="Let your study group see your scores"
                control={<SwitchControl />}
              />
              <SettingRow
                title="Anonymous analytics"
                description="Help improve Zorbi with usage data"
                control={<SwitchControl defaultOn />}
              />
              <div className="flex items-center gap-2 rounded-2xl bg-indigo-50/70 px-4 py-3 ring-1 ring-indigo-100/80">
                <Lock className="size-4 shrink-0 text-indigo-500" />
                <p className="text-xs leading-relaxed text-slate-500">
                  Your materials and chat history are encrypted and never shared
                  with other students.
                </p>
              </div>
            </GlassPanel>
          </TabsContent>

          <TabsContent value="subscription">
            <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
              <GlassPanel className="p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current plan
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  Free — Student
                </div>
                <ul className="mt-5 space-y-2.5">
                  {[
                    "10 uploads per month",
                    "AI Tutor · 20 messages / day",
                    "Basic quiz analytics",
                    "Community support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-[13px] text-slate-600">
                      <Check className="size-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </GlassPanel>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-violet-400 p-6 text-white shadow-[0_32px_64px_-28px_rgba(99,102,241,0.7)]"
              >
                <div className="pointer-events-none absolute -right-10 -top-14 size-44 rounded-full bg-white/15 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <Crown className="size-5 text-amber-200" />
                    <span className="text-sm font-bold">Go Premium</span>
                  </div>
                  <div className="mt-3 text-3xl font-bold tracking-tight">
                    $6<span className="text-base font-semibold text-white/70">/mo</span>
                  </div>
                  <ul className="mt-5 space-y-2.5">
                    {PREMIUM_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-[13px] text-indigo-50">
                        <Sparkles className="size-4 shrink-0 text-amber-200" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() =>
                      toast("Upgrade to Pro", {
                        description: "Checkout is coming soon — we'll wire up Stripe!",
                      })
                    }
                    className="mt-6 w-full rounded-full bg-white py-3 text-sm font-bold text-indigo-600 shadow-lg transition-all hover:-translate-y-px hover:shadow-xl"
                  >
                    Upgrade Now
                  </button>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
