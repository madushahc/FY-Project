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
    points: { type: Number, default: 0 },
    badges: [{ type: String }],
}, {
    timestamps: true,
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map