import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="InterHive Logo"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
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
        <nav aria-label="Desktop navigation" className="hidden md:flex items-center gap-6 lg:gap-7 font-bold text-xs sm:text-sm text-slate-600">
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
            to="/programs"
            className={`relative py-1 transition-colors ${
              activePage === 'programs'
                ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold'
                : 'hover:text-blue-600'
            }`}
          >
            PPO Program
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

        {/* Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 min-h-[40px] rounded-full font-bold text-xs sm:text-sm text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center"
          >
            Login
          </Link>

          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2 min-h-[40px] rounded-full font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            Get Started
          </button>

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
          {/* Mobile Nav Links */}

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
              to="/programs"
              onClick={() => setIsMobileNavOpen(false)}
              className={`px-3 py-2.5 rounded-xl flex items-center justify-between ${
                activePage === 'programs'
                  ? 'bg-blue-50 text-blue-600 font-extrabold'
                  : 'hover:bg-slate-50 hover:text-blue-600 transition-colors'
              }`}
            >
              <span>PPO Program</span>
              {activePage === 'programs' && (
                <span className="text-xs text-blue-600 font-extrabold">Active</span>
              )}
            </Link>
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                navigate('/register');
              }}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>For Interns</span>
              <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Get Started</span>
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
