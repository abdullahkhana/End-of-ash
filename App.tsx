import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, MessageSquare, ShieldAlert, HeartHandshake, Settings, LogOut,
  ChevronRight, TrendingUp, Clock, Menu, X, Sparkles, Droplets, Zap,
  ArrowRight, Calendar, CheckCircle2, Flame, Cigarette, Wine, Pill, Syringe,
  Skull, Baby, Search, Quote, Users, Leaf, Wind, Award, Medal, Crown, Star
} from 'lucide-react';
import { UserProfile, AddictionType, QuitSpeed, UrgeLog, ChatMessage } from './types';
import { Button, Input, Select, Card, StatCard } from './components/UI';
import { streamChatResponse, generateDailyQuote, getSmartAlternatives } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, differenceInDays, differenceInHours, subDays, addDays, parseISO } from 'date-fns';

// --- Landing Page Component ---
const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden bg-[#FAFAFA] selection:bg-lilacfizz selection:text-white">
       {/* Background Effects */}
       <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-polarsky/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[0%] right-[10%] w-[500px] h-[500px] bg-mauvelous/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-lilacfizz/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
       </div>

       {/* Navbar */}
       <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center animate-fade-in">
          <div className="flex items-center gap-2.5 group cursor-pointer">
             <div className="w-10 h-10 bg-gradient-to-br from-denim to-lilacfizz rounded-xl flex items-center justify-center text-white shadow-lg shadow-denim/20 transition-transform group-hover:rotate-6">
                <Sparkles size={20} fill="currentColor" />
             </div>
             <span className="font-black text-2xl tracking-tighter text-gray-900 group-hover:text-denim transition-colors">End Of Ash</span>
          </div>
          <button onClick={onEnter} className="px-6 py-2.5 rounded-full bg-white/50 border border-white backdrop-blur-md text-sm font-bold text-gray-800 hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-0.5">
             Member Login
          </button>
       </nav>

       {/* Hero Section */}
       <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white backdrop-blur-md shadow-sm mb-8 animate-slide-up">
             <Leaf size={14} className="text-green-500" />
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Reclaim Your Life Today</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9] animate-slide-up delay-100">
             <span className="block text-gray-900">Break Free.</span>
             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-denim via-lilacfizz to-mauvelous">Live Pure.</span>
          </h1>
          
          <p className="max-w-xl text-lg md:text-2xl text-gray-500 font-medium leading-relaxed mb-12 animate-slide-up delay-200">
             The intelligent AI companion designed to help you overcome addiction, track your sobriety, and find your inner peace.
          </p>
          
          <div className="animate-slide-up delay-300">
             <Button 
                onClick={onEnter} 
                variant="denim" 
                className="text-lg px-10 py-5 h-auto rounded-[2rem] shadow-2xl shadow-denim/30 hover:shadow-denim/50 border-white/20"
                icon={<ArrowRight />}
             >
                Start Your Journey
             </Button>
          </div>
       </main>

       {/* Footer Credits */}
       <footer className="relative z-20 w-full py-10 border-t border-gray-200/50 bg-white/30 backdrop-blur-sm animate-fade-in delay-500">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <p className="text-[10px] font-extrabold text-denim uppercase tracking-[0.3em] mb-6 opacity-70">Project Created By</p>
             <div className="flex flex-wrap justify-center gap-4 md:gap-12">
                {[
                  'Anoushay Rafique',
                  'Zainab Hafeez',
                  'Aima Saqib',
                  'Abeera Javaid'
                ].map((name, i) => (
                   <div key={name} className="group relative">
                      <span className="text-sm md:text-base font-bold text-gray-600 group-hover:text-lilacfizz transition-colors cursor-default">
                         {name}
                      </span>
                      <div className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-lilacfizz transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
                   </div>
                ))}
             </div>
          </div>
       </footer>
    </div>
  );
};

// --- Improved Onboarding Component ---
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
    startDate: new Date().toISOString()
  });

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(p => p + 1);
      setIsAnimating(false);
    }, 400);
  };

  const prevStep = () => {
    setStep(p => p - 1);
  };
  
  const submit = () => {
    if (formData.name && formData.addiction) {
      onComplete(formData as UserProfile);
    }
  };

  // Icons for addiction selection
  const getAddictionIcon = (type: AddictionType) => {
    switch(type) {
      case AddictionType.CIGARETTES: return <Cigarette size={24} />;
      case AddictionType.ALCOHOL: return <Wine size={24} />;
      case AddictionType.PILLS: return <Pill size={24} />;
      case AddictionType.VAPE: return <Flame size={24} />;
      case AddictionType.DRUGS: return <Syringe size={24} />;
      case AddictionType.METH: return <Skull size={24} />;
      default: return <ShieldAlert size={24} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-[#FAFAFA]">
      
      {/* Intense Background Mesh */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-polarsky/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-mauvelous/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
         <div className="absolute top-[40%] left-[40%] w-[500px] h-[500px] bg-lilacfizz/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className={`w-full max-w-2xl relative z-10 transition-all duration-500 transform ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} animate-slide-up`}>
        
        {/* Header Progress */}
        <div className="mb-10 flex justify-center items-center gap-2">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-gradient-to-r from-denim to-lilacfizz' : 'w-4 bg-gray-200'}`} />
           ))}
        </div>

        {step === 1 && (
          <Card className="p-10 md:p-14 shadow-2xl shadow-denim/10 border-white/60">
             <div className="w-20 h-20 bg-gradient-to-tr from-denim to-polarsky rounded-[2rem] mx-auto flex items-center justify-center text-white mb-8 shadow-xl shadow-denim/20 transform -rotate-6 hover:rotate-0 transition-all duration-500">
               <Sparkles size={40} />
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">End Of Ash</h1>
             <p className="text-xl text-denim-dark font-medium mb-10 leading-relaxed">
               Your journey to a cleaner life begins with a single intention.
             </p>
             
             <div className="space-y-6 max-w-sm mx-auto">
               <Input 
                 placeholder="What's your name?" 
                 value={formData.name} 
                 onChange={e => setFormData({...formData, name: e.target.value})}
                 className="text-center text-lg h-14"
                 autoFocus
               />
               <Button 
                  onClick={nextStep} 
                  disabled={!formData.name} 
                  variant="lilac"
                  className="w-full text-lg h-14 shadow-xl shadow-lilacfizz/20"
                  icon={<ArrowRight />}
                >
                 Begin Journey
               </Button>
             </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-10 shadow-2xl shadow-mauvelous/10 border-white/60" title="Choose your battle" headerColor="text-mauvelous text-center w-full block text-3xl font-black mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {Object.values(AddictionType).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({...formData, addiction: type})}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 aspect-square justify-center ${
                    formData.addiction === type 
                    ? 'border-mauvelous bg-mauvelous/5 shadow-lg shadow-mauvelous/10 scale-105' 
                    : 'border-transparent bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className={`${formData.addiction === type ? 'text-mauvelous' : 'text-denim'} transition-colors`}>
                    {getAddictionIcon(type)}
                  </div>
                  <span className={`font-bold text-sm ${formData.addiction === type ? 'text-mauvelous' : 'text-gray-500'}`}>
                    {type}
                  </span>
                  {formData.addiction === type && (
                    <div className="absolute top-2 right-2 text-mauvelous">
                      <CheckCircle2 size={16} fill="currentColor" className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-10">
              <Button variant="ghost" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep} variant="mauve" className="flex-1" icon={<ArrowRight />}>Confirm</Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-10 shadow-2xl shadow-denim/10 border-white/60" title="The Baseline" headerColor="text-denim text-3xl font-black mb-2">
             <div className="space-y-8 mt-4">
                <div className="bg-polarsky/10 p-6 rounded-3xl border border-polarsky/20">
                   <label className="flex justify-between font-bold text-denim-dark mb-4 uppercase tracking-widest text-xs">
                      <span>Intensity (0-100)</span>
                      <span className="text-denim">{formData.frequencyPerWeek}%</span>
                   </label>
                   <input 
                      type="range" min="0" max="100" 
                      value={formData.frequencyPerWeek} 
                      onChange={e => setFormData({...formData, frequencyPerWeek: parseInt(e.target.value)})}
                      className="w-full h-4 bg-white rounded-full appearance-none cursor-pointer accent-denim shadow-inner"
                   />
                   <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400 uppercase">
                      <span>Casual</span>
                      <span>Daily</span>
                      <span>Heavy</span>
                   </div>
                </div>

                <Select 
                  label="Quit Method"
                  options={Object.values(QuitSpeed).map(v => ({ label: v, value: v }))}
                  value={formData.quitSpeed}
                  onChange={e => setFormData({...formData, quitSpeed: e.target.value as QuitSpeed})}
                  className="bg-gray-50"
                />

                <Input 
                   label="Your Age"
                   type="number"
                   value={formData.age}
                   onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                />

                <div className="flex gap-4 mt-6">
                  <Button variant="ghost" onClick={prevStep}>Back</Button>
                  <Button onClick={nextStep} variant="primary" className="flex-1" icon={<ArrowRight />}>Next</Button>
                </div>
             </div>
          </Card>
        )}

        {step === 4 && (
          <Card className="p-10 shadow-2xl shadow-lilacfizz/10 border-white/60" title="Final Commitment" headerColor="text-lilacfizz text-3xl font-black mb-4">
             <div className="space-y-6">
                <div className="relative">
                   <Quote className="absolute top-2 left-2 text-lilacfizz/20 w-8 h-8" />
                   <textarea
                      placeholder="I am quitting because..."
                      value={formData.reasonForQuitting}
                      onChange={e => setFormData({...formData, reasonForQuitting: e.target.value})}
                      className="w-full h-32 p-6 bg-lilacfizz/5 rounded-3xl border-2 border-lilacfizz/20 focus:border-lilacfizz focus:ring-4 focus:ring-lilacfizz/10 outline-none resize-none font-medium text-lg text-gray-700 placeholder-lilacfizz/40"
                   />
                </div>
                
                <div className="flex flex-col gap-2">
                   <Input 
                     label="Daily Reminder Time"
                     type="time"
                     value={formData.reminderTime}
                     onChange={e => setFormData({...formData, reminderTime: e.target.value})}
                   />
                </div>

                <div className="flex gap-4 mt-8">
                  <Button variant="ghost" onClick={prevStep}>Back</Button>
                  <Button onClick={submit} variant="lilac" className="flex-1 shadow-lg shadow-lilacfizz/30 h-14 text-lg">
                    Start My New Life
                  </Button>
                </div>
             </div>
          </Card>
        )}

      </div>
    </div>
  );
};

// --- Main App Logic ---
export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'dashboard' | 'chat' | 'urges' | 'alternatives' | 'settings' | 'breathe'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<string>('');
  const [urges, setUrges] = useState<UrgeLog[]>([]);

  // Load data
  useEffect(() => {
    const savedUser = localStorage.getItem('eoa_user');
    const savedUrges = localStorage.getItem('eoa_urges');
    if (savedUser) {
       setUser(JSON.parse(savedUser));
    }
    if (savedUrges) setUrges(JSON.parse(savedUrges));
  }, []);

  // Save Urges
  useEffect(() => {
    localStorage.setItem('eoa_urges', JSON.stringify(urges));
  }, [urges]);

  // Fetch Quote
  useEffect(() => {
    if (user && view === 'dashboard') {
      generateDailyQuote(user.addiction).then(setDailyQuote);
    }
  }, [user, view]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('eoa_user', JSON.stringify(profile));
  };

  const handleLogout = () => {
    if(confirm("Are you sure? This will delete your local data.")) {
      localStorage.clear();
      setUser(null);
      setShowLanding(true);
    }
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const SidebarItem = ({ id, icon, label, colorClass }: { id: typeof view, icon: React.ReactNode, label: string, colorClass: string }) => {
    const isActive = view === id;
    return (
      <button
        onClick={() => { setView(id); setIsSidebarOpen(false); }}
        className={`group flex items-center w-full gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden mb-2 ${
          isActive 
          ? `text-white shadow-lg ${colorClass}` 
          : 'text-gray-400 hover:text-denim hover:bg-white/50'
        }`}
      >
        <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </span>
        <span className="relative z-10">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-gray-800 font-sans selection:bg-lilacfizz selection:text-white overflow-hidden animate-fade-in">
      
      {/* Background Mesh (Subtle) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
         <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-polarsky/20 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[0%] right-[0%] w-[500px] h-[500px] bg-lilacfizz/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-white z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <span className="font-black text-xl text-gray-800 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-mauvelous to-lilacfizz rounded-lg flex items-center justify-center text-white">
            <Sparkles size={16} fill="currentColor" />
          </div>
          EOA
        </span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-denim bg-gray-50 rounded-xl hover:bg-gray-100">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-[280px] bg-white/60 backdrop-blur-xl border-r border-white/50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-[10px_0_30px_-10px_rgba(0,0,0,0.02)]`}>
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-denim to-polarsky rounded-2xl shadow-lg shadow-denim/20 flex items-center justify-center text-white transform rotate-3 hover:rotate-0 transition-all duration-300">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-gray-900">EOA</h1>
              <p className="text-[10px] text-denim font-extrabold uppercase tracking-widest mt-0.5">Recovery OS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto">
          <p className="px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Menu</p>
          <SidebarItem id="dashboard" icon={<Home size={20} />} label="Overview" colorClass="bg-gradient-to-r from-denim to-[#7D8EAB] shadow-denim/30" />
          <SidebarItem id="urges" icon={<TrendingUp size={20} />} label="Urge Tracker" colorClass="bg-gradient-to-r from-mauvelous to-[#D17585] shadow-mauvelous/30" />
          <SidebarItem id="chat" icon={<MessageSquare size={20} />} label="AI Companion" colorClass="bg-gradient-to-r from-lilacfizz to-[#B089AD] shadow-lilacfizz/30" />
          <SidebarItem id="alternatives" icon={<HeartHandshake size={20} />} label="Strategies" colorClass="bg-gradient-to-r from-polarsky to-denim shadow-polarsky/30" />
          <SidebarItem id="breathe" icon={<Wind size={20} />} label="Breathing Space" colorClass="bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-400/30" />
          <SidebarItem id="settings" icon={<Settings size={20} />} label="Settings" colorClass="bg-gray-800" />
        </nav>

        <div className="p-6">
          <div className="bg-gradient-to-br from-white to-polarsky/20 p-5 rounded-3xl border border-white shadow-lg shadow-polarsky/10 mb-4">
             <div className="flex items-center gap-3 mb-2">
               <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
               <span className="text-xs font-bold text-denim-dark uppercase tracking-wide">Status: Active</span>
             </div>
             <p className="text-xs text-gray-500 font-medium">Keep fighting, {user.name.split(' ')[0]}.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center w-full gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-mauvelous hover:bg-mauvelous/10 transition-colors mb-4">
            <LogOut size={16} />
            <span>SIGN OUT</span>
          </button>
          
          {/* Small Credits in Sidebar */}
          <div className="text-[9px] text-gray-300 text-center font-bold uppercase tracking-wider">
             Project by <br/> 
             Anoushay, Zainab, Aima, Abeera
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-24 lg:pt-0 h-full overflow-hidden relative z-10">
        <div className="h-full overflow-y-auto p-6 lg:p-10 scrollbar-hide">
          <div className="max-w-6xl mx-auto min-h-full flex flex-col">
            {/* Dynamic Header */}
            <div className="mb-10 animate-slide-up">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2 tracking-tighter">
                {view === 'dashboard' && <span className="bg-clip-text text-transparent bg-gradient-to-r from-denim to-gray-600">Welcome back, {user.name.split(' ')[0]}</span>}
                {view === 'urges' && <span className="text-mauvelous">Urge Monitor</span>}
                {view === 'chat' && <span className="text-lilacfizz">Soul Companion</span>}
                {view === 'alternatives' && <span className="text-denim">Coping Strategies</span>}
                {view === 'breathe' && <span className="text-green-500">Breathing Space</span>}
                {view === 'settings' && "Preferences"}
              </h2>
              <p className="text-gray-500 font-medium text-lg ml-1">
                {view === 'dashboard' && "Here is your progress report."}
                {view === 'urges' && "Track patterns to break them."}
                {view === 'chat' && "Vent, ask, and heal with AI."}
                {view === 'alternatives' && "Rewire your brain with new habits."}
                {view === 'breathe' && "Find your calm in the chaos."}
                {view === 'settings' && "Manage your account."}
              </p>
            </div>

            {/* Content Views */}
            <div className="flex-1 animate-slide-up-delay pb-10">
              {view === 'dashboard' && (
                <DashboardView user={user} dailyQuote={dailyQuote} urges={urges} />
              )}
              {view === 'urges' && (
                <UrgesView urges={urges} onLogUrge={(u) => setUrges([u, ...urges])} />
              )}
              {view === 'chat' && (
                <ChatView user={user} />
              )}
              {view === 'alternatives' && (
                <AlternativesView user={user} />
              )}
              {view === 'breathe' && (
                 <BreathingView />
              )}
              {view === 'settings' && (
                <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-gray-200/50 max-w-3xl">
                    <h3 className="text-2xl font-black mb-8 text-gray-800 flex items-center gap-3">
                       <div className="p-3 bg-gray-100 rounded-xl"><Settings size={24} /></div>
                       Profile & Preferences
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                          <span className="block text-denim text-[10px] font-extrabold uppercase tracking-widest mb-3">Display Name</span>
                          <span className="font-bold text-xl text-gray-800 group-hover:text-denim transition-colors">{user.name}</span>
                      </div>
                      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                          <span className="block text-denim text-[10px] font-extrabold uppercase tracking-widest mb-3">Addiction</span>
                          <span className="font-bold text-xl text-gray-800 group-hover:text-denim transition-colors">{user.addiction}</span>
                      </div>
                      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                          <span className="block text-denim text-[10px] font-extrabold uppercase tracking-widest mb-3">Freedom Date</span>
                          <span className="font-bold text-xl text-gray-800 group-hover:text-denim transition-colors">{new Date(user.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                          <span className="block text-denim text-[10px] font-extrabold uppercase tracking-widest mb-3">Reminder</span>
                          <span className="font-bold text-xl text-gray-800 group-hover:text-denim transition-colors">{user.reminderTime}</span>
                      </div>
                    </div>
                    <div className="mt-8 p-8 bg-lilacfizz/10 rounded-[2rem] border border-lilacfizz/20 relative overflow-hidden">
                       <Quote className="absolute top-4 right-4 text-lilacfizz/20 w-16 h-16" />
                       <span className="block text-lilacfizz text-[10px] font-extrabold uppercase tracking-widest mb-4">Your Oath</span>
                       <p className="text-xl text-gray-700 font-medium italic relative z-10 leading-relaxed">"{user.reasonForQuitting}"</p>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-Views ---

const DashboardView = ({ user, dailyQuote, urges }: { user: UserProfile, dailyQuote: string, urges: UrgeLog[] }) => {
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const startDate = useMemo(() => parseISO(user.startDate), [user.startDate]);
  const daysSober = differenceInDays(now, startDate);
  const hoursSober = differenceInHours(now, startDate) % 24;

  // Chart data: Last 7 Days rolling window
  const chartData = useMemo(() => {
     const end = new Date();
     // Create an array of the last 7 days including today
     const days = Array.from({length: 7}, (_, i) => {
        const d = subDays(end, 6 - i); // Start from 6 days ago up to today
        return { name: format(d, 'EEE'), date: format(d, 'yyyy-MM-dd'), count: 0 };
     });

     urges.forEach(u => {
        const dStr = format(parseISO(u.timestamp), 'yyyy-MM-dd');
        const day = days.find(d => d.date === dStr);
        if (day) day.count++;
     });
     return days;
  }, [urges]);

  // Milestone Badges Logic
  const badges = [
     { days: 1, label: '24 Hours', icon: <Clock size={24} />, color: 'bg-denim' },
     { days: 3, label: '3 Days', icon: <CheckCircle2 size={24} />, color: 'bg-polarsky' },
     { days: 7, label: '1 Week', icon: <TrophyBadge size={24} />, color: 'bg-lilacfizz' },
     { days: 30, label: '1 Month', icon: <Crown size={24} />, color: 'bg-mauvelous' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Quote */}
      <div className="relative overflow-hidden bg-gradient-to-r from-lilacfizz via-[#D4A5D1] to-mauvelous p-12 rounded-[3rem] text-white shadow-2xl shadow-lilacfizz/30 transform hover:scale-[1.01] transition-transform duration-500 group">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 mix-blend-overlay"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-denim opacity-30 rounded-full blur-2xl mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-3xl">
           <div className="flex items-center gap-3 mb-6 text-white/90">
             <div className="h-[3px] w-12 bg-white/60 rounded-full"></div>
             <p className="text-xs font-black uppercase tracking-widest">Daily Wisdom</p>
           </div>
           <p className="text-3xl md:text-5xl font-serif italic leading-tight drop-shadow-md">"{dailyQuote}"</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
           label="Sober Streak" 
           value={`${daysSober}d ${hoursSober}h`} 
           subValue="Since you started" 
           icon={<Clock size={28} />}
           colorTheme="denim"
        />
        <StatCard 
           label="Money Saved" 
           value={`$${(daysSober * (user.dailyCost || 12)).toFixed(0)}`} 
           subValue="Invest in yourself" 
           icon={<TrendingUp size={28} />}
           colorTheme="sky"
        />
        <StatCard 
           label="Urges Resisted" 
           value={urges.length} 
           subValue="Moments of strength" 
           icon={<ShieldAlert size={28} />}
           colorTheme="mauve"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <Card title="Last 7 Days Resilience" className="h-[24rem] shadow-xl border-white/60">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                   <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#92A1C3', fontSize: 13, fontWeight: 700}} 
                      dy={15}
                   />
                   <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#92A1C3', fontSize: 13, fontWeight: 600}} 
                      allowDecimals={false} 
                   />
                   <Tooltip 
                      cursor={{fill: '#F3F4F6', radius: 10}} 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px', 
                        border: '1px solid #fff', 
                        boxShadow: '0 20px 40px -10px rgba(146, 161, 195, 0.3)',
                        padding: '16px'
                      }} 
                      itemStyle={{color: '#92A1C3', fontWeight: 700}}
                      labelStyle={{color: '#6A7B9F', fontWeight: 800, marginBottom: '0.5rem'}}
                   />
                   <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={32}>
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#F3A0AD' : '#BED1E3'} />
                     ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </Card>

          {/* Badges Section */}
          <Card title="Milestones Unlocked" className="h-[24rem] overflow-y-auto shadow-xl border-white/60">
             <div className="grid grid-cols-2 gap-4">
               {badges.map((badge, idx) => {
                 const isUnlocked = daysSober >= badge.days;
                 return (
                   <div key={idx} className={`p-4 rounded-[2rem] border transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 ${
                     isUnlocked 
                       ? `bg-white shadow-lg ${badge.color.replace('bg-', 'shadow-')}/20 border-white`
                       : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
                   }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-inner mb-1 ${isUnlocked ? badge.color : 'bg-gray-300'}`}>
                         {badge.icon}
                      </div>
                      <span className="font-bold text-gray-800">{badge.label}</span>
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full ${
                        isUnlocked ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                   </div>
                 )
               })}
             </div>
          </Card>
      </div>
    </div>
  );
};

// Icon helper
const TrophyBadge = ({size}: {size: number}) => <Medal size={size} />;

const BreathingView = () => {
   return (
      <div className="flex flex-col items-center justify-center h-full relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white to-green-50 shadow-2xl border border-white">
         <div className="absolute top-10 left-0 w-full text-center z-10">
            <h3 className="text-3xl font-black text-gray-800 mb-2">Box Breathing</h3>
            <p className="text-gray-500 font-medium">Follow the rhythm to reduce anxiety.</p>
         </div>

         {/* Breathing Circle */}
         <div className="relative flex items-center justify-center">
            <div className="w-64 h-64 bg-green-200/30 rounded-full animate-breathe absolute mix-blend-multiply blur-xl"></div>
            <div className="w-64 h-64 bg-blue-200/30 rounded-full animate-breathe absolute mix-blend-multiply blur-xl animation-delay-200"></div>
            
            <div className="relative z-10 w-48 h-48 bg-white/50 backdrop-blur-sm rounded-full border border-white shadow-2xl flex items-center justify-center animate-breathe">
               <span className="text-green-600 font-black text-lg tracking-widest uppercase">Breathe</span>
            </div>
         </div>

         <div className="absolute bottom-10 z-10 bg-white/60 backdrop-blur-md px-8 py-4 rounded-2xl border border-white shadow-sm">
            <p className="text-denim-dark font-bold text-center">4s In • 4s Hold • 4s Out</p>
         </div>
      </div>
   );
};

const UrgesView = ({ urges, onLogUrge }: { urges: UrgeLog[], onLogUrge: (u: UrgeLog) => void }) => {
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [notes, setNotes] = useState('');

  const handleLog = () => {
    if (!trigger) return;
    const newUrge: UrgeLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      intensity,
      trigger,
      notes
    };
    onLogUrge(newUrge);
    setTrigger('');
    setNotes('');
    setIntensity(5);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
       {/* Input Section */}
       <div className="lg:col-span-5 space-y-8">
          <Card className="border border-mauvelous/20 overflow-visible relative shadow-2xl shadow-mauvelous/10" noPadding>
             <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-mauvelous to-lilacfizz"></div>
             <div className="p-10 space-y-8">
                <div>
                   <h3 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                     <div className="p-3 bg-mauvelous/10 rounded-2xl text-mauvelous"><Zap size={24} fill="currentColor" /></div>
                     Log Craving
                   </h3>
                   
                   {/* Intensity Slider */}
                   <div className="mb-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <div className="flex justify-between mb-6">
                        <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Intensity</label>
                        <span className={`font-bold px-4 py-1 rounded-full text-sm ${intensity > 7 ? 'bg-mauvelous text-white' : 'bg-gray-200 text-gray-600'}`}>
                           {intensity}/10
                        </span>
                      </div>
                      <input 
                          type="range" min="1" max="10" 
                          value={intensity} 
                          onChange={e => setIntensity(parseInt(e.target.value))}
                          className="w-full h-4 bg-white rounded-full appearance-none cursor-pointer accent-mauvelous shadow-inner"
                      />
                   </div>

                   <div className="space-y-5">
                      <Input 
                        label="Trigger"
                        placeholder="Stress, Boredom, Seeing friends..."
                        value={trigger}
                        onChange={e => setTrigger(e.target.value)}
                      />
                      <div className="relative">
                         <label className="block text-xs font-extrabold text-denim uppercase tracking-widest mb-2 ml-1">Notes</label>
                         <textarea 
                           className="w-full px-6 py-4 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-polarsky/20 focus:border-denim focus:ring-4 focus:ring-polarsky/20 outline-none transition-all duration-300 text-gray-800 font-medium placeholder-gray-400 min-h-[100px]"
                           placeholder="How did you feel?"
                           value={notes}
                           onChange={e => setNotes(e.target.value)}
                         />
                      </div>
                   </div>
                </div>
                <Button onClick={handleLog} variant="mauve" className="w-full shadow-xl shadow-mauvelous/20 h-16 text-lg" icon={<CheckCircle2 />}>
                  Log This Moment
                </Button>
             </div>
          </Card>
          
          <div className="bg-gradient-to-br from-polarsky to-denim p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-denim/20">
             <div className="absolute top-[-30px] right-[-30px] bg-white/20 w-40 h-40 rounded-full blur-3xl mix-blend-overlay"></div>
             <div className="relative z-10">
               <div className="flex items-center gap-4 mb-4">
                 <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                   <Droplets size={24} />
                 </div>
                 <h4 className="font-black text-2xl">Urge Surfing</h4>
               </div>
               <p className="text-base font-medium leading-relaxed opacity-90">
                  Imagine the urge as a wave. Do not fight it. Observe it rise, crest, and break. It will pass in <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-white">3 minutes</span> if you just breathe through it.
               </p>
             </div>
          </div>
       </div>

       {/* Timeline Section */}
       <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="font-black text-2xl text-gray-800">Recent Activity</h3>
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">History</span>
          </div>
          
          <div className="relative pl-10 border-l-2 border-dashed border-gray-200 space-y-6 pb-10">
            {urges.length === 0 && (
               <div className="bg-white/60 backdrop-blur-sm p-12 rounded-[2.5rem] border border-gray-200 text-center shadow-sm ml-[-20px]">
                  <ShieldAlert size={48} className="mx-auto text-polarsky mb-4" />
                  <p className="text-gray-400 font-bold text-lg">No urges logged yet.</p>
                  <p className="text-sm text-gray-300">Stay strong!</p>
               </div>
            )}
            {urges.map((urge, idx) => (
               <div key={urge.id} className="relative group perspective">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[51px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-[4px] border-white shadow-md transition-all duration-300 group-hover:scale-125 z-10 ${
                      urge.intensity > 7 ? 'bg-mauvelous' : urge.intensity > 4 ? 'bg-lilacfizz' : 'bg-denim'
                  }`}></div>

                  <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(146,161,195,0.15)] transition-all duration-300 overflow-hidden group-hover:-translate-y-1 transform">
                     <div className="flex items-stretch">
                        <div className={`w-20 flex flex-col items-center justify-center text-white font-black text-xl ${
                           urge.intensity > 7 ? 'bg-gradient-to-b from-mauvelous to-[#D17585]' :
                           urge.intensity > 4 ? 'bg-gradient-to-b from-lilacfizz to-[#B089AD]' :
                           'bg-gradient-to-b from-denim to-[#7D8EAB]'
                        }`}>
                           {urge.intensity}
                        </div>
                        <div className="p-6 flex-1">
                           <div className="flex justify-between items-start mb-2">
                              <p className="font-bold text-gray-800 text-lg">{urge.trigger}</p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                <Calendar size={12} />
                                {format(parseISO(urge.timestamp), 'MMM d, h:mm a')}
                              </p>
                           </div>
                           {urge.notes && <p className="text-sm text-gray-500 font-medium italic">"{urge.notes}"</p>}
                        </div>
                     </div>
                  </div>
               </div>
            ))}
          </div>
       </div>
    </div>
  );
};

const ChatView = ({ user }: { user: UserProfile }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: `Hi ${user.name}. I'm here to support your journey quitting ${user.addiction}. How are you feeling today?` }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    let fullResponse = "";
    const responseId = (Date.now() + 1).toString();
    
    setMessages(prev => [...prev, { id: responseId, role: 'model', text: '' }]);

    await streamChatResponse([...messages, userMsg], input, (chunk) => {
       fullResponse += chunk;
       setMessages(prev => prev.map(m => m.id === responseId ? { ...m, text: fullResponse } : m));
    });
    
    setLoading(false);
  };

  return (
    <div className="h-[750px] flex flex-col bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white shadow-2xl shadow-lilacfizz/10 overflow-hidden relative">
       {/* Header */}
       <div className="relative z-20 bg-white/90 backdrop-blur-md px-10 py-6 border-b border-gray-100 flex items-center gap-5">
         <div className="relative">
            <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-tr from-lilacfizz to-mauvelous flex items-center justify-center text-white shadow-lg shadow-lilacfizz/30">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-[3px] border-white rounded-full"></div>
         </div>
         <div>
            <h3 className="font-black text-xl text-gray-800">AI Companion</h3>
            <p className="text-xs text-lilacfizz font-bold uppercase tracking-widest mt-0.5">Always Online</p>
         </div>
       </div>

       <div className="flex-1 overflow-y-auto p-8 space-y-8 z-10 scroll-smooth bg-gradient-to-b from-transparent to-gray-50/50">
          {messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[80%] p-6 text-[15px] leading-relaxed shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                   msg.role === 'user' 
                   ? 'bg-gradient-to-br from-denim to-[#7D8EAB] text-white rounded-[2rem] rounded-tr-sm shadow-denim/20' 
                   : 'bg-white border border-gray-100 text-gray-700 rounded-[2rem] rounded-tl-sm'
                }`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {loading && (
             <div className="flex justify-start animate-fade-in">
               <div className="bg-white border border-gray-100 p-6 rounded-[2rem] rounded-tl-sm shadow-sm">
                  <div className="flex gap-2">
                     <div className="w-2.5 h-2.5 bg-lilacfizz rounded-full animate-bounce" />
                     <div className="w-2.5 h-2.5 bg-lilacfizz rounded-full animate-bounce delay-100" />
                     <div className="w-2.5 h-2.5 bg-lilacfizz rounded-full animate-bounce delay-200" />
                  </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       <div className="p-6 bg-white z-20 border-t border-gray-50">
          <div className="flex gap-3 bg-gray-50 p-3 pl-8 rounded-[2.5rem] border border-gray-100 focus-within:border-lilacfizz focus-within:ring-4 focus-within:ring-lilacfizz/10 transition-all shadow-inner">
             <input 
                placeholder="Type your message..." 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 font-medium text-lg"
             />
             <button 
               onClick={handleSend} 
               disabled={loading || !input.trim()} 
               className="rounded-[1.5rem] w-14 h-14 flex items-center justify-center bg-gradient-to-r from-lilacfizz to-mauvelous text-white hover:shadow-lg hover:shadow-lilacfizz/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
             >
                <ArrowRight size={24} />
             </button>
          </div>
       </div>
    </div>
  );
};

const AlternativesView = ({ user }: { user: UserProfile }) => {
   const [suggestions, setSuggestions] = useState<string>('');
   const [loading, setLoading] = useState(false);

   const fetchSuggestions = async (intensity: number) => {
      setLoading(true);
      const result = await getSmartAlternatives(user.addiction, intensity);
      setSuggestions(result);
      setLoading(false);
   };

   return (
      <div className="space-y-10 animate-fade-in">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="space-y-8">
               <Card title="Immediate Relief" headerColor="text-denim text-2xl font-black" className="border border-white shadow-2xl shadow-denim/10">
                  <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                     Select your current craving level. Our AI will generate a specific, actionable strategy to override the urge immediately.
                  </p>
                  <div className="space-y-5">
                     <button 
                        onClick={() => fetchSuggestions(3)}
                        className="w-full flex items-center justify-between p-6 rounded-[2rem] border border-polarsky/30 bg-white hover:bg-polarsky/5 hover:border-denim/50 hover:shadow-xl hover:shadow-polarsky/10 transition-all group transform hover:-translate-y-1"
                     >
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-polarsky/20 flex items-center justify-center text-denim-dark shadow-sm">
                              <span className="font-bold">Low</span>
                           </div>
                           <span className="font-bold text-gray-700 text-lg group-hover:text-denim-dark transition-colors">Mild Craving</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-denim group-hover:translate-x-2 transition-all" />
                     </button>
                     
                     <button 
                         onClick={() => fetchSuggestions(6)}
                         className="w-full flex items-center justify-between p-6 rounded-[2rem] border border-lilacfizz/30 bg-white hover:bg-lilacfizz/5 hover:border-lilacfizz/50 hover:shadow-xl hover:shadow-lilacfizz/10 transition-all group transform hover:-translate-y-1"
                     >
                         <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-lilacfizz/20 flex items-center justify-center text-lilacfizz shadow-sm">
                              <span className="font-bold">Mid</span>
                           </div>
                           <span className="font-bold text-gray-700 text-lg group-hover:text-lilacfizz transition-colors">Moderate Craving</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-lilacfizz group-hover:translate-x-2 transition-all" />
                     </button>

                     <button 
                         onClick={() => fetchSuggestions(9)}
                         className="w-full flex items-center justify-between p-6 rounded-[2rem] border border-mauvelous/30 bg-white hover:bg-mauvelous/5 hover:border-mauvelous/50 hover:shadow-xl hover:shadow-mauvelous/10 transition-all group transform hover:-translate-y-1"
                     >
                         <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-mauvelous/20 flex items-center justify-center text-mauvelous shadow-sm">
                              <span className="font-bold">High</span>
                           </div>
                           <span className="font-bold text-gray-700 text-lg group-hover:text-mauvelous transition-colors">Severe Urge</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-mauvelous group-hover:translate-x-2 transition-all" />
                     </button>
                  </div>
               </Card>
            </div>

            <Card className="bg-gradient-to-b from-white/80 to-polarsky/10 border-white shadow-2xl shadow-gray-200/50 min-h-[500px] relative overflow-hidden" headerColor="text-gray-800">
               {loading ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-polarsky">
                     <div className="animate-spin h-16 w-16 border-[6px] border-polarsky/20 border-t-denim rounded-full mb-6" />
                     <p className="font-black text-denim text-lg animate-pulse tracking-wide">AI IS THINKING...</p>
                  </div>
               ) : suggestions ? (
                  <div className="prose prose-p:text-gray-600 prose-li:text-gray-600 prose-li:marker:text-denim p-2">
                     <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-gradient-to-r from-denim to-polarsky text-white rounded-full font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-denim/20">
                        <Sparkles size={12} fill="currentColor" />
                        <span>AI Strategy</span>
                     </div>
                     <div className="space-y-6">
                        {suggestions.split('\n').filter(s => s.trim()).map((line, idx) => (
                           <div key={idx} className="flex gap-5 items-start bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                              <div className="mt-1 bg-green-100 p-1 rounded-full shrink-0">
                                 <CheckCircle2 size={20} className="text-green-500" strokeWidth={3} />
                              </div>
                              <p className="text-lg leading-relaxed m-0 text-gray-700 font-medium">{line.replace(/^-\s*/, '')}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-300">
                     <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <HeartHandshake size={48} className="opacity-30 text-denim" />
                     </div>
                     <p className="text-lg font-bold text-gray-400">Select intensity to generate advice</p>
                  </div>
               )}
            </Card>
         </div>
      </div>
   );
};