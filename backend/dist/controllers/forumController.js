import ForumPost from '../models/ForumPost.js';
export const getPostsByCourse = async (req, res) => {
    try {
        const posts = await ForumPost.find({ course: req.params.courseId })
            .populate('author', 'name role')
            .populate('replies.author', 'name role')
            .sort({ isPinned: -1, createdAt: -1 });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
export const createPost = async (req, res) => {
    try {
        const post = await ForumPost.create({
            ...req.body,
            author: req.user?._id
        });
        res.status(201).json(post);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid post data' });
    }
};
export const replyToPost = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        post.replies.push({
            author: req.user?._id,
            content: req.body.content,
            createdAt: new Date(),
            likes: 0
        });
        await post.save();
        res.json(post);
    }
    catch (error) {
        res.status(400).json({ message: 'Reply failed' });
    }
};
//# sourceMappingURL=forumController.js.map