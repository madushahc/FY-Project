"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyToPost = exports.createPost = exports.getPostsByCourse = void 0;
const express_1 = require("express");
const ForumPost_1 = __importDefault(require("../models/ForumPost"));
const auth_1 = require("../middleware/auth");
const getPostsByCourse = async (req, res) => {
    try {
        const posts = await ForumPost_1.default.find({ course: req.params.courseId })
            .populate('author', 'name role')
            .populate('replies.author', 'name role')
            .sort({ isPinned: -1, createdAt: -1 });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getPostsByCourse = getPostsByCourse;
const createPost = async (req, res) => {
    try {
        const post = await ForumPost_1.default.create({
            ...req.body,
            author: req.user?.id
        });
        res.status(201).json(post);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid post data' });
    }
};
exports.createPost = createPost;
const replyToPost = async (req, res) => {
    try {
        const post = await ForumPost_1.default.findById(req.params.postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        post.replies.push({
            author: req.user?.id,
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
exports.replyToPost = replyToPost;
//# sourceMappingURL=forumController.js.map