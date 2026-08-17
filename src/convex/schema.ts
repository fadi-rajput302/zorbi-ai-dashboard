import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    studyGroups: defineTable({
      name: v.string(),
      subject: v.string(),
      description: v.string(),
      type: v.union(v.literal("public"), v.literal("private")),
      maxMembers: v.number(),
      rules: v.optional(v.string()),
      creatorId: v.id("users"),
      icon: v.string(),
      tint: v.string(),
      inviteCode: v.string(),
      announcement: v.optional(
        v.object({
          text: v.string(),
          authorId: v.id("users"),
          createdAt: v.number(),
        }),
      ),
      lastActivityAt: v.number(),
      createdAt: v.number(),
    }).index("by_inviteCode", ["inviteCode"]),

    studyGroupMembers: defineTable({
      groupId: v.id("studyGroups"),
      userId: v.id("users"),
      role: v.union(
        v.literal("admin"),
        v.literal("moderator"),
        v.literal("member"),
      ),
      status: v.union(v.literal("active"), v.literal("pending")),
      joinedAt: v.number(),
      lastReadAt: v.number(),
      muted: v.optional(v.boolean()),
      online: v.optional(v.boolean()),
    })
      .index("by_user", ["userId"])
      .index("by_group", ["groupId"])
      .index("by_group_status", ["groupId", "status"]),

    studyGroupMessages: defineTable({
      groupId: v.id("studyGroups"),
      authorId: v.id("users"),
      text: v.string(),
      replyTo: v.optional(v.id("studyGroupMessages")),
      reactions: v.array(
        v.object({
          emoji: v.string(),
          userIds: v.array(v.id("users")),
        }),
      ),
      pinned: v.boolean(),
      mentions: v.array(v.id("users")),
      editedAt: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_group", ["groupId", "createdAt"])
      .index("by_pinned", ["groupId", "pinned"]),

    studyGroupMaterials: defineTable({
      groupId: v.id("studyGroups"),
      name: v.string(),
      type: v.string(),
      size: v.string(),
      storageId: v.optional(v.string()),
      uploaderId: v.id("users"),
      createdAt: v.number(),
    }).index("by_group", ["groupId", "createdAt"]),

    studyGroupEvents: defineTable({
      groupId: v.id("studyGroups"),
      name: v.string(),
      date: v.string(),
      time: v.string(),
      description: v.string(),
      duration: v.string(),
      creatorId: v.id("users"),
      attendees: v.array(v.id("users")),
      createdAt: v.number(),
    }).index("by_group", ["groupId"]),

    studyGroupInvites: defineTable({
      groupId: v.id("studyGroups"),
      inviterId: v.id("users"),
      invitedUserId: v.id("users"),
      status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined")),
      createdAt: v.number(),
    })
      .index("by_user", ["invitedUserId", "status"])
      .index("by_group", ["groupId"]),

    notifications: defineTable({
      userId: v.id("users"),
      type: v.string(),
      title: v.string(),
      body: v.string(),
      groupId: v.optional(v.id("studyGroups")),
      messageId: v.optional(v.id("studyGroupMessages")),
      materialId: v.optional(v.id("studyGroupMaterials")),
      actorId: v.optional(v.id("users")),
      read: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_user", ["userId", "createdAt"])
      .index("by_user_read", ["userId", "read"]),

    notificationSettings: defineTable({
      userId: v.id("users"),
      pushEnabled: v.boolean(),
      emailEnabled: v.boolean(),
      groupMessages: v.boolean(),
      mentions: v.boolean(),
      replies: v.boolean(),
      reactions: v.boolean(),
      sharedMaterials: v.boolean(),
      groupInvitations: v.boolean(),
      joinRequestUpdates: v.boolean(),
      announcements: v.boolean(),
      studyEvents: v.boolean(),
    }).index("by_user", ["userId"]),

    demoSeed: defineTable({
      userId: v.id("users"),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
