import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Home, MessageSquare, ShieldAlert, HeartHandshake, Settings, LogOut,
  ChevronRight, TrendingUp, Clock, Menu, X, Sparkles, Droplets, Zap,
  ArrowRight, Calendar, CheckCircle2, Flame, Cigarette, Wine, Pill, Syringe,
  Skull, Baby, Search, Quote, Users, Leaf, Wind, Award, Medal, Crown, Star,
  Smartphone, Monitor, Tablet, Activity, Headphones, BookOpen, PenTool,
  Wallet, AlertCircle, Music, Trees, CloudRain, Volume2, VolumeX, PlayCircle
} from 'lucide-react';
import { UserProfile, AddictionType, QuitSpeed, UrgeLog, ChatMessage, JournalEntry, SavingsGoal, HealthMilestone } from './types';
import { Button, Input, Select, Card, StatCard, BentoCard, ProgressBar, MoodSelector } from './components/UI';
import { streamChatResponse, generateDailyQuote, getSmartAlternatives, generateJournalPrompt } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// --- Local Date Helpers ---
const parseISO = (dateString: string) => new Date(dateString);

const differenceInDays = (dateLeft: Date, dateRight: Date) => {
  const diffTime = dateLeft.getTime() - dateRight.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const differenceInHours = (dateLeft: Date, dateRight: Date) => {
  const diffTime = dateLeft.getTime() - dateRight.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60));
};

const subDays = (date: Date, amount: number) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - amount);
  return newDate;
};

const format = (date: Date, formatStr: string) => {
  if (formatStr === 'EEE') {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  if (formatStr === 'yyyy-MM-dd') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (formatStr === 'MMM d, h:mm a') {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  }
  return date.toLocaleDateString();
};

// --- Music Player Component ---
const BackgroundMusic = ({ isPlaying, setIsPlaying }: { isPlaying: boolean, setIsPlaying: (v: boolean) => void }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Low volume by default
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Auto-play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <>
      <audio ref={audioRef} loop src="https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3" />
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-6 right-6 z-[60] p-3 rounded-full bg-white/80 backdrop-blur-md shadow-xl border border-white/50 text-denim hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap">
            {isPlaying ? "Pause Ambient" : "Play Ambient"}
        </span>
      </button>
    </>
  );
};

// --- Landing Page ---
const LandingPage = ({ onEnter, onToggleMusic, isMusicPlaying }: { onEnter: () => void, onToggleMusic: () => void, isMusicPlaying: boolean }) => {
  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden bg-[#FAFAFA] selection:bg-lilacfizz selection:text-white font-sans">
       {/* Aurora Background */}
       <div className="fixed inset-0 z-0 opacity-30 aurora-bg"></div>
       <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[20%] left-[10%] w-[600px] h-[600px] bg-lilacfizz/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
       </div>

       {/* Nav */}
       <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center animate-fade-in">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-denim to-lilacfizz rounded-xl flex items-center justify-center text-white shadow-lg shadow-denim/20">
                <Sparkles size={20} fill="currentColor" />
             </div>
             <span className="font-black text-2xl tracking-tighter text-gray-900">End Of Ash</span>
          </div>
          <div className="flex gap-4">
             <button onClick={onToggleMusic} className="p-2.5 rounded-full bg-white/40 border border-white/50 hover:bg-white transition-colors">
                {isMusicPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
             </button>
             <button onClick={onEnter} className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-bold hover:shadow-lg hover:shadow-gray-900/20 transition-all transform hover:-translate-y-0.5">
                Sign In
             </button>
          </div>
       </nav>

       {/* Hero */}
       <main className="relative z-10 flex-1 flex flex-col items-center pt-10 md:pt-20 pb-20 px-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/40 border border-white backdrop-blur-md shadow-sm mb-8 animate-slide-up">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
             <span className="text-[10px] md:text-xs font-black text-gray-600 uppercase tracking-widest">AI-Powered Recovery OS</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter text-center leading-[0.9] mb-8 animate-slide-up delay-100 max-w-5xl mx-auto drop-shadow-sm">
             <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">Sober is the</span>
             <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-mauvelous via-lilacfizz to-denim">New High.</span>
          </h1>
          
          <p className="max-w-2xl text-center text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-12 animate-slide-up delay-200 px-4">
             A beautifully designed sanctuary for your recovery. Track progress, visualize health improvements, and find peace with built-in AI support.
          </p>
          
          <div className="animate-slide-up delay-300 w-full flex justify-center px-6">
             <Button 
                onClick={onEnter} 
                variant="primary" 
                className="text-lg px-12 py-5 h-auto rounded-full shadow-2xl shadow-denim/40 hover:shadow-denim/60 border-2 border-white/20 transform hover:-translate-y-1 w-full md:w-auto"
                icon={<ArrowRight />}
             >
                Begin Your Transformation
             </Button>
          </div>

          {/* Feature Grid (Bento) */}
          <div className="mt-24 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 animate-fade-in delay-500">
             <div className="md:col-span-2 glass-morphism p-8 rounded-[2.5rem] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                <div className="relative z-10">
                   <div className="w-12 h-12 bg-lilacfizz/20 rounded-2xl flex items-center justify-center text-lilacfizz mb-4"><MessageSquare /></div>
                   <h3 className="text-2xl font-bold mb-2">Always-On AI Companion</h3>
                   <p className="text-gray-500 max-w-md">Chat with an intelligent assistant trained in CBT and addiction recovery. Get instant advice on cravings, triggers, and anxiety relief.</p>
                </div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-lilacfizz/20 to-transparent rounded-tl-[100px]"></div>
             </div>

             <div className="glass-morphism p-8 rounded-[2.5rem] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                <div className="w-12 h-12 bg-denim/20 rounded-2xl flex items-center justify-center text-denim mb-4"><Activity /></div>
                <h3 className="text-2xl font-bold mb-2">Health Timeline</h3>
                <p className="text-gray-500">See your body heal in real-time as you stay sober.</p>
             </div>

             <div className="glass-morphism p-8 rounded-[2.5rem] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                 <div className="w-12 h-12 bg-mauvelous/20 rounded-2xl flex items-center justify-center text-mauvelous mb-4"><HeartHandshake /></div>
                <h3 className="text-2xl font-bold mb-2">Panic Button</h3>
                <p className="text-gray-500">Immediate grounding techniques when urge strikes.</p>
             </div>

             <div className="md:col-span-2 glass-morphism p-8 rounded-[2.5rem] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-bold mb-2">Ambient Sanctuary</h3>
                   <p className="text-gray-500 max-w-xs">Built-in LoFi and soundscapes to calm your mind.</p>
                </div>
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white animate-spin-slow shadow-xl">
                   <Music size={32} />
                </div>
             </div>
          </div>
       </main>

       {/* Footer / Credits */}
       <footer className="relative z-20 w-full py-16 border-t border-white/50 bg-white/30 backdrop-blur-xl animate-fade-in delay-700">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <div className="flex items-center justify-center gap-4 mb-10 opacity-60">
                <div className="h-px w-12 bg-denim"></div>
                <p className="text-[11px] font-black text-denim uppercase tracking-[0.4em]">Crafted By The Team</p>
                <div className="h-px w-12 bg-denim"></div>
             </div>
             
             <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {[
                  { name: 'Anoushay Rafique', role: 'Lead Developer' },
                  { name: 'Zainab Hafeez', role: 'UI/UX Designer' },
                  { name: 'Aima Saqib', role: 'Backend Logic' },
                  { name: 'Abeera Javaid', role: 'Project Manager' }
                ].map((person) => (
                   <div key={person.name} className="group relative flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 border border-white shadow-md mb-3 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-300">
                          <Users size={24} />
                      </div>
                      <span className="text-sm font-bold text-gray-800 group-hover:text-lilacfizz transition-colors">
                         {person.name}
                      </span>
                      {/* <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {person.role}
                      </span> */}
                   </div>
                ))}
             </div>
             <p className="text-xs text-gray-400 mt-16 font-medium">© {new Date().getFullYear()} End Of Ash. Made with ❤️ for a better future.</p>
          </div>
       </footer>
    </div>
  );
};

// --- Onboarding Component ---
const Onboarding = ({ onComplete }: { onComplete: (profile: UserProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    addiction: AddictionType.CIGARETTES,
    quitSpeed: QuitSpeed.COLD_TURKEY,
    frequencyPerWeek: 50,
    age: 25,
    name: '',
    reasonForQuitting: '',
    reminderTime: '09:00',
    startDate: new Date().toISOString(),
    dailyCost: 0
  });

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(p => p + 1);
      setIsAnimating(false);
    }, 400);
  };
  const prevStep = () => setStep(p => p - 1);
  const submit = () => { if (formData.name && formData.addiction) onComplete(formData as UserProfile); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 text-center relative overflow-hidden bg-[#FAFAFA] font-sans">
      <div className="fixed inset-0 z-0 aurora-bg opacity-20"></div>

      <div className={`w-full max-w-xl relative z-10 transition-all duration-500 transform ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} animate-slide-up`}>
        {step === 1 && (
          <Card className="p-8 md:p-12 shadow-2xl shadow-denim/10 border-white/60 backdrop-blur-xl">
             <div className="w-20 h-20 bg-gradient-to-tr from-denim to-polarsky rounded-[2rem] mx-auto flex items-center justify-center text-white mb-8 shadow-xl shadow-denim/20 transform -rotate-6">
               <Sparkles size={40} />
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">Welcome</h1>
             <p className="text-gray-500 mb-8 font-medium">Let's set up your personal recovery space.</p>
             <div className="space-y-6 max-w-sm mx-auto">
               <Input placeholder="What's your name?" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="text-center text-lg h-14" autoFocus />
               <Button onClick={nextStep} disabled={!formData.name} variant="lilac" className="w-full text-lg h-14" icon={<ArrowRight />}>Begin Journey</Button>
             </div>
          </Card>
        )}
        {step === 2 && (
          <Card className="p-6 md:p-10 shadow-2xl shadow-mauvelous/10 border-white/60 backdrop-blur-xl" title="Choose your battle" headerColor="text-mauvelous text-center w-full block text-2xl md:text-3xl font-black mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mt-6">
              {Object.values(AddictionType).map((type) => (
                <button key={type} onClick={() => setFormData({...formData, addiction: type})} className={`relative p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 aspect-square justify-center group ${formData.addiction === type ? 'border-mauvelous bg-mauvelous/5' : 'border-transparent bg-white/50 hover:bg-white'}`}>
                  <span className={`font-bold text-xs md:text-sm ${formData.addiction === type ? 'text-mauvelous' : 'text-gray-500'}`}>{type}</span>
                  {formData.addiction === type && <CheckCircle2 size={16} className="text-mauvelous absolute top-2 right-2" />}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-10"><Button variant="ghost" onClick={prevStep}>Back</Button><Button onClick={nextStep} variant="mauve" className="flex-1">Confirm</Button></div>
          </Card>
        )}
        {step === 3 && (
            <Card className="p-8 md:p-10 shadow-2xl shadow-denim/10 border-white/60 backdrop-blur-xl" title="The Cost" headerColor="text-denim text-2xl font-black mb-2">
                <div className="space-y-6">
                    <Input label="Average Daily Cost ($)" type="number" value={formData.dailyCost} onChange={e => setFormData({...formData, dailyCost: parseFloat(e.target.value)})} />
                    <Input label="Your Age" type="number" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} />
                    <div className="flex gap-4 mt-6"><Button variant="ghost" onClick={prevStep}>Back</Button><Button onClick={nextStep} variant="primary" className="flex-1">Next</Button></div>
                </div>
            </Card>
        )}
        {step === 4 && (
          <Card className="p-8 md:p-10 shadow-2xl shadow-lilacfizz/10 border-white/60 backdrop-blur-xl" title="Final Commitment" headerColor="text-lilacfizz text-2xl font-black mb-4">
             <textarea placeholder="I am quitting because..." value={formData.reasonForQuitting} onChange={e => setFormData({...formData, reasonForQuitting: e.target.value})} className="w-full h-32 p-6 bg-lilacfizz/5 rounded-3xl border-2 border-lilacfizz/20 focus:border-lilacfizz outline-none resize-none font-medium text-lg text-gray-700" />
             <div className="flex gap-4 mt-8"><Button variant="ghost" onClick={prevStep}>Back</Button><Button onClick={submit} variant="lilac" className="flex-1">Start My New Life</Button></div>
          </Card>
        )}
      </div>
    </div>
  );
};

// --- App Component ---
export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'dashboard' | 'chat' | 'urges' | 'alternatives' | 'settings' | 'breathe' | 'health' | 'journal' | 'sanctuary'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<string>('');
  const [urges, setUrges] = useState<UrgeLog[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [panicMode, setPanicMode] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Load Data
  useEffect(() => {
    const savedUser = localStorage.getItem('eoa_user');
    const savedUrges = localStorage.getItem('eoa_urges');
    const savedJournal = localStorage.getItem('eoa_journal');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedUrges) setUrges(JSON.parse(savedUrges));
    if (savedJournal) setJournal(JSON.parse(savedJournal));
  }, []);

  // Persist Data
  useEffect(() => { if (user) localStorage.setItem('eoa_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('eoa_urges', JSON.stringify(urges)); }, [urges]);
  useEffect(() => { localStorage.setItem('eoa_journal', JSON.stringify(journal)); }, [journal]);

  // Daily Quote
  useEffect(() => {
    if (user && view === 'dashboard') {
      generateDailyQuote(user.addiction).then(setDailyQuote);
    }
  }, [user, view]);

  const handleLogout = () => {
    if(confirm("Are you sure? This will delete your local data.")) {
      localStorage.clear();
      setUser(null);
      setShowLanding(true);
      setIsMusicPlaying(false);
    }
  };

  const updateUserSettings = (updates: Partial<UserProfile>) => { if (user) setUser({ ...user, ...updates }); };

  const addJournalEntry = (entry: JournalEntry) => {
    setJournal([entry, ...journal]);
  };

  return (
    <div className="h-screen bg-[#FDFDFD] text-gray-800 font-sans selection:bg-lilacfizz selection:text-white overflow-hidden animate-fade-in flex flex-col">
      <BackgroundMusic isPlaying={isMusicPlaying} setIsPlaying={setIsMusicPlaying} />
      
      {showLanding ? (
        <LandingPage onEnter={() => setShowLanding(false)} onToggleMusic={() => setIsMusicPlaying(!isMusicPlaying)} isMusicPlaying={isMusicPlaying} />
      ) : !user ? (
        <Onboarding onComplete={(p) => setUser(p)} />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Panic Overlay */}
          {panicMode && (
              <div className="fixed inset-0 z-[100] bg-mauvelous/95 backdrop-blur-xl flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in">
                  <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center animate-breathe mb-8">
                      <span className="text-2xl font-black uppercase tracking-widest">Breathe</span>
                  </div>
                  <h1 className="text-5xl font-black mb-4">You Are Safe.</h1>
                  <p className="text-xl font-medium max-w-md mb-12">This urge is temporary. It will pass in minutes. You have survived 100% of your bad days.</p>
                  <div className="flex gap-4">
                      <Button variant="glass" onClick={() => setPanicMode(false)}>I'm Okay Now</Button>
                      <Button variant="glass" className="bg-white text-mauvelous border-white" onClick={() => {setPanicMode(false); setView('chat');}}>Talk to AI</Button>
                  </div>
              </div>
          )}

          {/* Sidebar */}
          <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-[280px] bg-white/60 backdrop-blur-xl border-r border-white/50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-[10px_0_30px_-10px_rgba(0,0,0,0.02)]`}>
            <div className="p-8 pb-6 hidden lg:block">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-denim to-polarsky rounded-2xl shadow-lg shadow-denim/20 flex items-center justify-center text-white transform rotate-3 hover:rotate-0 transition-all duration-300 border border-white/20">
                  <Sparkles size={24} fill="currentColor" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-gray-900">EOA</h1>
                  <p className="text-[10px] text-denim font-extrabold uppercase tracking-widest mt-0.5">Recovery OS</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 overflow-y-auto py-4 lg:py-0 scrollbar-hide space-y-1">
              <div className="lg:hidden p-4 mb-4 flex items-center gap-3">
                 <div className="w-10 h-10 bg-denim rounded-xl flex items-center justify-center text-white"><Sparkles size={20} /></div>
                 <span className="font-black text-xl">EOA</span>
                 <button className="ml-auto" onClick={() => setIsSidebarOpen(false)}><X /></button>
              </div>

              {[
                { id: 'dashboard', icon: <Home size={20} />, label: 'Overview', color: 'bg-gradient-to-r from-denim to-[#7D8EAB]' },
                { id: 'health', icon: <Activity size={20} />, label: 'Health Timeline', color: 'bg-gradient-to-r from-teal-400 to-emerald-500' },
                { id: 'journal', icon: <BookOpen size={20} />, label: 'Daily Journal', color: 'bg-gradient-to-r from-amber-400 to-orange-500' },
                { id: 'urges', icon: <TrendingUp size={20} />, label: 'Urge Tracker', color: 'bg-gradient-to-r from-mauvelous to-[#D17585]' },
                { id: 'chat', icon: <MessageSquare size={20} />, label: 'AI Companion', color: 'bg-gradient-to-r from-lilacfizz to-[#B089AD]' },
                { id: 'alternatives', icon: <HeartHandshake size={20} />, label: 'Strategies', color: 'bg-gradient-to-r from-polarsky to-denim' },
                { id: 'sanctuary', icon: <Headphones size={20} />, label: 'Sanctuary', color: 'bg-gradient-to-r from-indigo-400 to-violet-500' },
                { id: 'breathe', icon: <Wind size={20} />, label: 'Breathing', color: 'bg-gradient-to-r from-cyan-400 to-blue-500' },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setView(item.id as any); setIsSidebarOpen(false); }} 
                  className={`group flex items-center w-full gap-4 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden mb-1 ${view === item.id ? `text-white shadow-lg ${item.color} scale-[1.02]` : 'text-gray-400 hover:text-denim hover:bg-white/50'}`}
                >
                  <span className={`relative z-10 transition-transform duration-300 ${view === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
              
              <div className="my-4 h-px bg-gray-100 mx-6"></div>
              <button onClick={() => { setView('settings'); setIsSidebarOpen(false); }} className={`group flex items-center w-full gap-4 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${view === 'settings' ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-400 hover:text-gray-800'}`}>
                  <Settings size={20} /> <span>Settings</span>
              </button>
            </nav>

            <div className="p-6">
                {/* Music Toggle Sidebar */}
                <button onClick={() => setIsMusicPlaying(!isMusicPlaying)} className="flex items-center gap-3 w-full px-4 py-3 mb-4 rounded-2xl bg-polarsky/10 hover:bg-polarsky/20 text-denim transition-colors">
                    {isMusicPlaying ? <Volume2 size={18} className="animate-pulse" /> : <VolumeX size={18} />}
                    <span className="text-xs font-bold uppercase tracking-wider">{isMusicPlaying ? 'Music On' : 'Music Off'}</span>
                </button>

                <button 
                    onClick={() => setPanicMode(true)}
                    className="w-full mb-4 py-3 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 hover:bg-red-600 transition-colors animate-pulse"
                >
                    <AlertCircle size={18} />
                    <span>PANIC BUTTON</span>
                </button>
                <button onClick={handleLogout} className="flex items-center justify-center w-full gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-gray-400 hover:text-mauvelous hover:bg-mauvelous/10 transition-colors">
                    <LogOut size={16} />
                    <span>SIGN OUT</span>
                </button>
                <div className="mt-4 text-[9px] text-gray-300 text-center font-bold uppercase tracking-wider leading-relaxed">
                 Project by <br/> 
                 <span className="text-gray-400">Anoushay, Zainab, Aima, Abeera</span>
                </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 pt-4 lg:pt-0 h-full overflow-hidden relative z-10 flex flex-col">
            {/* Mobile Toggle */}
            <div className="lg:hidden px-6 py-4 flex justify-between items-center z-50">
               <span className="font-black text-xl">EOA</span>
               <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scrollbar-hide">
                 {view === 'dashboard' && <DashboardView user={user} dailyQuote={dailyQuote} urges={urges} updateSettings={updateUserSettings} />}
                 {view === 'health' && <HealthTimeline user={user} />}
                 {view === 'journal' && <JournalView user={user} journal={journal} addEntry={addJournalEntry} />}
                 {view === 'urges' && <UrgesView urges={urges} onLogUrge={(u) => setUrges([u, ...urges])} />}
                 {view === 'chat' && <ChatView user={user} />}
                 {view === 'alternatives' && <AlternativesView user={user} />}
                 {view === 'sanctuary' && <SanctuaryView />}
                 {view === 'breathe' && <BreathingView />}
                 {view === 'settings' && <SettingsView user={user} onUpdate={updateUserSettings} />}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

// --- VIEWS ---

const DashboardView = ({ user, dailyQuote, urges, updateSettings }: { user: UserProfile, dailyQuote: string, urges: UrgeLog[], updateSettings: (u: Partial<UserProfile>) => void }) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  
  const startDate = parseISO(user.startDate);
  const daysSober = differenceInDays(now, startDate);
  const moneySaved = daysSober * (user.dailyCost || 0);

  // Chart Data
  const chartData = useMemo(() => {
     const end = new Date();
     return Array.from({length: 7}, (_, i) => {
        const d = subDays(end, 6 - i);
        const count = urges.filter(u => format(parseISO(u.timestamp), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')).length;
        return { name: format(d, 'EEE'), count };
     });
  }, [urges]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
        {/* Quote Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-lilacfizz via-[#D4A5D1] to-mauvelous p-8 md:p-12 rounded-[3rem] text-white shadow-2xl shadow-lilacfizz/30">
            <div className="relative z-10 max-w-3xl">
                <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-4">Daily Wisdom</p>
                <p className="text-3xl md:text-5xl font-serif italic leading-tight">"{dailyQuote}"</p>
            </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Main Stat */}
            <BentoCard cols="md:col-span-2" rows="md:row-span-2" className="bg-gradient-to-br from-denim to-[#7D8EAB] text-white flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4 opacity-80"><Clock /> <span className="text-xs font-bold uppercase tracking-widest">Sober Streak</span></div>
                    <h2 className="text-7xl md:text-9xl font-black tracking-tighter">{daysSober}</h2>
                    <p className="text-2xl font-medium opacity-90">Days of Freedom</p>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10"><Crown size={300} /></div>
            </BentoCard>

            {/* Savings Goal */}
            <BentoCard cols="md:col-span-2" rows="md:row-span-1" className="bg-white border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Saved</p>
                        <h3 className="text-4xl font-black text-gray-800">${moneySaved.toFixed(0)}</h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-xl text-green-600"><Wallet /></div>
                </div>
                {user.savingsGoal ? (
                    <div>
                        <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                            <span>Goal: {user.savingsGoal.name}</span>
                            <span>${user.savingsGoal.cost}</span>
                        </div>
                        <ProgressBar progress={(moneySaved / user.savingsGoal.cost) * 100} color="bg-green-500" height="h-4" />
                        <p className="text-xs text-gray-400 mt-2 text-right">
                           {moneySaved >= user.savingsGoal.cost ? "GOAL REACHED! 🎉" : `${Math.ceil((user.savingsGoal.cost - moneySaved) / (user.dailyCost || 1))} days left`}
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">No goal set.</span>
                        <Button variant="ghost" onClick={() => updateSettings({ savingsGoal: { id: '1', name: 'New Phone', cost: 1000 } })} className="px-4 py-2 text-xs">Set Goal</Button>
                    </div>
                )}
            </BentoCard>

            {/* Urges Mini Chart */}
            <BentoCard cols="md:col-span-1" rows="md:row-span-1" className="bg-white border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Resilience</p>
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <Bar dataKey="count" fill="#F3A0AD" radius={[4,4,4,4]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </BentoCard>

            {/* Health Status */}
            <BentoCard cols="md:col-span-1" rows="md:row-span-1" className="bg-gradient-to-br from-teal-400 to-emerald-500 text-white relative">
                 <Activity className="absolute top-4 right-4 opacity-50" />
                 <div className="mt-auto">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">Health</p>
                    <h3 className="text-2xl font-black">Healing</h3>
                    <p className="text-sm opacity-90 mt-1">Body recovering...</p>
                 </div>
            </BentoCard>
        </div>
    </div>
  );
};

const HealthTimeline = ({ user }: { user: UserProfile }) => {
    // Mock logic based on sobriety days
    const startDate = parseISO(user.startDate);
    const days = differenceInDays(new Date(), startDate);
    
    const milestones: HealthMilestone[] = [
        { day: 1, title: 'Carbon Monoxide Drops', description: 'Oxygen levels in your blood return to normal.', percentage: Math.min(100, (days/1)*100) },
        { day: 3, title: 'Nicotine Free', description: 'Nicotine is depleted from your body. Senses improve.', percentage: Math.min(100, (days/3)*100) },
        { day: 14, title: 'Circulation Improves', description: 'Walking and running become easier.', percentage: Math.min(100, (days/14)*100) },
        { day: 30, title: 'Lung Function', description: 'Coughing and shortness of breath decrease.', percentage: Math.min(100, (days/30)*100) },
        { day: 90, title: 'Risk Reduction', description: 'Risk of heart attack begins to drop significantly.', percentage: Math.min(100, (days/90)*100) },
    ];

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-6">Biological Recovery</h2>
            <div className="space-y-6">
                {milestones.map((m, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex gap-6 items-center group hover:shadow-md transition-all">
                         <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-4 border-gray-50 relative">
                             <span className="font-black text-gray-300 z-10">{m.day}d</span>
                             {m.percentage >= 100 && <div className="absolute inset-0 bg-teal-400 rounded-full opacity-20 animate-pulse"></div>}
                             {m.percentage >= 100 && <CheckCircle2 className="absolute text-teal-500" size={24} />}
                         </div>
                         <div className="flex-1">
                             <div className="flex justify-between mb-2">
                                 <h3 className="font-bold text-lg text-gray-800">{m.title}</h3>
                                 <span className="text-xs font-bold text-gray-400">{m.percentage.toFixed(0)}%</span>
                             </div>
                             <p className="text-sm text-gray-500 mb-3">{m.description}</p>
                             <ProgressBar progress={m.percentage} color="bg-teal-400" height="h-2" />
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SanctuaryView = () => {
    const [activeScene, setActiveScene] = useState<'rain' | 'forest' | 'cosmos'>('rain');
    
    // In a real app, these would be audio refs
    return (
        <div className="h-full flex flex-col max-w-5xl mx-auto">
            <div className="mb-6">
                <h2 className="text-3xl font-black text-gray-900">Sanctuary</h2>
                <p className="text-gray-500">Audio-visual soundscapes for deep relaxation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button onClick={() => setActiveScene('rain')} className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${activeScene === 'rain' ? 'bg-denim text-white border-denim shadow-lg' : 'bg-white text-gray-600 border-gray-200'}`}>
                    <CloudRain /> <span className="font-bold">Heavy Rain</span>
                </button>
                <button onClick={() => setActiveScene('forest')} className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${activeScene === 'forest' ? 'bg-green-500 text-white border-green-500 shadow-lg' : 'bg-white text-gray-600 border-gray-200'}`}>
                    <Trees /> <span className="font-bold">Deep Forest</span>
                </button>
                <button onClick={() => setActiveScene('cosmos')} className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${activeScene === 'cosmos' ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg' : 'bg-white text-gray-600 border-gray-200'}`}>
                    <Music /> <span className="font-bold">Cosmos</span>
                </button>
            </div>

            <div className="flex-1 rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/50">
                {/* Visualizers */}
                {activeScene === 'rain' && (
                    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center overflow-hidden">
                        <div className="absolute w-full h-full bg-[url('https://media.giphy.com/media/t7Qb8655Z1oHF4DK0N/giphy.gif')] bg-cover opacity-20"></div>
                        <div className="w-64 h-64 border-4 border-blue-400/30 rounded-full animate-breathe flex items-center justify-center backdrop-blur-sm">
                            <span className="text-blue-200 font-light tracking-[0.5em]">BREATHE</span>
                        </div>
                    </div>
                )}
                {activeScene === 'forest' && (
                    <div className="absolute inset-0 bg-green-900 flex items-center justify-center overflow-hidden">
                        <div className="absolute w-[800px] h-[800px] bg-green-500/20 rounded-full blur-[100px] animate-blob"></div>
                         <div className="w-64 h-64 border-4 border-green-400/30 rounded-full animate-float flex items-center justify-center backdrop-blur-sm">
                            <span className="text-green-200 font-light tracking-[0.5em]">GROW</span>
                        </div>
                    </div>
                )}
                {activeScene === 'cosmos' && (
                    <div className="absolute inset-0 bg-indigo-950 flex items-center justify-center overflow-hidden">
                         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-gray-900 to-black opacity-80"></div>
                         <Sparkles className="text-white/20 absolute top-10 left-10 animate-pulse" size={40} />
                         <Sparkles className="text-white/20 absolute bottom-20 right-20 animate-pulse delay-700" size={60} />
                         <div className="w-64 h-64 border-4 border-indigo-400/30 rounded-full animate-spin [animation-duration:10s] flex items-center justify-center backdrop-blur-sm">
                            <span className="text-indigo-200 font-light tracking-[0.5em] animate-none transform -rotate-12">FLOAT</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const JournalView = ({ user, journal, addEntry }: { user: UserProfile, journal: JournalEntry[], addEntry: (e: JournalEntry) => void }) => {
    const [prompt, setPrompt] = useState("Loading prompt...");
    const [content, setContent] = useState("");
    const [mood, setMood] = useState("neutral");

    useEffect(() => {
        generateJournalPrompt(mood).then(setPrompt);
    }, []);

    const handleSave = () => {
        if (!content) return;
        addEntry({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            mood: mood as any,
            title: prompt,
            content,
            tags: []
        });
        setContent("");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="space-y-6">
                <Card className="border border-white shadow-xl shadow-orange-100" title="Daily Reflection">
                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">How are you feeling?</label>
                        <MoodSelector value={mood} onChange={setMood} />
                    </div>
                    <div className="bg-orange-50 p-4 rounded-2xl mb-4 border border-orange-100">
                        <p className="text-sm font-bold text-orange-800 mb-1">Prompt:</p>
                        <p className="text-gray-700 italic">{prompt}</p>
                    </div>
                    <textarea 
                        className="w-full h-40 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-200 resize-none text-gray-700 leading-relaxed"
                        placeholder="Start writing here..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <Button onClick={handleSave} className="w-full mt-4 bg-gradient-to-r from-orange-400 to-amber-500 shadow-orange-200">Save Entry</Button>
                </Card>
            </div>
            
            <div className="overflow-y-auto space-y-4 max-h-[calc(100vh-140px)] scrollbar-hide">
                <h3 className="text-xl font-black text-gray-800">Past Entries</h3>
                {journal.map(entry => (
                    <div key={entry.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{format(parseISO(entry.date), 'MMM d, h:mm a')}</span>
                             <span className="text-xl">
                                 {entry.mood === 'great' ? '🤩' : entry.mood === 'bad' ? '😔' : '😐'}
                             </span>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2 text-sm">{entry.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                    </div>
                ))}
                {journal.length === 0 && <p className="text-gray-400 text-center mt-10">No entries yet. Start writing!</p>}
            </div>
        </div>
    );
};

const SettingsView = ({ user, onUpdate }: { user: UserProfile, onUpdate: (u: Partial<UserProfile>) => void }) => {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-black text-gray-900">Settings</h2>
            
            <Card title="Savings Goal">
                 <div className="grid grid-cols-2 gap-4">
                     <Input label="Goal Item Name" value={user.savingsGoal?.name || ''} onChange={e => onUpdate({ savingsGoal: { ...user.savingsGoal!, name: e.target.value } })} />
                     <Input label="Cost ($)" type="number" value={user.savingsGoal?.cost || 0} onChange={e => onUpdate({ savingsGoal: { ...user.savingsGoal!, cost: parseFloat(e.target.value) } })} />
                 </div>
            </Card>

            <Card title="Profile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Name" value={user.name} onChange={e => onUpdate({ name: e.target.value })} />
                    <Input label="Daily Cost of Habit ($)" type="number" value={user.dailyCost} onChange={e => onUpdate({ dailyCost: parseFloat(e.target.value) })} />
                </div>
            </Card>
        </div>
    );
};

const BreathingView = () => (
    <div className="flex flex-col items-center justify-center h-full relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white to-cyan-50 shadow-2xl border border-white">
        <div className="relative flex items-center justify-center">
            <div className="w-64 h-64 bg-cyan-200/30 rounded-full animate-breathe absolute mix-blend-multiply blur-xl"></div>
            <div className="w-64 h-64 bg-blue-200/30 rounded-full animate-breathe absolute mix-blend-multiply blur-xl animation-delay-200"></div>
            <div className="relative z-10 w-48 h-48 bg-white/50 backdrop-blur-sm rounded-full border border-white shadow-2xl flex items-center justify-center animate-breathe">
                <span className="text-cyan-600 font-black text-lg tracking-widest uppercase">Inhale</span>
            </div>
        </div>
        <p className="mt-12 text-gray-500 font-medium">Box Breathing: 4s In, 4s Hold, 4s Out, 4s Hold</p>
    </div>
);

const UrgesView = ({ urges, onLogUrge }: { urges: UrgeLog[], onLogUrge: (u: UrgeLog) => void }) => {
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [notes, setNotes] = useState('');
  const handleLog = () => {
    if (!trigger) return;
    onLogUrge({ id: Date.now().toString(), timestamp: new Date().toISOString(), intensity, trigger, notes });
    setTrigger(''); setNotes(''); setIntensity(5);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
       <div className="lg:col-span-5 space-y-6">
          <Card title="Log Craving" className="shadow-xl shadow-mauvelous/10">
             <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-3xl">
                   <div className="flex justify-between mb-4"><span className="text-xs font-bold uppercase text-gray-400">Intensity</span><span className="font-bold">{intensity}/10</span></div>
                   <input type="range" min="1" max="10" value={intensity} onChange={e => setIntensity(parseInt(e.target.value))} className="w-full accent-mauvelous" />
                </div>
                <Input placeholder="What triggered this?" value={trigger} onChange={e => setTrigger(e.target.value)} />
                <Input placeholder="Notes..." value={notes} onChange={e => setNotes(e.target.value)} />
                <Button onClick={handleLog} variant="mauve" className="w-full">Log It</Button>
             </div>
          </Card>
       </div>
       <div className="lg:col-span-7 overflow-y-auto max-h-[80vh] scrollbar-hide space-y-4">
          {urges.map(u => (
              <div key={u.id} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${u.intensity > 7 ? 'bg-mauvelous' : 'bg-denim'}`}>{u.intensity}</div>
                  <div><p className="font-bold text-gray-800">{u.trigger}</p><p className="text-xs text-gray-400">{format(parseISO(u.timestamp), 'MMM d, h:mm a')}</p></div>
              </div>
          ))}
       </div>
    </div>
  );
};

const ChatView = ({ user }: { user: UserProfile }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: '1', role: 'model', text: `Hi ${user.name}. I'm here.` }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const send = async () => {
      if(!input) return;
      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
      setMessages(p => [...p, userMsg]); setInput(''); setLoading(true);
      let acc = "";
      const botId = (Date.now()+1).toString();
      setMessages(p => [...p, { id: botId, role: 'model', text: '' }]);
      await streamChatResponse([...messages, userMsg], input, (chunk) => {
          acc += chunk; setMessages(p => p.map(m => m.id === botId ? { ...m, text: acc } : m));
      });
      setLoading(false);
  };

  return (
      <div className="h-[80vh] flex flex-col bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-lilacfizz text-white rounded-tr-sm' : 'bg-white shadow-sm border border-gray-100 rounded-tl-sm'}`}>{m.text}</div>
                  </div>
              ))}
              <div ref={scrollRef} />
          </div>
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input className="flex-1 bg-gray-50 rounded-full px-6 outline-none focus:ring-2 focus:ring-lilacfizz/20 transition-all" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type message..." />
              <button onClick={send} className="w-12 h-12 bg-lilacfizz rounded-full text-white flex items-center justify-center hover:scale-105 transition-transform"><ArrowRight /></button>
          </div>
      </div>
  );
};

const AlternativesView = ({ user }: { user: UserProfile }) => {
    const [res, setRes] = useState("");
    const [load, setLoad] = useState(false);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                 {[3, 6, 9].map(i => (
                     <button key={i} onClick={async () => { setLoad(true); setRes(await getSmartAlternatives(user.addiction, i)); setLoad(false); }} className="w-full p-6 bg-white border border-gray-100 rounded-[2rem] hover:shadow-lg transition-all text-left group">
                         <span className="font-bold text-gray-800 block mb-1 group-hover:text-denim">Level {i} Craving</span>
                         <span className="text-sm text-gray-400">Get strategy &rarr;</span>
                     </button>
                 ))}
            </div>
            <Card className="min-h-[300px] bg-gray-50 border-none">
                {load ? <div className="animate-pulse text-denim font-bold">Generating...</div> : <div className="prose">{res || "Select intensity."}</div>}
            </Card>
        </div>
    );
};