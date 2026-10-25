import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  GraduationCap,
  Building2,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  Briefcase,
  ChevronRight,
  Code
} from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: () => void;
}

interface Chapter {
  id: number;
  time: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  highlights: string[];
  speechText: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    time: '0:00 - 0:25',
    title: 'AI Screening & Skill Assessment',
    shortTitle: 'Screening',
    subtitle: 'Identify core strengths and placement readiness',
    description: 'Every student begins with a comprehensive AI-driven technical and soft skill assessment that creates a verified skill matrix mapped directly to partner company criteria.',
    icon: Target,
    color: 'from-blue-600 to-indigo-600',
    badge: 'Stage 01',
    highlights: ['Adaptive technical testing', 'Role readiness score', 'Personalized learning blueprint'],
    speechText: 'Welcome to InterHive. Every candidate begins with an AI-driven skill evaluation mapped to company expectations.'
  },
  {
    id: 2,
    time: '0:25 - 0:55',
    title: '2-Month Intensive Industrial Training',
    shortTitle: '2M Training',
    subtitle: 'Hands-on project development with industry mentors',
    description: 'Undergo industry-focused training led by senior engineers and HR leaders. Work on production-grade stacks, agile sprints, and real codebase architectures.',
    icon: GraduationCap,
    color: 'from-indigo-600 to-purple-600',
    badge: 'Stage 02',
    highlights: ['Production tech stacks', 'Daily agile standups & code reviews', '1-on-1 industry mentorship'],
    speechText: 'Next is our two month industrial training. You work on production codebases with daily mentorship from industry leaders.'
  },
  {
    id: 3,
    time: '0:55 - 1:20',
    title: 'Partner Company Matching',
    shortTitle: 'Matching',
    subtitle: 'Algorithmic matching to 100+ MOU-backed hiring partners',
    description: 'Our matching engine pairs verified candidates with partner companies based on domain interest, assessed capabilities, and specific company hiring criteria.',
    icon: Building2,
    color: 'from-purple-600 to-pink-600',
    badge: 'Stage 03',
    highlights: ['100+ partner companies', 'MOU-backed placement pipelines', 'Zero cold resumes'],
    speechText: 'Stage three is automated matching with our network of over 100 partner companies actively hiring interns.'
  },
  {
    id: 4,
    time: '1:20 - 1:45',
    title: '4-Month Live Company Internship',
    shortTitle: '4M Internship',
    subtitle: 'Paid internship work on live enterprise deliverables',
    description: 'Join company engineering teams for four months of live project execution with daily attendance verification, manager guidance, and milestone reviews.',
    icon: Briefcase,
    color: 'from-pink-600 to-rose-600',
    badge: 'Stage 04',
    highlights: ['Real customer-facing deliverables', 'Stipend-backed roles', 'Manager performance appraisals'],
    speechText: 'Stage four is a four month live company internship, building real features with corporate teams.'
  },
  {
    id: 5,
    time: '1:45 - 2:00',
    title: 'Pre-Placement Offer (PPO) Conversion',
    shortTitle: 'PPO Outcome',
    subtitle: 'Transition directly from intern to full-time employee',
    description: 'Top-performing interns receive Pre-Placement Offers from the partner company, graduating directly into full-time career roles before college completion.',
    icon: Trophy,
    color: 'from-emerald-600 to-teal-600',
    badge: 'Stage 05',
    highlights: ['Full-time employment contracts', 'Above-average entry packages', 'Verified credentialing'],
    speechText: 'Finally, top-performing interns receive direct Pre-Placement Offers for full-time employment upon graduation.'
  }
];

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  onEnroll
}) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize SpeechSynthesis reference
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Voice narration handler
  const speakCurrentChapter = (chapterIdx: number) => {
    if (isMuted || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(CHAPTERS[chapterIdx].speechText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      synthRef.current.speak(utterance);
    } catch {
      // Ignore speech synthesis errors if unsupported
    }
  };

  // Auto-advance chapters every 6 seconds when playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    speakCurrentChapter(currentChapter);

    const stepTimeMs = 50;
    const chapterDurationMs = 6000;
    const increment = (stepTimeMs / chapterDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentChapter((ch) => {
            const nextCh = (ch + 1) % CHAPTERS.length;
            speakCurrentChapter(nextCh);
            return nextCh;
          });
          return 0;
        }
        return prev + increment;
      });
    }, stepTimeMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentChapter, isMuted]);

  const handleClose = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
    onClose();
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (synthRef.current) synthRef.current.cancel();
    } else {
      speakCurrentChapter(currentChapter);
    }
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      if (synthRef.current) synthRef.current.cancel();
      setIsMuted(true);
    } else {
      setIsMuted(false);
      speakCurrentChapter(currentChapter);
    }
  };

  const handleSelectChapter = (idx: number) => {
    setCurrentChapter(idx);
    setProgress(0);
    if (isPlaying) {
      speakCurrentChapter(idx);
    }
  };

  const handleRestart = () => {
    setCurrentChapter(0);
    setProgress(0);
    setIsPlaying(true);
    speakCurrentChapter(0);
  };

  if (!isOpen) return null;

  const active = CHAPTERS[currentChapter];
  const IconComponent = active.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={handleClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-4xl bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-700/70 shadow-2xl z-10 flex flex-col max-h-[92dvh] animate-in zoom-in-95 duration-200">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-black text-sm sm:text-base tracking-tight">
                  How InterHive Works
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-extrabold uppercase tracking-wide">
                  <Sparkles className="w-3 h-3" /> AI Overview
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium">
                The 6-month pathway to a Pre-Placement Offer (PPO)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close video"
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MAIN VIDEO SIMULATION STAGE */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[380px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between p-6 sm:p-8 overflow-hidden">
          
          {/* Ambient dynamic background lighting glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Stage Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-black tracking-wider">
              {active.badge} of 05
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMute}
                title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
              </button>
              <button
                type="button"
                onClick={handleRestart}
                title="Restart Walkthrough"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Stage Presentation Card */}
          <div className="relative z-10 my-auto max-w-2xl mx-auto w-full text-center space-y-4 py-4">
            
            {/* Stage Icon */}
            <div className="inline-flex items-center justify-center">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${active.color} text-white flex items-center justify-center shadow-xl shadow-blue-500/25 ring-4 ring-white/10 transform hover:scale-105 transition-all`}>
                <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                {active.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-blue-400">
                {active.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-xl mx-auto">
              {active.description}
            </p>

            {/* Stage Highlights Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {active.highlights.map((highlight, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-white text-[11px] font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{highlight}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Chapter Progress Indicators */}
          <div className="relative z-10 grid grid-cols-5 gap-2 pt-4">
            {CHAPTERS.map((ch, idx) => {
              const isActive = idx === currentChapter;
              const isPassed = idx < currentChapter;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectChapter(idx)}
                  className="group flex flex-col text-left focus:outline-none cursor-pointer"
                >
                  {/* Progress Line */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full transition-all duration-100 ${
                        isPassed
                          ? 'w-full bg-blue-500'
                          : isActive
                          ? 'bg-blue-400'
                          : 'w-0'
                      }`}
                      style={{ width: isActive ? `${progress}%` : undefined }}
                    />
                  </div>
                  {/* Label */}
                  <span
                    className={`text-[10px] font-bold truncate transition-colors ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {ch.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* BOTTOM CONTROLS & ENROLL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4 shrink-0">
          
          {/* Play/Pause Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  <span>Play</span>
                </>
              )}
            </button>

            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              Chapter {currentChapter + 1} of 5 — {active.time}
            </span>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2.5 ml-auto">
            {currentChapter < CHAPTERS.length - 1 ? (
              <button
                type="button"
                onClick={() => handleSelectChapter(currentChapter + 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                handleClose();
                if (onEnroll) onEnroll();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Join PPO Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
