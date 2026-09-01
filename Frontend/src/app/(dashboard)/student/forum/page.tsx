"use client";

import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageSquare,
  Medal,
  Pin,
  MessageCircle,
  X,
} from "lucide-react";
import { useForumStore } from "@/store/useForumStore";
import { useCourseStore } from "@/store/useCourseStore";
import { useUserStore } from "@/store/useUserStore";
import api from "@/lib/api";
import Loading from "@/components/ui/Loading";

export default function DiscussionForum() {
  const { createPost, replyToPost, likePost, likeReply } = useForumStore() as any;
  const { myEnrollments, fetchMyEnrollments } = useCourseStore();
  const { user, initializeUser } = useUserStore();

  const [activeTab, setActiveTab] = useState("All Posts");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // New Post State
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [submittingPost, setSubmittingPost] = useState(false);

  useEffect(() => {
    initializeUser();
    fetchMyEnrollments();
  }, []);

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      if (activeTab === "All Posts") {
        try {
          const res = await api.get("/forums/all");
          setPosts(res.data);
        } catch (err: any) {
          // If the aggregated endpoint isn't available (404), fall back to per-course aggregation
          if (err.response?.status === 404) {
            let agg: any[] = [];
            for (const enrollment of myEnrollments) {
              const courseId = enrollment.course._id || enrollment.course;
              const res = await api.get(`/forums/course/${courseId}`);
              const mapped = res.data.map((p: any) => ({
                ...p,
                courseName: enrollment.course.title || "Unknown Course",
              }));
              agg = [...agg, ...mapped];
            }
            agg.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
            setPosts(agg);
          } else {
            console.error("Failed to load forum posts", err);
          }
        }
      } else {
        let agg: any[] = [];
        for (const enrollment of myEnrollments) {
          const courseId = enrollment.course._id || enrollment.course;
          const res = await api.get(`/forums/course/${courseId}`);
          const mapped = res.data.map((p: any) => ({
            ...p,
            courseName: enrollment.course.title || "Unknown Course",
          }));
          agg = [...agg, ...mapped];
        }
        // Sort by newest
        agg.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setPosts(agg);
      }
    } catch (err) {
      console.error("Failed to load forum posts", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "All Posts") {
      fetchAllPosts();
    } else {
      if (myEnrollments.length > 0) {
        fetchAllPosts();
      } else {
        setLoading(false);
      }
    }
  }, [myEnrollments, activeTab]);

  useEffect(() => {
    if (myEnrollments.length > 0 && !selectedCourseId) {
      const firstCourseId = (myEnrollments[0].course as any)?._id || myEnrollments[0].course;
      if (firstCourseId) setSelectedCourseId(String(firstCourseId));
    }
  }, [myEnrollments, selectedCourseId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    let targetCourseId = selectedCourseId;
    if (!targetCourseId && myEnrollments.length > 0) {
      targetCourseId = String((myEnrollments[0].course as any)?._id || myEnrollments[0].course);
      setSelectedCourseId(targetCourseId);
    }

    if (!targetCourseId) {
      alert("Please enroll in a course first before creating a discussion post.");
      return;
    }

    if (!newPostTitle.trim()) {
      alert("Please enter a title for your discussion post.");
      return;
    }

    if (!newPostContent.trim()) {
      alert("Please enter details for your discussion post.");
      return;
    }

    setSubmittingPost(true);
    try {
      await createPost({
        course: targetCourseId,
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
      });
      setIsPostModalOpen(false);
      setNewPostTitle("");
      setNewPostContent("");
      await fetchAllPosts(); // Refresh aggregated feed
    } catch (err: any) {
      console.error("Failed to create post", err);
      alert(err.response?.data?.message || "Failed to publish discussion post.");
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleReplySubmit = async (postId: string) => {
    const content = replyInputs[postId];
    if (!content) return;
    try {
      await replyToPost(postId, content);
      setReplyInputs((prev) => ({ ...prev, [postId]: "" }));
      await fetchAllPosts();
    } catch (err) {
      console.error("Failed to submit reply", err);
      alert("Failed to submit reply");
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
      await fetchAllPosts();
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  const handleLikeReply = async (postId: string, replyId: string) => {
    try {
      await likeReply(postId, replyId);
      await fetchAllPosts();
    } catch (err) {
      console.error("Failed to like reply", err);
    }
  };

  // Filter Active Tab
  const displayPosts =
    activeTab === "My Posts"
      ? posts.filter(
        (p) => p.author?._id === user?._id || p.author === user?._id,
      )
      : posts;

  // Fallback avatars/colors based on ID string
  const getAvatarColor = (idStr: string) => {
    const colors = [
      "bg-blue-600",
      "bg-emerald-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    if (!idStr) return colors[0];
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Discussion Forum
      </h2>

      <div className="flex gap-4 mb-6">
        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
          {["All Posts", "My Posts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                  ? "bg-slate-100 text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            if (!selectedCourseId && myEnrollments.length > 0) {
              const firstId = (myEnrollments[0].course as any)?._id || myEnrollments[0].course;
              if (firstId) setSelectedCourseId(String(firstId));
            }
            setIsPostModalOpen(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
        >
          + New Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <Loading />
          ) : displayPosts.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-500">
              No discussion posts found.
            </div>
          ) : (
            displayPosts.map((post) => {
              const authorName = post.author?.name || "Anonymous";
              const initial = authorName.charAt(0).toUpperCase();
              const time = new Date(post.createdAt).toLocaleDateString();

              return (
                <div
                  key={post._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(post.author?._id || "1")}`}
                    >
                      {initial}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-slate-800">
                          {authorName}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-400">{time}</span>
                      </div>
                      <span className="text-xs text-blue-500 font-medium">
                        #{post.courseName}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-slate-800 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLikePost(post._id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-yellow-500 transition text-sm font-medium"
                    >
                      <ThumbsUp className="w-4 h-4" />{" "}
                      {post.likedBy?.length || post.likes || 0} Like
                      {(post.likedBy?.length || post.likes || 0) > 1 ? "s" : ""}
                    </button>
                    <button
                      onClick={() =>
                        setShowReplies((prev) => ({
                          ...prev,
                          [post._id]: !prev[post._id],
                        }))
                      }
                      className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition text-sm font-medium"
                    >
                      <MessageSquare className="w-4 h-4" />{" "}
                      {post.replies?.length || 0} replies
                    </button>
                  </div>


                  {/* Replies */}
                  {showReplies[post._id] && (
                    <div className="mt-4 space-y-3">
                      {post.replies?.map((r: any) => (
                        <div key={r._id} className="bg-slate-50 p-3 rounded-lg">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium text-slate-800">
                                {r.author?.name || "Anonymous"}
                              </div>
                              <div className="text-sm text-slate-600">
                                {r.content}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {new Date(r.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button
                                onClick={() => handleLikeReply(post._id, r._id)}
                                className="text-sm text-slate-500 hover:text-yellow-500"
                              >
                                <ThumbsUp className="w-4 h-4 inline-block" />{" "}
                                {r.likedBy?.length || r.likes || 0}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-2 items-center">
                        <input
                          value={replyInputs[post._id] || ""}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                          placeholder="Write a reply..."
                          className="flex-1 p-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => handleReplySubmit(post._id)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-500" /> My Contributions
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3">
                <span className="text-slate-600">Posts made</span>
                <span className="font-medium text-blue-600">
                  {posts.filter((p) => p.author?._id === user?._id).length}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pb-1">
                <span className="text-slate-600">Points earned</span>
                <span className="font-bold text-blue-600">
                  {user?.points || 0} pts
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Pin className="w-4 h-4 text-red-500" fill="currentColor" /> Quick
              Post
            </h3>
            <textarea
              onClick={() => setIsPostModalOpen(true)}
              readOnly
              placeholder="Ask the community..."
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-24 cursor-pointer"
            ></textarea>
          </div>
        </div>
      </div>

      {/* NEW POST MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form
            onSubmit={handleCreatePost}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-slate-400" /> New
                Discussion Post
              </h3>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Course *
                </label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full p-3 border-2 border-blue-50 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 text-sm font-medium"
                >
                  {myEnrollments.map((enr: any) => {
                    const c = enr.course;
                    return (
                      <option key={c._id || c} value={c._id || c}>
                        {c.title}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="What is your question or topic?"
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <textarea
                    rows={6}
                    required
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Provide details for the community..."
                    className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm resize-none pb-8"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 flex items-center gap-4 bg-white text-sm">
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingPost}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-center disabled:opacity-50"
              >
                {submittingPost ? "Posting..." : "Post to Forum"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
