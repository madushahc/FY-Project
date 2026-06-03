import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
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
}, {
    timestamps: true,
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map