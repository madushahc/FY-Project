import { Search, Bell, Star } from 'lucide-react';

export default function TopNav({ pageName = "Dashboard", points = 1840, role = 'STUDENT' }: { pageName?: string, points?: number, role?: string }) {
  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
         <h2 className="text-xl font-medium text-slate-800">{pageName}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-64 hidden md:block">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search courses, activities..." 
             className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
           />
        </div>
        
        {/* Points Pill (only for Student) */}
        {role === 'STUDENT' && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full h-[36px]">
             <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
             <span className="text-sm font-bold text-blue-600">{points.toLocaleString()} XP</span>
             <div className="w-8 h-1.5 bg-blue-200 rounded-full ml-1 overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '80%' }}></div>
             </div>
          </div>
        )}

        {/* Notif */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        {/* Profile */}
        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
           {/* If we had an image, it would be here. Fallback to initials placeholder in Figma style */}
           <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${role}`} alt="avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
}
