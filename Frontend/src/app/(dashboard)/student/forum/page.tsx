"use client";

import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Medal, Pin, MessageCircle, X } from 'lucide-react';

export default function DiscussionForum() {
  const [activeTab, setActiveTab] = useState('All Posts');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const posts = [
    {
      id: 1,
      author: 'Kavitha Perera',
      initial: 'K',
      time: '2 hours ago',
      title: 'How does merge sort handle duplicate values?',
      excerpt: "I'm confused about how duplicate values are handled during the merge step. Can someone cla...",
      likes: 12,
      replies: 3,
      color: 'bg-blue-600'
    },
    {
      id: 2,
      author: 'Nimal Silva',
      initial: 'N',
      time: '5 hours ago',
      title: 'Resource: Quick Sort visual animation tool — must see!',
      excerpt: "Found this amazing visual tool for understanding quick sort partitioning. Link: visualalgo...",
      likes: 28,
      replies: 7,
      color: 'bg-emerald-500'
    },
    {
      id: 3,
      author: 'Suresh Bandara',
      initial: 'S',
      time: '1 day ago',
      title: 'Confused about 3NF vs BCNF — when to use which?',
      excerpt: "Can anyone explain the practical difference between 3NF and BCNF? The textbook definition ...",
      likes: 9,
      replies: 5,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Discussion Forum</h2>

      <div className="flex gap-4 mb-6">
         <div className="flex bg-white border border-slate-200 rounded-lg p-1">
            {['All Posts', 'My Posts'].map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                   activeTab === tab ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                  {tab}
               </button>
            ))}
         </div>
         <button 
            onClick={() => setIsPostModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
         >
            + New Post
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Posts Feed */}
         <div className="lg:col-span-2 space-y-4">
            {posts.map(post => (
               <div key={post.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${post.color}`}>
                        {post.initial}
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-slate-800">{post.author}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-400">{post.time}</span>
                     </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-slate-800 mb-2">{post.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{post.excerpt}</p>
                  
                  <div className="flex items-center gap-6">
                     <button className="flex items-center gap-1.5 text-slate-400 hover:text-yellow-500 transition text-sm font-medium">
                        <ThumbsUp className="w-4 h-4" /> {post.likes}
                     </button>
                     <button className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition text-sm font-medium">
                        <MessageSquare className="w-4 h-4" /> {post.replies} replies
                     </button>
                  </div>
               </div>
            ))}
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
                     <span className="font-medium text-blue-600">7</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3">
                     <span className="text-slate-600">Replies given</span>
                     <span className="font-medium text-blue-600">23</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3">
                     <span className="text-slate-600">Likes received</span>
                     <span className="font-medium text-blue-600">64</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-1">
                     <span className="text-slate-600">Points earned</span>
                     <span className="font-bold text-blue-600">+35 pts</span>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
               <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Pin className="w-4 h-4 text-red-500" fill="currentColor" /> Quick Post
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
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col overflow-hidden">
               {/* Header */}
               <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <MessageCircle className="w-5 h-5 text-slate-400" /> New Discussion Post
                  </h3>
                  <button onClick={() => setIsPostModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition">
                     <X className="w-4 h-4" />
                  </button>
               </div>
               
               <div className="p-6 space-y-5">
                  <div>
                     <label className="block text-xs font-bold text-slate-800 mb-2">Post Title *</label>
                     <input type="text" defaultValue="How does merge sort handle duplicate values?" className="w-full p-3 border-2 border-blue-500 rounded-xl focus:outline-none font-bold text-slate-800 text-sm" />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-800 mb-2">Description *</label>
                     <div className="relative">
                        <textarea rows={6} defaultValue="I am confused about how duplicate values are handled during the merge step.&#10;When I trace through the algorithm manually, the order seems to change.&#10;Can someone clarify this with an example?" className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-sm resize-none pb-8"></textarea>
                        <span className="absolute bottom-3 right-4 text-[10px] font-bold text-slate-400">420/1000</span>
                     </div>
                  </div>
               </div>

               {/* Footer */}
               <div className="p-5 border-t border-slate-100 flex items-center gap-4 bg-white text-sm">
                  <button onClick={() => setIsPostModalOpen(false)} className="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition">
                     Cancel
                  </button>
                  <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-center">
                     Post to Forum (+5 pts)
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
