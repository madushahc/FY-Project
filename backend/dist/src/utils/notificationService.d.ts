interface Payload {
    title: string;
    message: string;
    type?: string;
    linkUrl?: string;
    urgency?: "low" | "normal" | "high";
}
export declare function sendNotificationsToUsers(userIds: Array<any>, payload: Payload): Promise<void>;
export declare function sendNotificationToUser(userId: any, payload: Payload): Promise<void>;
export {};
//# sourceMappingURL=notificationService.d.ts.map