import Notification from "../models/Notification.js";

interface Payload {
  title: string;
  message: string;
  type?: string;
  linkUrl?: string;
  urgency?: "low" | "normal" | "high";
}

export async function sendNotificationsToUsers(
  userIds: Array<any>,
  payload: Payload,
) {
  if (!Array.isArray(userIds) || userIds.length === 0) return;

  const docs = userIds.map((uid) => ({
    recipient: uid,
    title: payload.title,
    message: payload.message,
    type: payload.type || "system",
    ...(payload.linkUrl !== undefined ? { linkUrl: payload.linkUrl } : {}),
    urgency: payload.urgency || "normal",
  }));

  try {
    await Notification.insertMany(docs);
  } catch (err) {
    console.error("Failed to send notifications", err);
  }
}

export async function sendNotificationToUser(userId: any, payload: Payload) {
  try {
    const doc: any = {
      recipient: userId,
      title: payload.title,
      message: payload.message,
      type: payload.type || "system",
      urgency: payload.urgency || "normal",
    };
    if (payload.linkUrl !== undefined) doc.linkUrl = payload.linkUrl;
    await Notification.create(doc);
  } catch (err) {
    console.error("Failed to create notification", err);
  }
}
