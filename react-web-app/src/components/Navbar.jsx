import React, { useState } from 'react';
import { User, Settings, LogOut} from 'lucide-react';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold">K</div>
        <span className="text-xl font-bold tracking-tight">KenNunes<span className="text-orange-500">.</span></span>
      </div>

      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-10 w-10 rounded-full border border-white/20 overflow-hidden hover:border-orange-500 transition-all focus:outline-none"
        >
          {/* You can replace this with your actual photo from Drexel or Amazon profile */}
          <div className="bg-gray-700 h-full w-full flex items-center justify-center text-gray-400">
            <User size={20} />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-gray-800 border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-2 border-b border-white/5 mb-2">
              <p className="text-sm font-semibold">Ken Nunes</p>
              <p className="text-xs text-gray-500">kn644@drexel.edu</p>
            </div>
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
              <User size={16} /> My Profile
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
              <Settings size={16} /> Settings
            </a>
            <div className="border-t border-white/5 mt-2 pt-2">
              <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                <LogOut size={16} /> Sign Out
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}