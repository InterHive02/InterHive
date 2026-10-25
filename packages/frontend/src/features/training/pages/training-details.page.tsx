import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Clock, Check, Sparkles, ChevronRight, Play } from 'lucide-react';
import { useAuth } from '../../../api/hooks/use-auth';
import { toast } from 'react-hot-toast';

export const TrainingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Curriculum repository
  const moduleCurriculum: Record<string, any> = {
    'prog-python': {
      id: 'prog-python',
      title: 'Python for Industry',
      subtitle: 'Modern Idiomatic Python, OOP, Testing & Packaging',
      description: 'Master practical Python 3, object-oriented architecture, data manipulation, and unit testing for backend systems.',
      lessons: [
        {
          id: 'les-py-1',
          title: 'Environment Setup & Virtualenv Configuration',
          duration: '35 mins',
          summary: 'Configuring Python 3.11+, Poetry/Pipenv dependency management, pyproject.toml, and Ruff linter setup.',
        },
        {
          id: 'les-py-2',
          title: 'Data Structures & Pythonic Idioms',
          duration: '45 mins',
          summary: 'List comprehensions, generator expressions, dictionary merging, sets, and bisect algorithm usage.',
        },
        {
          id: 'les-py-3',
          title: 'Object-Oriented Design & Protocols',
          duration: '50 mins',
          summary: 'Classes, dunder methods (__enter__, __exit__, __repr__), dataclasses, and abstract base classes (ABCs).',
        },
        {
          id: 'les-py-4',
          title: 'Automated Testing with PyTest & Mocking',
          duration: '40 mins',
          summary: 'Writing deterministic unit tests, fixtures, mocking external API calls, and calculating coverage metrics.',
        },
        {
          id: 'les-py-5',
          title: 'FastAPI Microservice Endpoints',
          duration: '60 mins',
          summary: 'Building asynchronous REST API endpoints with Pydantic schemas, dependency injection, and Swagger docs.',
        },
      ],
    },
    'prog-web': {
      id: 'prog-web',
      title: 'Enterprise Web Development',
      subtitle: 'TypeScript, React, Node.js & REST Microservices',
      description: 'Production web application engineering with modern React hooks, TypeScript, and NestJS APIs.',
      lessons: [
        {
          id: 'les-web-1',
          title: 'TypeScript Type Safety & Generics',
          duration: '40 mins',
          summary: 'Mastering union types, discriminated unions, utility types (Pick, Omit, Partial), and generics in components.',
        },
        {
          id: 'les-web-2',
          title: 'Modern React Architecture & Custom Hooks',
          duration: '50 mins',
          summary: 'Decoupling business logic into custom hooks, handling asynchronous states, and avoiding re-render waterfalls.',
        },
        {
          id: 'les-web-3',
          title: 'RESTful NestJS Microservices',
          duration: '55 mins',
          summary: 'Controllers, services, modules, dependency injection, and class-validator DTO pipelines.',
        },
        {
          id: 'les-web-4',
          title: 'Database Integration with PostgreSQL & Prisma',
          duration: '45 mins',
          summary: 'Writing schema migrations, relations, indexes, and avoiding N+1 query bottlenecks.',
        },
      ],
    },
    'prog-dsa': {
      id: 'prog-dsa',
      title: 'Data Structures & Problem Solving',
      subtitle: 'Algorithmic Patterns, PostgreSQL & System Design',
      description: 'Algorithmic efficiency, relational database schema optimization, indexing, and scalable design.',
      lessons: [
        {
          id: 'les-dsa-1',
          title: 'Time & Space Complexity Profiling',
          duration: '30 mins',
          summary: 'Big-O notation, amortized analysis, auxiliary memory, and recursion call stack depth.',
        },
        {
          id: 'les-dsa-2',
          title: 'Hash Maps & Two-Pointer Strategies',
          duration: '45 mins',
          summary: 'Two Sum, Subarray Sum equals K, Fast/Slow pointers for linked lists, and sliding window maximum.',
        },
        {
          id: 'les-dsa-3',
          title: 'Trees & Graph Traversal (BFS & DFS)',
          duration: '50 mins',
          summary: 'Binary Search Trees, Lowest Common Ancestor, Topological Sort, and Dijkstra shortest path.',
        },
      ],
    },
    'prog-workflow': {
      id: 'prog-workflow',
      title: 'Professional Engineering Skills',
      subtitle: 'Git PRs, Code Reviews, Agile Standups & CI/CD',
      description: 'Workplace engineering etiquette, pull request workflows, Docker containerization, and sprint tracking.',
      lessons: [
        {
          id: 'les-wf-1',
          title: 'Git Branching & Conventional Commits',
          duration: '30 mins',
          summary: 'Feature branches, interactive rebase, squashing, cherry-picking, and standard commit message formats.',
        },
        {
          id: 'les-wf-2',
          title: 'Writing High-Impact Pull Requests',
          duration: '40 mins',
          summary: 'Structuring PR descriptions with before/after screenshots, test plans, and handling review feedback.',
        },
        {
          id: 'les-wf-3',
          title: 'Dockerizing Applications & CI Pipelines',
          duration: '45 mins',
          summary: 'Writing multi-stage Dockerfiles, caching dependencies, and running GitHub Actions CI workflows.',
        },
      ],
    },
  };

  const currentProgram = moduleCurriculum[id || ''] || moduleCurriculum['prog-python'];
  const storageKey = user?.id ? `interhive_training_${user.id}` : 'interhive_training';

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const state = JSON.parse(raw);
        return state[currentProgram.id]?.completedLessons || [];
      }
    } catch (e) {
      return [];
    }
    return [];
  });

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const totalLessons = currentProgram.lessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleToggleLesson = (lessonId: string) => {
    const isCompleted = completedLessonIds.includes(lessonId);
    let updated: string[];
    if (isCompleted) {
      updated = completedLessonIds.filter((lid) => lid !== lessonId);
    } else {
      updated = [...completedLessonIds, lessonId];
      toast.success('Lesson marked complete! Progress updated.');
    }
    setCompletedLessonIds(updated);

    // Save state scoped to user
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(storageKey);
        const state = raw ? JSON.parse(raw) : {};
        const newProgress = Math.round((updated.length / totalLessons) * 100);
        state[currentProgram.id] = {
          completedLessons: updated,
          progress: newProgress,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (e) {}
    }
  };

  const activeLesson = currentProgram.lessons[activeLessonIndex] || currentProgram.lessons[0];

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/training')}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
              Industrial Training Module
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {completedCount} of {totalLessons} lessons finished
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {currentProgram.title}
          </h1>
        </div>

        {/* Progress Badge */}
        <div className="text-right">
          <span className="text-lg font-black text-blue-600 dark:text-blue-400">{progressPercent}%</span>
          <span className="block text-[10px] font-bold text-slate-400">Completed</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Main Grid: Active Lesson View + Syllabus List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Lesson Content */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Lesson {activeLessonIndex + 1} of {totalLessons}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeLesson?.duration}
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {activeLesson?.title}
            </h2>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider">
                Module Objectives & Key Takeaways
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeLesson?.summary}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-bold text-blue-700 dark:text-blue-300 block">💡 Industrial Practice Tip:</span>
              <p>Review the practical code examples in your local sandbox before marking this section as complete.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveLessonIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeLessonIndex === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={() => handleToggleLesson(activeLesson?.id)}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                completedLessonIds.includes(activeLesson?.id)
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
              }`}
            >
              {completedLessonIds.includes(activeLesson?.id) ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Lesson Complete</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveLessonIndex((prev) => Math.min(totalLessons - 1, prev + 1))}
              disabled={activeLessonIndex === totalLessons - 1}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        {/* Syllabus Lessons List */}
        <div className="lg:col-span-5 bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Curriculum Syllabus
          </h3>

          <div className="space-y-2">
            {currentProgram.lessons.map((les: any, idx: number) => {
              const isDone = completedLessonIds.includes(les.id);
              const isActive = activeLessonIndex === idx;

              return (
                <div
                  key={les.id}
                  onClick={() => setActiveLessonIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700'
                      : 'bg-slate-50 dark:bg-[#1A1D33] border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLesson(les.id);
                      }}
                      className="p-1 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold truncate ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {idx + 1}. {les.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">{les.duration}</span>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
