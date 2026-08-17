import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { getCurrentUser } from "./users";
import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

async function requireUser(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);
  if (user === null) throw new Error("You must be signed in to do that.");
  return user._id;
}

async function getMember(
  ctx: QueryCtx | MutationCtx,
  groupId: string,
  userId: string,
) {
  return await ctx.db
    .query("studyGroupMembers")
    .withIndex("by_group", (q) => q.eq("groupId", groupId as any))
    .filter((q) =>
      q.and(q.eq(q.field("userId"), userId), q.eq(q.field("status"), "active")),
    )
    .first();
}

async function getMemberAnyStatus(
  ctx: QueryCtx | MutationCtx,
  groupId: string,
  userId: string,
) {
  return await ctx.db
    .query("studyGroupMembers")
    .withIndex("by_group", (q) => q.eq("groupId", groupId as any))
    .filter((q) => q.eq(q.field("userId"), userId))
    .first();
}

async function getActiveMemberCount(ctx: QueryCtx | MutationCtx, groupId: string) {
  const members = await ctx.db
    .query("studyGroupMembers")
    .withIndex("by_group_status", (q) =>
      q.eq("groupId", groupId as any).eq("status", "active"),
    )
    .collect();
  return members.length;
}

async function getActiveMembers(ctx: QueryCtx | MutationCtx, groupId: string) {
  return await ctx.db
    .query("studyGroupMembers")
    .withIndex("by_group_status", (q) =>
      q.eq("groupId", groupId as any).eq("status", "active"),
    )
    .collect();
}

async function getUserName(ctx: QueryCtx | MutationCtx, userId: string) {
  const user = await ctx.db.get(userId as any);
  return user?.name ?? "Student";
}

const randomCode = () =>
  Array.from({ length: 6 }, () =>
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".charAt(
      Math.floor(Math.random() * 32),
    ),
  ).join("");

type NotifyArgs = {
  type: string;
  title: string;
  body: string;
  groupId?: string;
  messageId?: string;
  materialId?: string;
  actorId?: string;
};

/** Insert a notification unless the user has disabled that category. */
async function notify(ctx: MutationCtx, userId: string, args: NotifyArgs) {
  const settings = await ctx.db
    .query("notificationSettings")
    .withIndex("by_user", (q) => q.eq("userId", userId as any))
    .first();

  const enabled =
    settings === null ||
    (args.type === "group_message" && settings.groupMessages) ||
    (args.type === "mention" && settings.mentions) ||
    (args.type === "reply" && settings.replies) ||
    (args.type === "reaction" && settings.reactions) ||
    (args.type === "material" && settings.sharedMaterials) ||
    (args.type === "invite" && settings.groupInvitations) ||
    (["join_approved", "join_rejected", "removed", "promoted", "join_request"].includes(args.type) &&
      settings.joinRequestUpdates) ||
    (args.type === "announcement" && settings.announcements) ||
    (args.type === "event" && settings.studyEvents);

  if (!enabled) return;

  await ctx.db.insert("notifications", {
    userId: userId as any,
    type: args.type,
    title: args.title,
    body: args.body,
    groupId: args.groupId ? (args.groupId as any) : undefined,
    messageId: args.messageId ? (args.messageId as any) : undefined,
    materialId: args.materialId ? (args.materialId as any) : undefined,
    actorId: args.actorId ? (args.actorId as any) : undefined,
    read: false,
    createdAt: Date.now(),
  });
}

async function notifyActiveMembers(
  ctx: MutationCtx,
  groupId: string,
  args: NotifyArgs,
  opts?: { skipMuted?: boolean },
) {
  const members = await getActiveMembers(ctx, groupId);
  for (const member of members) {
    if (opts?.skipMuted && member.muted) continue;
    await notify(ctx, member.userId, { ...args, groupId });
  }
}

const DEFAULT_NOTIF_SETTINGS = {
  pushEnabled: true,
  emailEnabled: true,
  groupMessages: true,
  mentions: true,
  replies: true,
  reactions: true,
  sharedMaterials: true,
  groupInvitations: true,
  joinRequestUpdates: true,
  announcements: true,
  studyEvents: true,
};

/* ------------------------------------------------------------------ */
/*  Queries                                                           */
/* ------------------------------------------------------------------ */

export const listMyGroups = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const memberships = await ctx.db
      .query("studyGroupMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId as any))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const result = [];
    for (const member of memberships) {
      const group = await ctx.db.get(member.groupId);
      if (!group) continue;
      const memberCount = await getActiveMemberCount(ctx, group._id);
      const latest = await ctx.db
        .query("studyGroupMessages")
        .withIndex("by_group", (q) => q.eq("groupId", group._id))
        .order("desc")
        .first();
      const unread = latest && latest.createdAt > member.lastReadAt ? 1 : 0;
      result.push({
        group,
        role: member.role,
        muted: member.muted ?? false,
        memberCount,
        unread,
        lastActivityAt: group.lastActivityAt,
        lastMessagePreview:
          latest && latest.createdAt > member.lastReadAt
            ? latest.text.slice(0, 60)
            : undefined,
      });
    }
    result.sort((a, b) => b.lastActivityAt - a.lastActivityAt);
    return result;
  },
});

export const listDiscoverGroups = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const allGroups = await ctx.db.query("studyGroups").collect();
    const result = [];
    for (const group of allGroups) {
      if (group.type !== "public") continue;
      const member = await getMember(ctx, group._id, userId);
      if (member) continue;
      const memberCount = await getActiveMemberCount(ctx, group._id);
      const creator = await ctx.db.get(group.creatorId);
      result.push({
        group,
        memberCount,
        creatorName: creator?.name ?? "Zorbi student",
      });
    }
    result.sort(
      (a, b) =>
        b.group.lastActivityAt - a.group.lastActivityAt ||
        b.memberCount - a.memberCount,
    );
    return result;
  },
});

export const getGroup = query({
  args: { groupId: v.id("studyGroups") },
  handler: async (ctx, { groupId }) => {
    const userId = await requireUser(ctx);
    const group = await ctx.db.get(groupId);
    if (!group) return null;
    const member = await getMember(ctx, groupId, userId);
    if (!member) {
      const pending = await getMemberAnyStatus(ctx, groupId, userId);
      return { group, membership: pending ?? null };
    }
    const memberCount = await getActiveMemberCount(ctx, groupId);
    const onlineCount = (
      await getActiveMembers(ctx, groupId)
    ).filter((m) => m.online).length;
    const creator = await ctx.db.get(group.creatorId);
    const pendingRequests =
      member.role === "admin"
        ? await ctx.db
            .query("studyGroupMembers")
            .withIndex("by_group_status", (q) =>
              q.eq("groupId", groupId as any).eq("status", "pending"),
            )
            .collect()
        : [];
    return {
      group,
      membership: member,
      memberCount,
      onlineCount,
      creatorName: creator?.name ?? "Zorbi student",
      pendingRequests,
    };
  },
});

export const getGroupByCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const userId = await requireUser(ctx);
    const group = await ctx.db
      .query("studyGroups")
      .withIndex("by_inviteCode", (q) => q.eq("inviteCode", code.trim().toUpperCase()))
      .first();
    if (!group) return null;
    const member = await getMember(ctx, group._id, userId);
    const memberCount = await getActiveMemberCount(ctx, group._id);
    const creator = await ctx.db.get(group.creatorId);
    return {
      group,
      memberCount,
      creatorName: creator?.name ?? "Zorbi student",
      alreadyJoined: Boolean(member),
      pending: (await getMemberAnyStatus(ctx, group._id, userId))?.status === "pending",
    };
  },
});

export const listMembers = query({
  args: { groupId: v.id("studyGroups") },
  handler: async (ctx, { groupId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member) return [];
    const members = await getActiveMembers(ctx, groupId);
    const result = [];
    for (const m of members) {
      const user = await ctx.db.get(m.userId);
      result.push({
        userId: m.userId,
        name: user?.name ?? "Student",
        role: m.role,
        online: m.online ?? false,
        joinedAt: m.joinedAt,
      });
    }
    const order = { admin: 0, moderator: 1, member: 2 } as const;
    result.sort((a, b) => order[a.role] - order[b.role]);
    return result;
  },
});

export const listPendingRequests = query({
  args: { groupId: v.id("studyGroups") },
  handler: async (ctx, { groupId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member || member.role !== "admin") return [];
    const pending = await ctx.db
      .query("studyGroupMembers")
      .withIndex("by_group_status", (q) =>
        q.eq("groupId", groupId as any).eq("status", "pending"),
      )
      .collect();
    const result = [];
    for (const p of pending) {
      const user = await ctx.db.get(p.userId);
      result.push({ userId: p.userId, name: user?.name ?? "Student", joinedAt: p.joinedAt });
    }
    return result;
  },
});

export const listMessages = query({
  args: { groupId: v.id("studyGroups") },
  handler: async (ctx, { groupId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member) return [];
    const messages = await ctx.db
      .query("studyGroupMessages")
      .withIndex("by_group", (q) => q.eq("groupId", groupId as any))
      .order("desc")
      .take(200);
    const result = [];
    const nameCache = new Map<string, string>();
    for (const msg of messages.reverse()) {
      let name = nameCache.get(msg.authorId);
      if (!name) {
        const user = await ctx.db.get(msg.authorId);
        name = user?.name ?? "Student";
        nameCache.set(msg.authorId, name);
      }
      let replyPreview: string | undefined;
      if (msg.replyTo) {
        const reply = await ctx.db.get(msg.replyTo);
        if (reply) {
          const replyAuthor =
            nameCache.get(reply.authorId) ??
            (await ctx.db.get(reply.authorId))?.name ??
            "Student";
          replyPreview = `${replyAuthor}: ${reply.text.slice(0, 80)}`;
        }
      }
      result.push({
        ...msg,
        authorName: name,
        replyPreview,
        mine: msg.authorId === userId,
      });
    }
    return result;
  },
});

export const listMaterials = query({
  args: { groupId: v.id("studyGroups") },
  handler: async (ctx, { groupId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member) return [];
    const materials = await ctx.db
      .query("studyGroupMaterials")
      .withIndex("by_group", (q) => q.eq("groupId", groupId as any))
      .order("desc")
      .collect();
    const result = [];
    for (const material of materials) {
      const uploader = await ctx.db.get(material.uploaderId);
      result.push({
        ...material,
        uploaderName: uploader?.name ?? "Student",
        mine: material.uploaderId === userId,
      });
    }
    return result;
  },
});

export const listEvents = query({
  args: { groupId: v.id("studyGroups") },
  handler: async (ctx, { groupId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member) return [];
    const events = await ctx.db
      .query("studyGroupEvents")
      .withIndex("by_group", (q) => q.eq("groupId", groupId as any))
      .collect();
    const result = [];
    for (const event of events) {
      const creator = await ctx.db.get(event.creatorId);
      result.push({
        ...event,
        creatorName: creator?.name ?? "Student",
        attending: event.attendees.includes(userId as any),
        attendeeCount: event.attendees.length,
      });
    }
    result.sort((a, b) => a.createdAt - b.createdAt);
    return result;
  },
});

export const listNotifications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId as any))
      .order("desc")
      .take(50);
    const result = [];
    for (const notification of notifications) {
      let groupName: string | undefined;
      if (notification.groupId) {
        groupName = (await ctx.db.get(notification.groupId))?.name;
      }
      let actorName: string | undefined;
      if (notification.actorId) {
        actorName = (await ctx.db.get(notification.actorId))?.name;
      }
      result.push({ ...notification, groupName, actorName });
    }
    return result;
  },
});

export const unreadNotificationsCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", userId as any).eq("read", false),
      )
      .collect();
    return unread.length;
  },
});

export const getNotificationSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const settings = await ctx.db
      .query("notificationSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId as any))
      .first();
    return settings ?? { userId: userId as any, ...DEFAULT_NOTIF_SETTINGS };
  },
});

/* ------------------------------------------------------------------ */
/*  Groups                                                            */
/* ------------------------------------------------------------------ */

export const createGroup = mutation({
  args: {
    name: v.string(),
    subject: v.string(),
    description: v.string(),
    type: v.union(v.literal("public"), v.literal("private")),
    maxMembers: v.number(),
    rules: v.optional(v.string()),
    icon: v.string(),
    tint: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const now = Date.now();
    const groupId = await ctx.db.insert("studyGroups", {
      name: args.name.trim(),
      subject: args.subject,
      description: args.description.trim(),
      type: args.type,
      maxMembers: Math.max(2, Math.min(500, args.maxMembers)),
      rules: args.rules?.trim() || undefined,
      creatorId: userId as any,
      icon: args.icon || "📚",
      tint: args.tint || "indigo",
      inviteCode: randomCode(),
      lastActivityAt: now,
      createdAt: now,
    });
    await ctx.db.insert("studyGroupMembers", {
      groupId: groupId as any,
      userId: userId as any,
      role: "admin",
      status: "active",
      joinedAt: now,
      lastReadAt: now,
    });
    return groupId;
  },
});

export const updateGroup = mutation({
  args: {
    groupId: v.id("studyGroups"),
    name: v.string(),
    subject: v.string(),
    description: v.string(),
    type: v.union(v.literal("public"), v.literal("private")),
    maxMembers: v.number(),
    rules: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, args.groupId, userId);
    if (!member || member.role !== "admin")
      throw new Error("Only group admins can edit group settings.");
    await ctx.db.patch(args.groupId, {
      name: args.name.trim(),
      subject: args.subject,
      description: args.description.trim(),
      type: args.type,
      maxMembers: Math.max(2, Math.min(500, args.maxMembers)),
      rules: args.rules?.trim() || undefined,
    });
  },
});

export const joinGroup = mutation({
  args: { groupId: v.id("studyGroups") },
  handler: async (ctx, { groupId }) => {
    const userId = await requireUser(ctx);
    const group = await ctx.db.get(groupId);
    if (!group) throw new Error("That group no longer exists.");
    const existing = await getMemberAnyStatus(ctx, groupId, userId);
    if (existing) {
      if (existing.status === "pending") return { status: "pending" };
      return { status: "already" };
    }
    const now = Date.now();
    if (group.type === "public") {
      const count = await getActiveMemberCount(ctx, groupId);
      if (count >= group.maxMembers) throw new Error("This group is full.");
      await ctx.db.insert("studyGroupMembers", {
        groupId: groupId as any,
        userId: userId as any,
        role: "member",
        status: "active",
        joinedAt: now,
        lastReadAt: now,
      });
      return { status: "joined" };
    }
    await ctx.db.insert("studyGroupMembers", {
      groupId: groupId as any,
      userId: userId as any,
      role: "member",
      status: "pending",
      joinedAt: now,
      lastReadAt: now,
    });
    // Ask admins to approve
    const admins = (
      await getActiveMembers(ctx, groupId)
    ).filter((m) => m.role === "admin");
    for (const admin of admins) {
      await notify(ctx, admin.userId, {
        type: "join_request",
        title: "Join request",
        body: "A student asked to join your group.",
        groupId,
        actorId: userId,
      });
    }
    return { status: "pending" };
  },
});

export const joinGroupByCode = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const userId = await requireUser(ctx);
    const group = await ctx.db
      .query("studyGroups")
      .withIndex("by_inviteCode", (q) => q.eq("inviteCode", code.trim().toUpperCase()))
      .first();
    if (!group) throw new Error("No group found with that code.");
    const existing = await getMemberAnyStatus(ctx, group._id, userId);
    if (existing) {
      if (existing.status === "pending") return { groupId: group._id, status: "pending" };
      return { groupId: group._id, status: "already" };
    }
    const now = Date.now();
    if (group.type === "public") {
      const count = await getActiveMemberCount(ctx, group._id);
      if (count >= group.maxMembers) throw new Error("This group is full.");
      await ctx.db.insert("studyGroupMembers", {
        groupId: group._id as any,
        userId: userId as any,
        role: "member",
        status: "active",
        joinedAt: now,
        lastReadAt: now,
      });
      return { groupId: group._id, status: "joined" };
    }
    await ctx.db.insert("studyGroupMembers", {
      groupId: group._id as any,
      userId: userId as any,
      role: "member",
      status: "pending",
      joinedAt: now,
      lastReadAt: now,
    });
    const admins = (await getActiveMembers(ctx, group._id)).filter(
      (m) => m.role === "admin",
    );
    for (const admin of admins) {
      await notify(ctx, admin.userId, {
        type: "join_request",
        title: "Join request",
        body: "A student asked to join your group.",
        groupId: group._id,
        actorId: userId,
      });
    }
    return { groupId: group._id, status: "pending" };
  },
});

export const leaveGroup = mutation({
  args: { groupId: v.id("studyGroups") },
  handler: async (ctx, { groupId }) => {
    const userId = await requireUser(ctx);
    const member = await getMemberAnyStatus(ctx, groupId, userId);
    if (!member) return;
    await ctx.db.delete(member._id);
  },
});

export const approveJoinRequest = mutation({
  args: { groupId: v.id("studyGroups"), targetUserId: v.id("users") },
  handler: async (ctx, { groupId, targetUserId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member || member.role !== "admin")
      throw new Error("Only group admins can approve requests.");
    const pending = await getMemberAnyStatus(ctx, groupId, targetUserId);
    if (!pending) throw new Error("That request no longer exists.");
    await ctx.db.patch(pending._id, { status: "active" });
    await notify(ctx, targetUserId, {
      type: "join_approved",
      title: "Request approved 🎉",
      body: "Your request to join the group was approved.",
      groupId,
      actorId: userId,
    });
  },
});

export const rejectJoinRequest = mutation({
  args: { groupId: v.id("studyGroups"), targetUserId: v.id("users") },
  handler: async (ctx, { groupId, targetUserId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member || member.role !== "admin")
      throw new Error("Only group admins can reject requests.");
    const pending = await getMemberAnyStatus(ctx, groupId, targetUserId);
    if (!pending) throw new Error("That request no longer exists.");
    await ctx.db.delete(pending._id);
    await notify(ctx, targetUserId, {
      type: "join_rejected",
      title: "Request declined",
      body: "Your request to join the group was declined.",
      groupId,
      actorId: userId,
    });
  },
});

export const updateMemberRole = mutation({
  args: {
    groupId: v.id("studyGroups"),
    targetUserId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("moderator"), v.literal("member")),
  },
  handler: async (ctx, { groupId, targetUserId, role }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member || member.role !== "admin")
      throw new Error("Only group admins can change roles.");
    if (targetUserId === userId) throw new Error("You can't change your own role.");
    const target = await getMember(ctx, groupId, targetUserId);
    if (!target) throw new Error("That member is not in the group.");
    await ctx.db.patch(target._id, { role });
    if (role === "moderator") {
      await notify(ctx, targetUserId, {
        type: "promoted",
        title: "You're now a moderator ⭐",
        body: "You can pin messages and help keep the group tidy.",
        groupId,
        actorId: userId,
      });
    }
  },
});

export const removeMember = mutation({
  args: { groupId: v.id("studyGroups"), targetUserId: v.id("users") },
  handler: async (ctx, { groupId, targetUserId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member || member.role !== "admin")
      throw new Error("Only group admins can remove members.");
    if (targetUserId === userId) throw new Error("Use Leave group instead.");
    const target = await getMember(ctx, groupId, targetUserId);
    if (!target) return;
    await ctx.db.delete(target._id);
    await notify(ctx, targetUserId, {
      type: "removed",
      title: "Removed from group",
      body: "You were removed from the group by an admin.",
      groupId,
      actorId: userId,
    });
  },
});

export const toggleGroupMute = mutation({
  args: { groupId: v.id("studyGroups") },
  handler: async (ctx, { groupId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member) throw new Error("You're not a member of this group.");
    await ctx.db.patch(member._id, { muted: !(member.muted ?? false) });
    return !(member.muted ?? false);
  },
});

export const markGroupRead = mutation({
  args: { groupId: v.id("studyGroups") },
  handler: async (ctx, { groupId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member) return;
    await ctx.db.patch(member._id, { lastReadAt: Date.now() });
  },
});

/* ------------------------------------------------------------------ */
/*  Chat                                                              */
/* ------------------------------------------------------------------ */

export const sendMessage = mutation({
  args: {
    groupId: v.id("studyGroups"),
    text: v.string(),
    replyTo: v.optional(v.id("studyGroupMessages")),
    mentions: v.optional(v.array(v.id("users"))),
  },
  handler: async (ctx, { groupId, text, replyTo, mentions }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member) throw new Error("You're not a member of this group.");
    if (!text.trim()) throw new Error("Message can't be empty.");
    const now = Date.now();
    const messageId = await ctx.db.insert("studyGroupMessages", {
      groupId: groupId as any,
      authorId: userId as any,
      text: text.trim(),
      replyTo: replyTo as any,
      reactions: [],
      pinned: false,
      mentions: (mentions ?? []) as any,
      createdAt: now,
    });
    await ctx.db.patch(groupId, { lastActivityAt: now });

    const members = await getActiveMembers(ctx, groupId);
    const myName = await getUserName(ctx, userId);
    const body = text.slice(0, 80);
    for (const m of members) {
      if (m.userId === userId) continue;
      if (m.muted) continue;
      const isMentioned = mentions?.includes(m.userId as any);
      const isReply = replyTo !== undefined;
      if (isMentioned) {
        await notify(ctx, m.userId, {
          type: "mention",
          title: "Mention",
          body: `${myName} mentioned you: "${body}"`,
          groupId,
          messageId: messageId as any,
          actorId: userId,
        });
      } else if (isReply) {
        const replyMsg = replyTo ? await ctx.db.get(replyTo) : null;
        if (replyMsg?.authorId === m.userId) {
          await notify(ctx, m.userId, {
            type: "reply",
            title: "Reply",
            body: `${myName} replied: "${body}"`,
            groupId,
            messageId: messageId as any,
            actorId: userId,
          });
        } else {
          await notify(ctx, m.userId, {
            type: "group_message",
            title: "New message",
            body: `${myName}: "${body}"`,
            groupId,
            messageId: messageId as any,
            actorId: userId,
          });
        }
      } else {
        await notify(ctx, m.userId, {
          type: "group_message",
          title: "New message",
          body: `${myName}: "${body}"`,
          groupId,
          messageId: messageId as any,
          actorId: userId,
        });
      }
    }
    return messageId;
  },
});

export const editMessage = mutation({
  args: { messageId: v.id("studyGroupMessages"), text: v.string() },
  handler: async (ctx, { messageId, text }) => {
    const userId = await requireUser(ctx);
    const message = await ctx.db.get(messageId);
    if (!message || message.authorId !== userId)
      throw new Error("You can only edit your own messages.");
    if (!text.trim()) throw new Error("Message can't be empty.");
    await ctx.db.patch(messageId, { text: text.trim(), editedAt: Date.now() });
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id("studyGroupMessages") },
  handler: async (ctx, { messageId }) => {
    const userId = await requireUser(ctx);
    const message = await ctx.db.get(messageId);
    if (!message) return;
    const member = await getMember(ctx, message.groupId, userId);
    if (message.authorId !== userId && member?.role !== "admin")
      throw new Error("You can only delete your own messages.");
    await ctx.db.delete(messageId);
  },
});

export const reactToMessage = mutation({
  args: { messageId: v.id("studyGroupMessages"), emoji: v.string() },
  handler: async (ctx, { messageId, emoji }) => {
    const userId = await requireUser(ctx);
    const message = await ctx.db.get(messageId);
    if (!message) return;
    const member = await getMember(ctx, message.groupId, userId);
    if (!member) throw new Error("You're not a member of this group.");
    const existing = message.reactions.find((r) => r.emoji === emoji);
    let reactions = message.reactions;
    if (existing) {
      const has = existing.userIds.some((id) => id === (userId as any));
      if (has) {
        const filtered = existing.userIds.filter((id) => id !== (userId as any));
        reactions = filtered.length
          ? message.reactions.map((r) =>
              r.emoji === emoji ? { ...r, userIds: filtered } : r,
            )
          : message.reactions.filter((r) => r.emoji !== emoji);
      } else {
        reactions = message.reactions.map((r) =>
          r.emoji === emoji
            ? { ...r, userIds: [...r.userIds, userId as any] }
            : r,
        );
      }
    } else {
      reactions = [...message.reactions, { emoji, userIds: [userId as any] }];
    }
    await ctx.db.patch(messageId, { reactions });
    if (message.authorId !== userId) {
      const myName = await getUserName(ctx, userId);
      await notify(ctx, message.authorId, {
        type: "reaction",
        title: "Reaction",
        body: `${myName} reacted ${emoji} to your message`,
        groupId: message.groupId,
        messageId,
        actorId: userId,
      });
    }
  },
});

export const pinMessage = mutation({
  args: { messageId: v.id("studyGroupMessages"), pinned: v.boolean() },
  handler: async (ctx, { messageId, pinned }) => {
    const userId = await requireUser(ctx);
    const message = await ctx.db.get(messageId);
    if (!message) return;
    const member = await getMember(ctx, message.groupId, userId);
    if (!member || (member.role !== "admin" && member.role !== "moderator"))
      throw new Error("Only admins and moderators can pin messages.");
    await ctx.db.patch(messageId, { pinned });
  },
});

/* ------------------------------------------------------------------ */
/*  Materials                                                         */
/* ------------------------------------------------------------------ */

export const generateMaterialUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const shareMaterial = mutation({
  args: {
    groupId: v.id("studyGroups"),
    name: v.string(),
    type: v.string(),
    size: v.string(),
    storageId: v.optional(v.string()),
  },
  handler: async (ctx, { groupId, name, type, size, storageId }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member) throw new Error("You're not a member of this group.");
    const now = Date.now();
    const materialId = await ctx.db.insert("studyGroupMaterials", {
      groupId: groupId as any,
      name,
      type,
      size,
      storageId,
      uploaderId: userId as any,
      createdAt: now,
    });
    // Chat message so everyone sees the share
    const messageId = await ctx.db.insert("studyGroupMessages", {
      groupId: groupId as any,
      authorId: userId as any,
      text: `📎 shared a file: ${name}`,
      reactions: [],
      pinned: false,
      mentions: [],
      createdAt: now,
    });
    await ctx.db.patch(groupId, { lastActivityAt: now });

    const members = await getActiveMembers(ctx, groupId);
    const myName = await getUserName(ctx, userId);
    for (const m of members) {
      if (m.userId === userId || m.muted) continue;
      await notify(ctx, m.userId, {
        type: "material",
        title: "New material",
        body: `${myName} shared "${name}"`,
        groupId,
        messageId: messageId as any,
        materialId: materialId as any,
        actorId: userId,
      });
    }
    return materialId;
  },
});

export const deleteMaterial = mutation({
  args: { materialId: v.id("studyGroupMaterials") },
  handler: async (ctx, { materialId }) => {
    const userId = await requireUser(ctx);
    const material = await ctx.db.get(materialId);
    if (!material) return;
    const member = await getMember(ctx, material.groupId, userId);
    if (material.uploaderId !== userId && member?.role !== "admin")
      throw new Error("Only the uploader or an admin can remove this file.");
    if (material.storageId) {
      try {
        await ctx.storage.delete(material.storageId as any);
      } catch {
        // storage may already be gone — ignore
      }
    }
    await ctx.db.delete(materialId);
  },
});

/* ------------------------------------------------------------------ */
/*  Announcements & events                                            */
/* ------------------------------------------------------------------ */

export const createAnnouncement = mutation({
  args: { groupId: v.id("studyGroups"), text: v.string() },
  handler: async (ctx, { groupId, text }) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, groupId, userId);
    if (!member || (member.role !== "admin" && member.role !== "moderator"))
      throw new Error("Only admins and moderators can post announcements.");
    if (!text.trim()) throw new Error("Announcement can't be empty.");
    const now = Date.now();
    await ctx.db.patch(groupId, {
      announcement: {
        text: text.trim(),
        authorId: userId as any,
        createdAt: now,
      },
      lastActivityAt: now,
    });
    const myName = await getUserName(ctx, userId);
    await notifyActiveMembers(
      ctx,
      groupId,
      {
        type: "announcement",
        title: "Group announcement 📢",
        body: `${myName}: "${text.trim().slice(0, 90)}"`,
        actorId: userId,
      },
      { skipMuted: true },
    );
  },
});

export const createEvent = mutation({
  args: {
    groupId: v.id("studyGroups"),
    name: v.string(),
    date: v.string(),
    time: v.string(),
    description: v.string(),
    duration: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const member = await getMember(ctx, args.groupId, userId);
    if (!member || (member.role !== "admin" && member.role !== "moderator"))
      throw new Error("Only admins and moderators can create study events.");
    const now = Date.now();
    await ctx.db.insert("studyGroupEvents", {
      groupId: args.groupId as any,
      name: args.name.trim(),
      date: args.date,
      time: args.time,
      description: args.description.trim(),
      duration: args.duration,
      creatorId: userId as any,
      attendees: [userId as any],
      createdAt: now,
    });
    await ctx.db.patch(args.groupId, { lastActivityAt: now });
    const myName = await getUserName(ctx, userId);
    await notifyActiveMembers(
      ctx,
      args.groupId,
      {
        type: "event",
        title: "New study event 📅",
        body: `${myName} created "${args.name.trim()}" — ${args.date} at ${args.time}`,
        actorId: userId,
      },
      { skipMuted: true },
    );
  },
});

export const deleteEvent = mutation({
  args: { eventId: v.id("studyGroupEvents") },
  handler: async (ctx, { eventId }) => {
    const userId = await requireUser(ctx);
    const event = await ctx.db.get(eventId);
    if (!event) return;
    const member = await getMember(ctx, event.groupId, userId);
    if (
      event.creatorId !== userId &&
      (!member || (member.role !== "admin" && member.role !== "moderator"))
    )
      throw new Error("You can't delete this event.");
    await ctx.db.delete(eventId);
  },
});

export const rsvpEvent = mutation({
  args: { eventId: v.id("studyGroupEvents") },
  handler: async (ctx, { eventId }) => {
    const userId = await requireUser(ctx);
    const event = await ctx.db.get(eventId);
    if (!event) return;
    const member = await getMember(ctx, event.groupId, userId);
    if (!member) throw new Error("You're not a member of this group.");
    const attending = event.attendees.some((id) => id === (userId as any));
    await ctx.db.patch(eventId, {
      attendees: attending
        ? event.attendees.filter((id) => id !== (userId as any))
        : [...event.attendees, userId as any],
    });
  },
});

/* ------------------------------------------------------------------ */
/*  Notifications                                                     */
/* ------------------------------------------------------------------ */

export const markNotificationsRead = mutation({
  args: { ids: v.array(v.id("notifications")) },
  handler: async (ctx, { ids }) => {
    const userId = await requireUser(ctx);
    for (const id of ids) {
      const notification = await ctx.db.get(id);
      if (notification && notification.userId === (userId as any)) {
        await ctx.db.patch(id, { read: true });
      }
    }
  },
});

export const markAllNotificationsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", userId as any).eq("read", false),
      )
      .collect();
    for (const notification of unread) {
      await ctx.db.patch(notification._id, { read: true });
    }
  },
});

export const updateNotificationSettings = mutation({
  args: {
    pushEnabled: v.optional(v.boolean()),
    emailEnabled: v.optional(v.boolean()),
    groupMessages: v.optional(v.boolean()),
    mentions: v.optional(v.boolean()),
    replies: v.optional(v.boolean()),
    reactions: v.optional(v.boolean()),
    sharedMaterials: v.optional(v.boolean()),
    groupInvitations: v.optional(v.boolean()),
    joinRequestUpdates: v.optional(v.boolean()),
    announcements: v.optional(v.boolean()),
    studyEvents: v.optional(v.boolean()),
  },
  handler: async (ctx, patch) => {
    const userId = await requireUser(ctx);
    const existing = await ctx.db
      .query("notificationSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId as any))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("notificationSettings", {
        userId: userId as any,
        ...DEFAULT_NOTIF_SETTINGS,
        ...patch,
      });
    }
  },
});

/* ------------------------------------------------------------------ */
/*  Demo data (first run)                                             */
/* ------------------------------------------------------------------ */

export const ensureDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const seeded = await ctx.db
      .query("demoSeed")
      .withIndex("by_user", (q) => q.eq("userId", userId as any))
      .first();
    if (seeded) return { seeded: true };
    const now = Date.now();

    // --- Fake classmates -------------------------------------------------
    const mk = async (name: string) =>
      await ctx.db.insert("users", {
        name,
        role: "member",
      });
    const ahmed = await mk("Ahmed Khan");
    const sara = await mk("Sara Malik");
    const ali = await mk("Ali Hassan");
    const hamza = await mk("Hamza Raza");
    const noor = await mk("Noor Fatima");
    const omar = await mk("Omar Farooq");
    const lina = await mk("Lina Qureshi");
    const yousuf = await mk("Yousuf Tariq");
    const zara = await mk("Zara Sheikh");

    const mkGroup = async (g: {
      name: string;
      subject: string;
      type: "public" | "private";
      icon: string;
      tint: string;
      description: string;
      creator: string;
      activity: number;
      members: { id: string; role: "admin" | "moderator" | "member"; online?: boolean }[];
      userLastReadAt?: number;
    }) => {
      const groupId = await ctx.db.insert("studyGroups", {
        name: g.name,
        subject: g.subject,
        type: g.type,
        description: g.description,
        maxMembers: 50,
        rules: "Be kind, stay on topic, and help each other out.",
        creatorId: g.creator as any,
        icon: g.icon,
        tint: g.tint,
        inviteCode: randomCode(),
        lastActivityAt: g.activity,
        createdAt: now - 20 * 86400000,
      });
      for (const m of g.members) {
        await ctx.db.insert("studyGroupMembers", {
          groupId: groupId as any,
          userId: m.id as any,
          role: m.role,
          status: "active",
          joinedAt: now - 12 * 86400000,
          lastReadAt: g.userLastReadAt ?? now,
          muted: false,
          online: m.online ?? false,
        });
      }
      return groupId;
    };

    // Calculus Crew — active chat, unread for the student
    const calculus = await mkGroup({
      name: "Calculus Crew",
      subject: "Mathematics",
      type: "public",
      icon: "🧮",
      tint: "indigo",
      description: "Derivatives, integrals and everything in between. Daily problem sets.",
      creator: ahmed,
      activity: now - 2 * 3600000,
      members: [
        { id: ahmed, role: "admin", online: true },
        { id: sara, role: "moderator", online: true },
        { id: hamza, role: "member" },
        { id: userId, role: "member", online: true },
        { id: lina, role: "member" },
      ],
      userLastReadAt: now - 3600000,
    });

    const m1 = await ctx.db.insert("studyGroupMessages", {
      groupId: calculus as any,
      authorId: ahmed as any,
      text: "Anyone free for a derivative review tonight? I'm stuck on chain rule questions 🧠",
      reactions: [{ emoji: "👍", userIds: [sara as any] }],
      pinned: false,
      mentions: [],
      createdAt: now - 2.2 * 3600000,
    });
    await ctx.db.insert("studyGroupMessages", {
      groupId: calculus as any,
      authorId: sara as any,
      text: "I can join after 8! Bring the chain rule worksheet 🎉",
      replyTo: m1 as any,
      reactions: [{ emoji: "🎉", userIds: [ahmed as any, hamza as any] }],
      pinned: false,
      mentions: [],
      createdAt: now - 2 * 3600000,
    });
    await ctx.db.insert("studyGroupMessages", {
      groupId: calculus as any,
      authorId: ahmed as any,
      text: "Hey @Fahad, can you check question 4b? I keep getting a different answer than the key.",
      reactions: [],
      pinned: false,
      mentions: [userId as any],
      createdAt: now - 0.4 * 3600000,
    });
    await ctx.db.insert("studyGroupMessages", {
      groupId: calculus as any,
      authorId: lina as any,
      text: "Tip: don't forget the product rule on 4b — that tripped me up too 😄",
      reactions: [{ emoji: "💡", userIds: [userId as any] }],
      pinned: false,
      mentions: [],
      createdAt: now - 0.2 * 3600000,
    });

    // Physics Lab Partners — announcement + event + a reply to the student
    const physics = await mkGroup({
      name: "Physics Lab Partners",
      subject: "Physics",
      type: "public",
      icon: "⚛️",
      tint: "violet",
      description: "Lab prep, chapter revisions and problem-solving for Physics.",
      creator: noor,
      activity: now - 5 * 3600000,
      members: [
        { id: noor, role: "admin", online: true },
        { id: hamza, role: "moderator", online: true },
        { id: omar, role: "member" },
        { id: userId, role: "member" },
      ],
    });
    await ctx.db.patch(physics, {
      announcement: {
        text: "Tomorrow's Physics study session will start at 7:00 PM.",
        authorId: noor as any,
        createdAt: now - 5 * 3600000,
      },
    });
    const studentMsg = await ctx.db.insert("studyGroupMessages", {
      groupId: physics as any,
      authorId: userId as any,
      text: "Can anyone explain vectors? 🤔",
      reactions: [{ emoji: "👍", userIds: [noor as any] }],
      pinned: false,
      mentions: [],
      createdAt: now - 3 * 3600000,
    });
    await ctx.db.insert("studyGroupMessages", {
      groupId: physics as any,
      authorId: hamza as any,
      text: "Sure! Check the chapter 5 slides — I'd start with the triangle law example.",
      replyTo: studentMsg as any,
      reactions: [],
      pinned: false,
      mentions: [],
      createdAt: now - 2 * 3600000,
    });
    await ctx.db.insert("studyGroupEvents", {
      groupId: physics as any,
      name: "Physics Revision Session",
      date: "Tomorrow",
      time: "7:00 PM",
      description: "Chapters 5–6 revision with practice problems. Bring your notes!",
      duration: "1 hour",
      creatorId: noor as any,
      attendees: [noor as any, ahmed as any, hamza as any],
      createdAt: now - 26 * 3600000,
    });

    // Bio Study Squad — quiet group the student belongs to
    await mkGroup({
      name: "Bio Study Squad",
      subject: "Biology",
      type: "public",
      icon: "🧬",
      tint: "emerald",
      description: "Cell biology, genetics and revision notes for exams.",
      creator: omar,
      activity: now - 2 * 86400000,
      members: [
        { id: omar, role: "admin", online: false },
        { id: zara, role: "moderator" },
        { id: yousuf, role: "member" },
        { id: userId, role: "member" },
      ],
    });

    // Discover groups
    const chemAces = await mkGroup({
      name: "Chemistry Aces",
      subject: "Chemistry",
      type: "public",
      icon: "🧪",
      tint: "rose",
      description: "Organic & inorganic chemistry with weekly formula quizzes.",
      creator: lina,
      activity: now - 3600000,
      members: [
        { id: lina, role: "admin", online: true },
        { id: sara, role: "moderator" },
        { id: ahmed, role: "member", online: true },
        { id: yousuf, role: "member" },
        { id: zara, role: "member" },
        { id: omar, role: "member" },
      ],
    });
    void chemAces;
    await mkGroup({
      name: "SAT Math Prep",
      subject: "Mathematics",
      type: "public",
      icon: "📐",
      tint: "sky",
      description: "High-scoring strategies and timed practice for the SAT math section.",
      creator: ali,
      activity: now - 3 * 3600000,
      members: [
        { id: ali, role: "admin", online: true },
        { id: ahmed, role: "moderator", online: true },
        { id: hamza, role: "member" },
        { id: noor, role: "member" },
        { id: lina, role: "member" },
      ],
    });
    await mkGroup({
      name: "English Lit Circle",
      subject: "English",
      type: "private",
      icon: "📖",
      tint: "amber",
      description: "Essay reviews, poetry analysis and vocabulary sprints.",
      creator: zara,
      activity: now - 86400000,
      members: [
        { id: zara, role: "admin" },
        { id: yousuf, role: "moderator" },
        { id: sara, role: "member" },
      ],
    });

    // Materials shared in the student's groups
    await ctx.db.insert("studyGroupMaterials", {
      groupId: calculus as any,
      name: "Physics Chapter 6.pdf",
      type: "PDF",
      size: "4.2 MB",
      uploaderId: sara as any,
      createdAt: now - 15 * 60000,
    });
    await ctx.db.insert("studyGroupMaterials", {
      groupId: calculus as any,
      name: "Calculus Integration Sheet.pdf",
      type: "PDF",
      size: "1.8 MB",
      uploaderId: ahmed as any,
      createdAt: now - 2 * 86400000,
    });
    await ctx.db.insert("studyGroupMaterials", {
      groupId: physics as any,
      name: "Chapter 5 Slides.pptx",
      type: "PPTX",
      size: "6.3 MB",
      uploaderId: noor as any,
      createdAt: now - 3 * 86400000,
    });

    // Notifications for the student (bell activity)
    await ctx.db.insert("notifications", {
      userId: userId as any,
      type: "mention",
      title: "Study Group",
      body: "Ahmed mentioned you in Calculus Crew",
      groupId: calculus as any,
      messageId: (await ctx.db
        .query("studyGroupMessages")
        .withIndex("by_group", (q) => q.eq("groupId", calculus as any))
        .order("desc")
        .first())?._id as any,
      actorId: ahmed as any,
      read: false,
      createdAt: now - 2 * 60000,
    });
    await ctx.db.insert("notifications", {
      userId: userId as any,
      type: "material",
      title: "New Material",
      body: "Sara shared \"Physics Chapter 6.pdf\"",
      groupId: calculus as any,
      actorId: sara as any,
      read: false,
      createdAt: now - 15 * 60000,
    });
    await ctx.db.insert("studyGroupInvites", {
      groupId: (await ctx.db
        .query("studyGroups")
        .filter((q) => q.eq(q.field("name"), "SAT Math Prep"))
        .first())?._id as any,
      inviterId: ali as any,
      invitedUserId: userId as any,
      status: "pending",
      createdAt: now - 3600000,
    });
    await ctx.db.insert("notifications", {
      userId: userId as any,
      type: "invite",
      title: "Group Invite",
      body: "Ali invited you to SAT Math Prep",
      groupId: (await ctx.db
        .query("studyGroups")
        .filter((q) => q.eq(q.field("name"), "SAT Math Prep"))
        .first())?._id as any,
      actorId: ali as any,
      read: false,
      createdAt: now - 3600000,
    });
    await ctx.db.insert("notifications", {
      userId: userId as any,
      type: "reply",
      title: "Reply",
      body: "Hamza replied to your message in Physics Lab Partners",
      groupId: physics as any,
      actorId: hamza as any,
      read: true,
      createdAt: now - 2 * 3600000,
    });
    await ctx.db.insert("notifications", {
      userId: userId as any,
      type: "event",
      title: "Study Event",
      body: "Noor created \"Physics Revision Session\" — Tomorrow at 7:00 PM",
      groupId: physics as any,
      actorId: noor as any,
      read: true,
      createdAt: now - 26 * 3600000,
    });

    await ctx.db.insert("demoSeed", { userId: userId as any });
    return { seeded: false };
  },
});
