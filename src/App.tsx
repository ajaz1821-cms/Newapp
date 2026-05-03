/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Lock, 
  ChevronRight, 
  LogOut, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  Upload, 
  MessageSquare,
  ClipboardList,
  GraduationCap,
  MapPin,
  Bell,
  X,
  Plus,
  Send,
  Loader2,
  Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Firebase imports
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  updateDoc, 
  doc,
  increment,
  Timestamp
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './lib/firebase';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const PERFORMANCE_DATA = [
  { name: 'Term 1', score: 82 },
  { name: 'Term 2', score: 85 },
  { name: 'Term 3', score: 89 },
  { name: 'Final', score: 92 },
];

const TASKS = [
  { id: 1, title: 'Math Calculus Assignment', status: 'Pending', type: 'Homework' },
  { id: 2, title: 'Physics Lab Report', status: 'Completed', type: 'Classwork' },
  { id: 3, title: 'History Essay: World War II', status: 'Pending', type: 'Homework' },
];

const HOLIDAYS = [
  { date: 'May 15', name: 'Summer Break Begins' },
  { date: 'June 10', name: 'Annual Sports Day' },
];

// --- Components ---

const GlassCard = ({ children, className, delay = 0, noHover = false }: { children: React.ReactNode, className?: string, delay?: number, noHover?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={noHover ? {} : { 
      y: -8, 
      transition: { duration: 0.3, ease: "easeOut" }
    }}
    transition={{ duration: 0.5, delay }}
    style={{ perspective: "1000px" }}
    className={cn(
      "relative group backdrop-blur-3xl bg-white/60 border border-white/80 rounded-[2.5rem] p-6 shadow-2xl shadow-blue-500/5 overflow-hidden",
      className
    )}
  >
    {/* Inner Shimmer Effect */}
    {!noHover && (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      </div>
    )}
    
    {/* Content Container */}
    <div className="relative z-10">
      {children}
    </div>

    {/* Dynamic Border Glow */}
    {!noHover && (
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/20 rounded-[2.5rem] transition-colors duration-500" />
    )}
  </motion.div>
);

const ThreeDIcon = ({ icon: Icon, colorClass = "text-blue-600", bgClass = "bg-blue-100/50" }: { icon: any, colorClass?: string, bgClass?: string }) => {
  return (
    <motion.div 
      whileHover="hover"
      className="relative w-12 h-12 flex items-center justify-center isolate"
    >
      {/* Background Glow Layer */}
      <motion.div 
        variants={{
          hover: { scale: 1.4, opacity: 0.8, rotate: 15 }
        }}
        className={cn("absolute inset-0 rounded-2xl blur-xl opacity-40 transition-colors", bgClass)}
      />
      
      {/* Glass Plate Layer */}
      <motion.div 
        variants={{
          hover: { rotateX: 15, rotateY: -15, translateZ: 10, scale: 1.1 }
        }}
        className="absolute inset-0 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-md shadow-lg"
      />
      
      {/* Floating Icon Layer */}
      <motion.div
        variants={{
          hover: { translateZ: 30, scale: 1.2, x: 2, y: -2 }
        }}
        className="relative z-10"
      >
        <Icon className={cn("w-6 h-6", colorClass)} />
      </motion.div>
    </motion.div>
  );
};

const BackgroundMesh = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
      {/* Interactive Mesh */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="mesh" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-600" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mesh)" />
        </svg>
      </div>

      {/* Floating Dynamic Blobs */}
      <motion.div 
        animate={{
          x: mousePos.x * 0.05,
          y: mousePos.y * 0.05,
        }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/10 blur-[150px]" 
      />
      <motion.div 
        animate={{
          x: -mousePos.x * 0.08,
          y: -mousePos.y * 0.08,
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/10 blur-[150px]" 
      />
      <motion.div 
        animate={{
          x: (mousePos.x - window.innerWidth/2) * 0.1,
          y: (mousePos.y - window.innerHeight/2) * 0.1,
        }}
        className="absolute top-[30%] left-[30%] w-[100px] h-[100px] rounded-full bg-white opacity-40 blur-[40px]" 
      />
    </div>
  );
};

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'holiday' | 'general';
  timestamp: any;
  read: boolean;
  userId: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);
  const prevNotifCount = useRef(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      const savedUser = localStorage.getItem('student_portal_user');
      if (user && savedUser) {
        setUsername(savedUser);
        setIsLoggedIn(true);
      } else if (!user && !savedUser) {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn && username) {
      // Listen for notifications for this user (or global ones)
      const q = query(
        collection(db, 'notifications'),
        where('userId', 'in', [username, 'all']),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notification[];
        
        if (notifsData.length > prevNotifCount.current && prevNotifCount.current !== 0) {
          const newest = notifsData[0];
          if (!newest.read) {
            setActiveToast(newest);
            setTimeout(() => setActiveToast(null), 5000);
          }
        }
        
        setNotifications(notifsData);
        prevNotifCount.current = notifsData.length;
      }, (err) => {
        console.warn("Firestore listener error (Auth likely not enabled):", err);
      });

      return () => unsubscribe();
    }
  }, [isLoggedIn, username]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      try {
        await updateDoc(doc(db, 'notifications', n.id), { read: true });
      } catch (e) {
        console.error("Failed to update notification", e);
      }
    }
  };

  const handleTestNotification = async (type: 'assignment' | 'holiday') => {
    try {
      await addDoc(collection(db, 'notifications'), {
        title: type === 'assignment' ? 'New Assignment Uploaded' : 'New Holiday Announced',
        message: type === 'assignment' 
          ? 'Teacher uploaded "Advanced Physics: Thermodynamics"' 
          : 'School will remain closed on Oct 5th for Dussehra.',
        type,
        timestamp: serverTimestamp(),
        read: false,
        userId: username
      });
    } catch (e) {
      console.error("Error adding notification. Ensure Anonymous Auth is enabled in Firebase Console.", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = (username === 'ajaz1821' && password === 'mylove') || 
                    (username === 'masoom21' && password === 'king11');

    if (isValid) {
      try {
        await signInAnonymously(auth);
        localStorage.setItem('student_portal_user', username);
        setIsLoggedIn(true);
        setError('');
      } catch (err) {
        console.error("Firebase Auth Error:", err);
        // Fallback: navigation success even if real-time features fail
        localStorage.setItem('student_portal_user', username);
        setIsLoggedIn(true);
        setError('');
      }
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Signout error", e);
    }
    localStorage.removeItem('student_portal_user');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setNotifications([]);
  };

  const studentName = username === 'masoom21' ? 'Masoom' : 'Ajaz';

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemInstruction = `You are a friendly AI companion for a student named ${studentName} at the Academy of Excellence. 
      Act like a close friend who knows everything about their academic life. 
      
      Student Info:
      - Name: ${studentName}
      - Class: XII-A
      - Roll Number: #1821
      - Attendance: 92%
      - Rank: #04
      - Performance: Math (95/100, A+), Physics (88/100, A), English (92/100, A+).
      - Recent Trend: 5% gain since last term.
      - Holidays: 
        1. May 15: Summer Break Begins
        2. June 10: Annual Sports Day
      - Tasks:
        1. Math Calculus (Pending)
        2. Physics Lab Report (Completed)
        3. History Essay (Pending)
      
      CRITICAL RULES:
      1. Always end EVERY SINGLE answer with exactly this phrase: "Is there any other thing you want to know -:("
      2. Be warm, supportive, and conversational.
      3. Use the student's name occasionally.
      4. If they ask about future events/data not listed, say you'll check with the admin or make a friendly suggestion.
      5. Current date is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction,
        }
      });

      const botResponse = response.text || "Sorry, I'm feeling a bit sleepy right now. Could you ask me again? Is there any other thing you want to know -:(";
      setChatMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'bot', content: "Oops, something went wrong. I might need a quick recharge! Is there any other thing you want to know -:(" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 selection:bg-blue-500/30">
      <BackgroundMesh />
      
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <GlassCard className="w-full max-w-md p-10 text-center space-y-8 bg-white/60 border-white/80 ring-1 ring-white/40" noHover>
              <div className="space-y-4">
                <motion.div 
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-block p-4 rounded-3xl bg-gradient-to-tr from-blue-600 to-blue-400 shadow-xl shadow-blue-500/20 mb-2"
                >
                  <GraduationCap className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-blue-800">A.O.E PORTAL</h1>
                  <p className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] mt-1 opacity-80">Academy of Excellence</p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">User ID</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter User ID"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold text-center">
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all"
                >
                  Verify Credentials
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-24 pt-20 px-4 max-w-7xl mx-auto space-y-6"
          >
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-7xl mx-auto backdrop-blur-3xl bg-white/60 border border-white/80 rounded-3xl px-6 py-3 flex items-center justify-between shadow-2xl shadow-blue-500/5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-xl">
                    <GraduationCap className="text-white w-5 h-5" />
                  </div>
                  <span className="font-extrabold tracking-tight text-lg text-blue-700">A.O.E PORTAL</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Notification Center */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        if (!showNotifications) markAllAsRead();
                      }}
                      className="p-2 rounded-xl hover:bg-blue-50 transition-colors relative group"
                    >
                      <Bell className={cn("w-5 h-5", unreadCount > 0 ? "text-emerald-500" : "text-slate-400")} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-80 backdrop-blur-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                        >
                          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-sm text-blue-700">Notifications</h3>
                            <button onClick={() => setShowNotifications(false)}>
                              <X className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                              <div className="p-8 text-center text-slate-300 text-xs">No notifications yet</div>
                            ) : (
                              notifications.map((n) => (
                                <div key={n.id} className={cn("p-4 border-b border-slate-50 last:border-0 hover:bg-blue-50/50 transition-colors", !n.read && "bg-blue-50/30")}>
                                  <div className="flex gap-3">
                                    <div className={cn("mt-1 w-2 h-2 rounded-full shrink-0", 
                                      n.type === 'assignment' ? 'bg-blue-500' : 'bg-emerald-500'
                                    )} />
                                    <div className="space-y-1">
                                      <p className="text-xs font-bold text-blue-700">{n.title}</p>
                                      <p className="text-[10px] text-slate-500 leading-relaxed">{n.message}</p>
                                      <p className="text-[9px] text-slate-400 font-mono">
                                        {n.timestamp?.toDate ? n.timestamp.toDate().toLocaleString() : 'Just now'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="w-px h-4 bg-slate-200" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </motion.div>
            </nav>

            {/* Notification Toast */}
            <AnimatePresence>
              {activeToast && (
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="fixed bottom-8 right-8 z-[100] max-w-sm w-full"
                >
                  <div className="backdrop-blur-2xl bg-blue-600/95 border border-white/20 p-5 rounded-2xl shadow-2xl flex items-start gap-4">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-white">{activeToast.title}</h4>
                      <p className="text-xs text-white/80 line-clamp-2 mt-1">{activeToast.message}</p>
                    </div>
                    <button onClick={() => setActiveToast(null)}>
                      <X className="w-4 h-4 text-white/50" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Header */}
            <GlassCard className="flex flex-col md:flex-row items-center gap-8 py-8 md:px-12 bg-white/60 border-white/80" noHover>
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-emerald-400 p-1">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-100 to-emerald-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentName}`} 
                      alt="Student Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg border-2 border-white">
                  RANK #04
                </div>
              </div>
              <div className="text-center md:text-left flex-1 space-y-1">
                <h2 className="text-4xl font-extrabold tracking-tight text-blue-700 mb-2">Welcome Back, {studentName}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Class ID</span>
                    <span className="font-mono text-emerald-600 font-bold">XII-A</span>
                  </div>
                  <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Roll Number</span>
                    <span className="font-mono text-blue-600 font-bold">#1821</span>
                  </div>
                  <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</span>
                    <span className="text-emerald-500 flex items-center gap-1 text-sm font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Attendance */}
              <GlassCard className="relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <ThreeDIcon icon={CheckCircle2} colorClass="text-blue-600" bgClass="bg-blue-200" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Attendance</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-4xl font-extrabold text-blue-700">92%</span>
                    <p className="text-emerald-600 text-xs font-medium">Session Track 2024-25</p>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="relative w-16 h-16 cursor-pointer"
                  >
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
                      <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={175.9} strokeDashoffset={14} className="text-emerald-500" />
                    </svg>
                  </motion.div>
                </div>
              </GlassCard>

              {/* Marks & Results */}
              <GlassCard className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <ThreeDIcon icon={BookOpen} colorClass="text-emerald-600" bgClass="bg-emerald-200" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Academic Scores</span>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[120px] pr-2 custom-scrollbar">
                  {[
                    { sub: 'Mathematics', score: '95/100', grade: 'A+' },
                    { sub: 'Physics', score: '88/100', grade: 'A' },
                    { sub: 'English', score: '92/100', grade: 'A+' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <span className="text-sm font-bold text-blue-700 leading-none">{item.sub}</span>
                      <div className="text-right">
                        <span className="text-xs font-mono block text-slate-500">{item.score}</span>
                        <span className="text-[10px] font-bold text-emerald-600">{item.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Performance Graph */}
              <GlassCard className="lg:row-span-2 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <ThreeDIcon icon={TrendingUp} colorClass="text-blue-600" bgClass="bg-blue-200" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Growth Trends</span>
                </div>
                <div className="flex-1 min-h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PERFORMANCE_DATA}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(71,85,105,0.4)', fontSize: 10 }}
                      />
                      <YAxis 
                        hide 
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid rgba(59,130,246,0.1)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        }}
                        itemStyle={{ color: '#1d4ed8' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#2563eb" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-600 font-extrabold">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">↑ 5% GAIN SINCE LAST TERM</span>
                  </div>
                </div>
              </GlassCard>

              {/* Homework & Classwork */}
              <GlassCard className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <ThreeDIcon icon={ClipboardList} colorClass="text-blue-600" bgClass="bg-blue-200" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Tasks</span>
                </div>
                <div className="space-y-4">
                  {TASKS.map((task) => (
                    <div key={task.id} className="group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-blue-700 leading-tight">{task.title}</p>
                          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{task.type}</span>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-extrabold border",
                          task.status === 'Completed' 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Portal Upload */}
              <GlassCard className="flex flex-col bg-blue-50/30 border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <ThreeDIcon icon={Upload} colorClass="text-blue-600" bgClass="bg-white" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">E-Submission</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-blue-100 rounded-2xl p-4 group hover:border-emerald-400/50 hover:bg-white transition-all cursor-pointer">
                  <Upload className="w-8 h-8 text-blue-200 mb-2 group-hover:text-emerald-500 transition-colors" />
                  <p className="text-xs font-bold text-blue-700 text-center">Drop assignment files here</p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX, ZIP (Max 50MB)</p>
                </div>
              </GlassCard>

              {/* Holidays */}
              <GlassCard className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <ThreeDIcon icon={Calendar} colorClass="text-emerald-600" bgClass="bg-emerald-200" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Academy Timeline</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {HOLIDAYS.map((h, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 hover:border-blue-300 transition-all shadow-sm">
                      <div className="bg-blue-600 w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                        <span className="text-[10px] leading-tight opacity-70">{h.date.split(' ')[0]}</span>
                        <span className="text-lg leading-tight">{h.date.split(' ')[1]}</span>
                      </div>
                      <p className="text-sm font-bold text-blue-800">{h.name}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Complain Box */}
              <GlassCard className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <ThreeDIcon icon={MessageSquare} colorClass="text-slate-600" bgClass="bg-slate-200" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Connect Support</span>
                </div>
                <textarea 
                  placeholder="Share feedback or report issues..."
                  className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white resize-none min-h-[100px] transition-all placeholder:text-slate-300"
                />
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-blue-500/10">
                  Send to Admin
                </button>
              </GlassCard>

              {/* Action Tools */}
              <GlassCard className="flex flex-col bg-emerald-50/30 border-emerald-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-white text-emerald-600 border border-emerald-100">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Quick Actions</span>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleTestNotification('assignment')}
                    className="w-full bg-white hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-100 py-3 rounded-xl text-[10px] font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Upload className="w-3 h-3" />
                    CREATE NOTIFICATION
                  </button>
                  <button 
                    onClick={() => handleTestNotification('holiday')}
                    className="w-full bg-white hover:bg-emerald-600 hover:text-white text-emerald-600 border border-emerald-100 py-3 rounded-xl text-[10px] font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Calendar className="w-3 h-3" />
                    ANNOUNCE BREAK
                  </button>
                </div>
              </GlassCard>

            </div>

            {/* AI Assistant Button */}
            <div className="fixed bottom-6 right-6 z-[80]">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsChatOpen(true)}
                className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="w-6 h-6 text-white" />
                <AnimatePresence>
                  {!isChatOpen && unreadCount > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center"
                    >
                      <span className="text-[10px] text-white font-bold">!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Chat Sidebar/Modal */}
            <AnimatePresence>
              {isChatOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsChatOpen(false)}
                    className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm z-[90]"
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[100] border-l border-blue-100 flex flex-col"
                  >
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold">Academy Assistant</h3>
                          <p className="text-[10px] text-blue-100 opacity-80">AI Guide • Always Online</p>
                        </div>
                      </div>
                      <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                      {chatMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                          <div className="p-4 bg-blue-50 rounded-full">
                            <MessageSquare className="w-8 h-8 text-blue-400" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-800">Hello, {studentName}!</p>
                            <p className="text-xs text-slate-500 max-w-[200px] mx-auto">Ask me about your marks, holidays, or upcoming tasks. I'm here to help like a friend!</p>
                          </div>
                        </div>
                      ) : (
                        chatMessages.map((msg, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "flex flex-col gap-1 max-w-[85%]",
                              msg.role === 'user' ? "ml-auto items-end" : "items-start"
                            )}
                          >
                            <div className={cn(
                              "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                              msg.role === 'user' 
                                ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10" 
                                : "bg-slate-100 text-slate-800 rounded-tl-none"
                            )}>
                              {msg.content}
                            </div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">
                              {msg.role === 'bot' ? 'Assistant' : 'You'}
                            </span>
                          </motion.div>
                        ))
                      )}
                      {isTyping && (
                        <div className="flex items-center gap-2 text-blue-500 italic text-xs animate-pulse">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Assistant is thinking...
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2 items-center">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button 
                        type="submit"
                        disabled={!chatInput.trim() || isTyping}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/10"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="mt-12 bg-blue-900 border border-blue-800 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
              <div className="flex flex-col items-center gap-3">
                <GraduationCap className="text-emerald-400 w-10 h-10" />
                <h3 className="font-extrabold text-2xl tracking-[0.2em] text-white">ACADEMY OF EXCELLENCE</h3>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 text-blue-200 text-xs font-bold uppercase tracking-[0.25em]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Saharsa, Bihar
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div>EST. 2012</div>
              </div>
              <p className="text-[11px] font-bold text-blue-300/50 tracking-[0.6em] pt-6 border-t border-blue-800">
                DEVELOPED BY <span className="text-emerald-400">AJAZ-SOFTWARE</span>
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-pulse-slow {
          animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(37, 99, 235, 0.3);
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
