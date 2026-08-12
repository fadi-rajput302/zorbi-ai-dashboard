import { motion } from "framer-motion";
import {
  MessageCircle,
  Plus,
  Share2,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GlassPanel, ScreenHeader } from "./common";
import { cn } from "@/lib/utils";

interface StudyGroup {
  id: number;
  name: string;
  subject: string;
  members: { initials: string; tint: string }[];
  materials: number;
}

const AVATAR_TINTS = [
  "bg-gradient-to-br from-indigo-400 to-violet-400",
  "bg-gradient-to-br from-emerald-400 to-teal-400",
  "bg-gradient-to-br from-orange-400 to-amber-400",
  "bg-gradient-to-br from-sky-400 to-cyan-400",
  "bg-gradient-to-br from-rose-400 to-pink-400",
  "bg-gradient-to-br from-violet-400 to-purple-400",
];

const DISCOVER = [
  { name: "Chemistry Aces", members: 12, subject: "Chemistry" },
  { name: "SAT Math Prep", members: 18, subject: "Mathematics" },
  { name: "English Lit Circle", members: 9, subject: "English" },
];

let groupCounter = 3;

export function StudyGroups() {
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: 1,
      name: "Calculus Crew",
      subject: "Mathematics",
      members: [
        { initials: "FS", tint: AVATAR_TINTS[0] },
        { initials: "AK", tint: AVATAR_TINTS[1] },
        { initials: "MJ", tint: AVATAR_TINTS[2] },
        { initials: "RS", tint: AVATAR_TINTS[3] },
      ],
      materials: 12,
    },
    {
      id: 2,
      name: "Physics Lab Partners",
      subject: "Physics",
      members: [
        { initials: "HT", tint: AVATAR_TINTS[4] },
        { initials: "NO", tint: AVATAR_TINTS[5] },
        { initials: "FA", tint: AVATAR_TINTS[0] },
      ],
      materials: 8,
    },
    {
      id: 3,
      name: "Bio Study Squad",
      subject: "Biology",
      members: [
        { initials: "ZM", tint: AVATAR_TINTS[1] },
        { initials: "LK", tint: AVATAR_TINTS[2] },
        { initials: "PB", tint: AVATAR_TINTS[3] },
        { initials: "QW", tint: AVATAR_TINTS[4] },
        { initials: "XZ", tint: AVATAR_TINTS[5] },
      ],
      materials: 15,
    },
  ]);
  const [joined, setJoined] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("General");

  const createGroup = () => {
    if (!newName.trim()) return;
    groupCounter += 1;
    const group: StudyGroup = {
      id: groupCounter,
      name: newName.trim(),
      subject: newSubject,
      members: [{ initials: "FA", tint: AVATAR_TINTS[0] }],
      materials: 0,
    };
    setGroups((prev) => [group, ...prev]);
    setNewName("");
    setNewSubject("General");
    setCreating(false);
    toast("Group created 🎉", {
      description: `${group.name} is ready — invite your classmates!`,
    });
  };

  const joinGroup = (name: string) => {
    if (joined.includes(name)) return;
    setJoined((prev) => [...prev, name]);
    toast("Joined group", { description: `Welcome to ${name}!` });
  };

  const openChat = (name: string) =>
    toast("Group chat", {
      description: `Opening ${name} chat — say hi to your group! 👋`,
    });

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Study Groups"
        subtitle="Learn together, share materials, and keep each other motivated."
        action={
          <button
            type="button"
            onClick={() => setCreating((c) => !c)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_-12px_rgba(99,102,241,0.7)] transition-all hover:-translate-y-px"
          >
            {creating ? <X className="size-4" /> : <Plus className="size-4" />}
            {creating ? "Cancel" : "Create group"}
          </button>
        }
      />

      {/* Create form */}
      {creating && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createGroup()}
              placeholder="Group name, e.g. Algebra Study Group"
              className="h-11 flex-1 rounded-full bg-white/90 px-5 text-sm text-slate-800 placeholder:text-slate-400 ring-1 ring-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
            />
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="h-11 rounded-full bg-white/90 px-4 text-sm text-slate-700 ring-1 ring-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-300/60"
            >
              {["General", "Mathematics", "Physics", "Chemistry", "English", "Biology"].map(
                (s) => (
                  <option key={s}>{s}</option>
                ),
              )}
            </select>
            <button
              type="button"
              onClick={createGroup}
              disabled={!newName.trim()}
              className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_-10px_rgba(99,102,241,0.7)] transition-all hover:-translate-y-px disabled:opacity-40"
            >
              <Plus className="size-4" />
              Create
            </button>
          </div>
        </motion.div>
      )}

      {/* My groups */}
      <div>
        <ScreenHeader
          title="My groups"
          subtitle={`${groups.length} active groups`}
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass group rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(28,40,92,0.04),0_24px_48px_-20px_rgba(79,108,240,0.32)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Users className="size-5" />
                </div>
                <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                  <Sparkles className="size-3" />
                  Active
                </span>
              </div>
              <h3 className="mt-4 text-[15px] font-bold text-slate-900">
                {group.name}
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {group.subject} · {group.materials} shared materials
              </p>

              {/* Member avatars */}
              <div className="mt-4 flex items-center">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 4).map((member) => (
                    <span
                      key={member.initials}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white",
                        member.tint,
                      )}
                    >
                      {member.initials}
                    </span>
                  ))}
                  {group.members.length > 4 && (
                    <span className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500 ring-2 ring-white">
                      +{group.members.length - 4}
                    </span>
                  )}
                </div>
                <span className="ml-2 text-[11px] text-slate-400">
                  {group.members.length} members
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => openChat(group.name)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                >
                  <MessageCircle className="size-3.5" />
                  Chat
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toast("Share materials", {
                      description: `Pick files to share with ${group.name}.`,
                    })
                  }
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/80 transition-all hover:text-indigo-600 hover:ring-indigo-200"
                >
                  <Share2 className="size-3.5" />
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Discover */}
      <div>
        <ScreenHeader
          title="Discover"
          subtitle="Join a group and find your study crew."
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {DISCOVER.map((group) => {
            const isJoined = joined.includes(group.name);
            return (
              <GlassPanel
                key={group.name}
                className="flex flex-col p-5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Users className="size-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                    {group.subject}
                  </span>
                </div>
                <h3 className="mt-3.5 text-[14px] font-bold text-slate-900">
                  {group.name}
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  {group.members} members
                </p>
                <button
                  type="button"
                  onClick={() => joinGroup(group.name)}
                  disabled={isJoined}
                  className={cn(
                    "mt-4 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-all",
                    isJoined
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_10px_22px_-10px_rgba(99,102,241,0.7)] hover:-translate-y-px",
                  )}
                >
                  <UserPlus className="size-3.5" />
                  {isJoined ? "Joined ✓" : "Join group"}
                </button>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
