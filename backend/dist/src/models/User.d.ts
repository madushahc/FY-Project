import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    role: "Student" | "Lecturer" | "Admin";
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    passwordHash: string;
    university: string;
    department: string;
    phoneNumber?: string;
    jobTitle?: string;
    location?: string;
    website?: string;
    points: number;
    badges: string[];
    bio?: string;
    profilePhoto?: string;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
    participantCode?: string;
    isResearchParticipant?: boolean;
    isTestUser?: boolean;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map