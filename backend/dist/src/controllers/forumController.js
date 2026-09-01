import ForumPost from "../models/ForumPost.js";
import { sendNotificationToUser } from "../utils/notificationService.js";
export const getPostsByCourse = async (req, res) => {
    try {
        const posts = await ForumPost.find({ course: req.params.courseId })
            .populate("author", "name role")
            .populate("likedBy", "name")
            .populate("replies.author", "name role")
            .populate("replies.likedBy", "name")
            .sort({ isPinned: -1, createdAt: -1 });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
export const getAllPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find()
            .populate("author", "name role")
            .populate("likedBy", "name")
            .populate("replies.author", "name role")
            .populate("replies.likedBy", "name")
            .sort({ isPinned: -1, createdAt: -1 });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
export const createPost = async (req, res) => {
    try {
        const courseId = req.body.course || req.body.courseId;
        if (!courseId) {
            res.status(400).json({ message: "Course ID is required" });
            return;
        }
        const post = await ForumPost.create({
            ...req.body,
            course: courseId,
            author: req.user?._id,
        });
        res.status(201).json(post);
    }
    catch (error) {
        console.error("Failed to create forum post:", error);
        res.status(400).json({ message: error?.message || "Invalid post data" });
    }
};
export const replyToPost = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const reply = {
            author: req.user?._id,
            content: req.body.content,
            createdAt: new Date(),
            likes: 0,
            likedBy: [],
        };
        post.replies.push(reply);
        await post.save();
        // Notify post owner (if not replying to your own post)
        if (String(post.author) !== String(req.user?._id)) {
            await sendNotificationToUser(post.author, {
                title: "New reply to your post",
                message: `${req.user?.name || "Someone"} replied to your post: ${post.title}`,
                type: "forum",
                linkUrl: `/student/forum?postId=${post._id}`,
            });
        }
        const populated = await ForumPost.findById(post._id)
            .populate("author", "name role")
            .populate("likedBy", "name")
            .populate("replies.author", "name role")
            .populate("replies.likedBy", "name");
        res.status(201).json(populated);
    }
    catch (error) {
        res.status(400).json({ message: "Reply failed" });
    }
};
export const likePost = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const userId = req.user?._id;
        const likedBy = post.likedBy || [];
        const idx = likedBy.findIndex((u) => String(u) === String(userId));
        let liked = false;
        if (idx === -1) {
            likedBy.push(userId);
            liked = true;
        }
        else {
            likedBy.splice(idx, 1);
            liked = false;
        }
        post.likedBy = likedBy;
        post.likes = post.likedBy.length;
        await post.save();
        // Notify post owner when someone likes (and it's not your own post)
        if (liked && String(post.author) !== String(userId)) {
            await sendNotificationToUser(post.author, {
                title: "Someone liked your post",
                message: `${req.user?.name || "Someone"} liked your post: ${post.title}`,
                type: "forum",
                linkUrl: `/student/forum?postId=${post._id}`,
            });
        }
        const populated = await ForumPost.findById(post._id)
            .populate("author", "name role")
            .populate("likedBy", "name")
            .populate("replies.author", "name role")
            .populate("replies.likedBy", "name");
        res.json(populated);
    }
    catch (error) {
        res.status(400).json({ message: "Like failed" });
    }
};
export const likeReply = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const reply = post.replies.find((r) => String(r._id) === String(req.params.replyId));
        if (!reply) {
            res.status(404).json({ message: "Reply not found" });
            return;
        }
        const userId = req.user?._id;
        reply.likedBy = reply.likedBy || [];
        const rIdx = reply.likedBy.findIndex((u) => String(u) === String(userId));
        let liked = false;
        if (rIdx === -1) {
            reply.likedBy.push(userId);
            liked = true;
        }
        else {
            reply.likedBy.splice(rIdx, 1);
            liked = false;
        }
        reply.likes = reply.likedBy.length;
        await post.save();
        // Notify reply owner when someone likes their reply
        if (liked && String(reply.author) !== String(userId)) {
            await sendNotificationToUser(reply.author, {
                title: "Someone liked your reply",
                message: `${req.user?.name || "Someone"} liked your reply on: ${post.title}`,
                type: "forum",
                linkUrl: `/student/forum?postId=${post._id}`,
            });
        }
        const populated = await ForumPost.findById(post._id)
            .populate("author", "name role")
            .populate("likedBy", "name")
            .populate("replies.author", "name role")
            .populate("replies.likedBy", "name");
        res.json(populated);
    }
    catch (error) {
        res.status(400).json({ message: "Reply like failed" });
    }
};
//# sourceMappingURL=forumController.js.map