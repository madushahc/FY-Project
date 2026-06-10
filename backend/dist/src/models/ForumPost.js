import mongoose, { Schema } from "mongoose";
const ForumPostSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [
        {
            author: { type: Schema.Types.ObjectId, ref: "User", required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            likes: { type: Number, default: 0 },
            likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
        },
    ],
    isPinned: { type: Boolean, default: false },
}, {
    timestamps: true,
});
export default mongoose.model("ForumPost", ForumPostSchema);
//# sourceMappingURL=ForumPost.js.map