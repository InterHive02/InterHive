import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

interface PublicNavbarProps {
  activePage?: 'home' | 'about' | 'programs' | 'contact';
  onOpenInternshipModal: () => void;
  onOpenCompanyModal: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  activePage = 'home',
  onOpenInternshipModal,
  onOpenCompanyModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/programs?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <span className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  H
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                Inter<span className="text-blue-600">Hive</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wide mt-0.5">
                From Intern to Industry
              </span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav aria-label="Desktop navigation" className="hidden md:flex items-center gap-7 font-bold text-xs sm:text-sm text-slate-600">
          <Link
            to="/"
            className={`relative py-1 transition-colors ${
              activePage === 'home'
                ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold'
                : 'hover:text-blue-600'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`relative py-1 transition-colors ${
              activePage === 'about'
                ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold'
                : 'hover:text-blue-600'
            }`}
          >
            About
          </Link>
          <Link
            to="/programs"
            className={`relative py-1 transition-colors ${
              activePage === 'programs'
                ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold'
                : 'hover:text-blue-600'
            }`}
          >
            Programs
          </Link>
          <button
            onClick={onOpenInternshipModal}
            className="hover:text-blue-600 transition-colors cursor-pointer font-bold"
          >
            For Interns
          </button>
          <button
            onClick={onOpenCompanyModal}
            className="hover:text-blue-600 transition-colors cursor-pointer font-bold"
          >
            For Companies
          </button>
          <Link
            to="/contact"
            className={`relative py-1 transition-colors ${
              activePage === 'contact'
                ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold'
                : 'hover:text-blue-600'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search programs, skills..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/90 border border-slate-200/80 rounded-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white transition-all shadow-inner"
          />
        </form>

        {/* Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 sm:px-5 py-2 min-h-[44px] rounded-full font-extrabold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-900/10 hover:shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Login</span>
            <span className="text-[10px] text-slate-400">→</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 shadow-2xl px-5 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search programs, skills..."
              className="w-full pl-10 pr-4 py-2.5 min-h-[44px] bg-slate-100/90 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white transition-all shadow-inner"
            />
          </form>

          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-1 font-bold text-sm text-slate-700">
            <Link
              to="/"
              onClick={() => setIsMobileNavOpen(false)}
              className={`px-3 py-2.5 rounded-xl flex items-center justify-between ${
                activePage === 'home'
                  ? 'bg-blue-50 text-blue-600 font-extrabold'
                  : 'hover:bg-slate-50 hover:text-blue-600 transition-colors'
              }`}
            >
              <span>Home</span>
              {activePage === 'home' && (
                <span className="text-xs text-blue-600 font-extrabold">Active</span>
              )}
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileNavOpen(false)}
              className={`px-3 py-2.5 rounded-xl flex items-center justify-between ${
                activePage === 'about'
                  ? 'bg-blue-50 text-blue-600 font-extrabold'
                  : 'hover:bg-slate-50 hover:text-blue-600 transition-colors'
              }`}
            >
              <span>About</span>
              {activePage === 'about' && (
                <span className="text-xs text-blue-600 font-extrabold">Active</span>
              )}
            </Link>
            <Link
              to="/programs"
              onClick={() => setIsMobileNavOpen(false)}
              className={`px-3 py-2.5 rounded-xl flex items-center justify-between ${
                activePage === 'programs'
                  ? 'bg-blue-50 text-blue-600 font-extrabold'
                  : 'hover:bg-slate-50 hover:text-blue-600 transition-colors'
              }`}
            >
              <span>Programs</span>
              {activePage === 'programs' && (
                <span className="text-xs text-blue-600 font-extrabold">Active</span>
              )}
            </Link>
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                onOpenInternshipModal();
              }}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>For Interns</span>
              <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Apply</span>
            </button>
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                onOpenCompanyModal();
              }}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>For Companies</span>
              <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Hire</span>
            </button>
            <Link
              to="/contact"
              onClick={() => setIsMobileNavOpen(false)}
              className={`px-3 py-2.5 rounded-xl flex items-center justify-between ${
                activePage === 'contact'
                  ? 'bg-blue-50 text-blue-600 font-extrabold'
                  : 'hover:bg-slate-50 hover:text-blue-600 transition-colors'
              }`}
            >
              <span>Contact</span>
              {activePage === 'contact' && (
                <span className="text-xs text-blue-600 font-extrabold">Active</span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
