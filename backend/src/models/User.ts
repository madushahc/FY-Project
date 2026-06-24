import mongoose, { Document, Schema } from "mongoose";

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
}

const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: ["Student", "Lecturer", "Admin"],
      default: "Student",
      required: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    university: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    phoneNumber: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    points: { type: Number, default: 0 },
    badges: [{ type: String }],
    bio: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>("User", userSchema);
