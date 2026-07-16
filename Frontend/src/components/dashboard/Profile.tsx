"use client";

import React, { useState, useEffect } from "react";
import { User, Bell, Shield } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import api from "@/lib/api";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Personal Info");
  const { user, initializeUser, updateProfile } = useUserStore();
  const [notifications, setNotifications] = useState<any[]>([]);

  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    assignmentsSubmitted: 0,
    quizzesAttempted: 0,
    forumPosts: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    department: "",
    phoneNumber: "",
    jobTitle: "",
    location: "",
    website: "",
    bio: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError("");
    setSecuritySuccess("");

    if (newPassword.length < 6) {
      setSecurityError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.put("/users/change-password", {
        currentPassword,
        newPassword,
      });

      setSecuritySuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setSecurityError(
        err.response?.data?.message || "Failed to change password. Please check your credentials."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    initializeUser();
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };
    fetchNotifications();
  }, [initializeUser]);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role === "Student") {
        setLoadingStats(true);
        try {
          const res = await api.get("/users/profile/stats");
          setStats(res.data || {
            coursesEnrolled: 0,
            assignmentsSubmitted: 0,
            quizzesAttempted: 0,
            forumPosts: 0
          });
        } catch (err) {
          console.error("Failed to load student stats", err);
        } finally {
          setLoadingStats(false);
        }
      }
    };
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        university: user.university || "",
        department: user.department || "",
        phoneNumber: user.phoneNumber || "",
        jobTitle: user.jobTitle || "",
        location: user.location || "",
        website: user.website || "",
        bio: user.bio || "",
      });
      if (user.profilePhoto) {
        setProfilePhotoUrl(user.profilePhoto);
      }
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("university", formData.university);
      data.append("department", formData.department);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("jobTitle", formData.jobTitle);
      data.append("location", formData.location);
      data.append("website", formData.website);
      data.append("bio", formData.bio);
      if (profilePhotoFile) {
        data.append("profilePhoto", profilePhotoFile);
      }

      await updateProfile(data);
      setSaveMessage("Profile updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err: any) {
      setSaveMessage(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20 mt-2 flex flex-col h-full overflow-hidden">
      {/* Banner */}
      <div className="w-full h-48 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <h1 className="text-xl font-medium opacity-90 relative">
          Manage your account, preferences and security settings
        </h1>

        <div className="flex items-end gap-5 relative">
          <div className="w-24 h-24 rounded-full bg-[#2A61D8] border-4 border-white flex items-center justify-center text-4xl font-bold shadow-sm z-10 text-white overflow-hidden">
            {profilePhotoUrl ? (
              <img
                src={
                  profilePhotoUrl.startsWith("blob:")
                    ? profilePhotoUrl
                    : `http://localhost:5000${profilePhotoUrl}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="mb-2">
            <h2 className="text-2xl font-bold">{user?.name || "Loading..."}</h2>
            <p className="text-blue-100 text-sm mb-2 opacity-90">
              {user?.role || "Role"}{user?.role !== "Admin" && user?.university ? ` · ${user.university}` : ""}
            </p>
            {user?.role === "Student" && (
              <div className="flex gap-2 text-xs font-bold">
                <div className="px-3 py-1 bg-white text-blue-600 rounded-full flex items-center gap-1 shadow-sm">
                  Level {Math.floor((user?.points || 0) / 200) + 1}{" "}
                  <span>⭐</span>
                </div>
                <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full shadow-sm">
                  {user?.points || 0} XP
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start pb-8">
        {/* Left Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col p-5 space-y-6 sticky top-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Account Settings
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("Personal Info")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "Personal Info" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <User className="w-4 h-4" /> Personal Info
              </button>
              <button
                onClick={() => setActiveTab("Notifications")}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "Notifications" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" /> Notifications
                </div>
              </button>
              <button
                onClick={() => setActiveTab("Security")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "Security" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Shield className="w-4 h-4" /> Security
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-lg text-sm hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full lg:w-auto space-y-6">
          {activeTab === "Personal Info" && (
            <>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className="font-bold text-slate-800 mb-6">Profile Photo</h3>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-[#2A61D8] text-white flex items-center justify-center text-3xl font-bold overflow-hidden">
                    {profilePhotoUrl ? (
                      <img
                        src={
                          profilePhotoUrl.startsWith("blob:")
                            ? profilePhotoUrl
                            : `http://localhost:5000${profilePhotoUrl}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="photo-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setProfilePhotoFile(e.target.files[0]);
                          setProfilePhotoUrl(
                            URL.createObjectURL(e.target.files[0]),
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor="photo-upload"
                      className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition mb-1 cursor-pointer"
                    >
                      Change Photo
                    </label>
                    <p className="text-xs text-slate-400">
                      JPG, PNG or GIF · max 5MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {user?.role !== "Admin" && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        University
                      </label>
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {user?.role !== "Admin" && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+94 77 123 4567"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="Senior Lecturer"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {user?.role !== "Admin" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Colombo, Sri Lanka"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://example.com"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                {user?.role !== "Admin" && (
                  <div className="space-y-2 mb-8">
                    <label className="text-sm font-bold text-slate-700">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    ></textarea>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  {saveMessage && (
                    <span
                      className={`text-sm font-medium ${saveMessage.includes("Failed") ? "text-red-500" : "text-green-500"}`}
                    >
                      {saveMessage}
                    </span>
                  )}
                </div>
              </div>

              {user?.role === "Student" && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                  <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
                  {loadingStats ? (
                    <div className="h-20 flex items-center justify-center text-xs text-slate-400 font-semibold animate-pulse">
                      Loading statistics...
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {stats.coursesEnrolled}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          Courses Enrolled
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {stats.assignmentsSubmitted}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          Assignments Submitted
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {stats.quizzesAttempted}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          Quizzes Attempted
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {stats.forumPosts}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          Forum Posts
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "Notifications" && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-medium">
                    You have no notifications.
                  </div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div
                      key={idx}
                      className={`p-5 flex gap-4 hover:bg-slate-50 transition relative ${!notif.isRead ? "bg-blue-50/30" : ""}`}
                    >
                      {!notif.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                      )}

                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 bg-slate-100">
                        {notif.type === "Assignment"
                          ? "📝"
                          : notif.type === "Quiz"
                            ? "⏳"
                            : notif.type === "Badge"
                              ? "🏆"
                              : "🔔"}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                          <h4
                            className={`text-sm font-bold flex items-center gap-2 ${!notif.isRead ? "text-slate-800" : "text-slate-700"}`}
                          >
                            {notif.title}
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                            )}
                          </h4>
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 mb-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h3 className="font-bold text-slate-800 mb-2">Change Password</h3>
              <p className="text-xs text-slate-400 mb-6">
                For security, you must confirm your current password to set a new password.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                {securityError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg text-center">
                    {securityError}
                  </div>
                )}
                {securitySuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium rounded-lg text-center">
                    {securitySuccess}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 mt-4"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
