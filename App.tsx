import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  MessageSquare, 
  ShieldAlert, 
  HeartHandshake, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { UserProfile, AddictionType, QuitSpeed, UrgeLog, ChatMessage } from './types';
import { Button, Input, Select, Card, StatCard } from './components/UI';
import { streamChatResponse, generateDailyQuote, getSmartAlternatives } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, differenceInDays, differenceInHours, startOfWeek, addDays, parseISO } from 'date-fns';

// --- Onboarding Component ---
const Onboarding = ({ onComplete }: { onComplete: (profile: UserProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    addiction: AddictionType.CIGARETTES,
    quitSpeed: QuitSpeed.COLD_TURKEY,
    frequencyPerWeek: 0,
    age: 18,
    name: '',
    reasonForQuitting: '',
    reminderTime: '09:00',
    startDate: new Date().toISOString()
  });

  const handleNext = () => setStep(p => p + 1);
  const handleBack = () => setStep(p => p - 1);
  
  const submit = () => {
    if (formData.name && formData.addiction) {
      onComplete(formData as UserProfile);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">End Of Ash</h1>
        <p className="text-gray-500">Reclaim your life, one day at a time.</p>
      </div>

      <div className="w-full bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Let's get to know you</h2>
            <Input 
              label="What should we call you?" 
              placeholder="Your Name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
             <Input 
              label="How old are you?" 
              type="number"
              value={formData.age} 
              onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
            />
            <Button onClick={handleNext} disabled={!formData.name} className="w-full">Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">What do you want to quit?</h2>
            <Select 
              label="Select Addiction"
              options={Object.values(AddictionType).map(v => ({ label: v, value: v }))}
              value={formData.addiction}
              onChange={e => setFormData({...formData, addiction: e.target.value as AddictionType})}
            />
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Frequency per week</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                value={formData.frequencyPerWeek} 
                onChange={e => setFormData({...formData, frequencyPerWeek: parseInt(e.target.value)})} 
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Occasional</span>
                <span>{formData.frequencyPerWeek} times</span>
                <span>Heavy</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={handleBack} className="flex-1">Back</Button>
              <Button onClick={handleNext} className="flex-1">Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Your Goals</h2>
            <Select 
              label="How fast do you want to quit?"
              options={Object.values(QuitSpeed).map(v => ({ label: v, value: v }))}
              value={formData.quitSpeed}
              onChange={e => setFormData({...formData, quitSpeed: e.target.value as QuitSpeed})}
            />
            <Input 
              label="Why are you quitting?" 
              placeholder="For my health, family, money..." 
              value={formData.reasonForQuitting}
              onChange={e => setFormData({...formData, reasonForQuitting: e.target.value})}
            />
            <Input 
               label="Daily Reminder Time"
               type="time"
               value={formData.reminderTime}
               onChange={e => setFormData({...formData, reminderTime: e.target.value})}
            />
            <div className="flex gap-4">
              <Button variant="secondary" onClick={handleBack} className="flex-1">Back</Button>
              <Button onClick={submit} className="flex-1">Start Journey</Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i === step ? 'bg-black' : 'bg-gray-200'}`} />
        ))}
      </div>
    </div>
  );
};

// --- Main App Logic ---
export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'dashboard' | 'chat' | 'urges' | 'alternatives' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<string>('');
  const [urges, setUrges] = useState<UrgeLog[]>([]);

  // Load data
  useEffect(() => {
    const savedUser = localStorage.getItem('eoa_user');
    const savedUrges = localStorage.getItem('eoa_urges');
    if (savedUser) setUser(JSON.parse(savedUser));
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
    }
  };

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const SidebarItem = ({ id, icon, label }: { id: typeof view, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => { setView(id); setIsSidebarOpen(false); }}
      className={`group flex items-center w-full gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        view === id ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-black'
      }`}
      title={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-50 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">End Of Ash</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tight">End Of Ash</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Sobriety Tracker</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem id="dashboard" icon={<Home size={20} />} label="Dashboard" />
          <SidebarItem id="urges" icon={<TrendingUp size={20} />} label="Urge Tracker" />
          <SidebarItem id="chat" icon={<MessageSquare size={20} />} label="AI Assistant" />
          <SidebarItem id="alternatives" icon={<HeartHandshake size={20} />} label="Alternatives" />
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <SidebarItem id="settings" icon={<Settings size={20} />} label="Settings" />
          <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
            <span>Reset App</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-16 lg:pt-0 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto p-6 lg:p-12">
          {/* Header */}
          <div className="mb-8">
             <h2 className="text-3xl font-bold text-gray-900 mb-2">
               {view === 'dashboard' && `Welcome back, ${user.name}`}
               {view === 'urges' && 'Urge Tracker'}
               {view === 'chat' && 'Support Assistant'}
               {view === 'alternatives' && 'Healthy Alternatives'}
               {view === 'settings' && 'Settings'}
             </h2>
             <p className="text-gray-500">
               {view === 'dashboard' && "Here is your progress overview."}
               {view === 'urges' && "Log your cravings and identify triggers."}
               {view === 'chat' && "Ask me anything about your journey."}
             </p>
          </div>

          {/* Content Views */}
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
           {view === 'settings' && (
             <div className="bg-white p-8 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Your Profile</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div className="p-4 bg-gray-50 rounded-lg">
                      <span className="block text-gray-500 mb-1">Name</span>
                      <span className="font-medium">{user.name}</span>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-lg">
                      <span className="block text-gray-500 mb-1">Addiction</span>
                      <span className="font-medium">{user.addiction}</span>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-lg">
                      <span className="block text-gray-500 mb-1">Start Date</span>
                      <span className="font-medium">{new Date(user.startDate).toLocaleDateString()}</span>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-lg">
                      <span className="block text-gray-500 mb-1">Reason</span>
                      <span className="font-medium">{user.reasonForQuitting}</span>
                   </div>
                </div>
                <p className="mt-8 text-gray-400 text-sm">Version 1.0.0 • End Of Ash</p>
             </div>
          )}
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

  // Chart Data preparation
  const chartData = useMemo(() => {
     // Last 7 days urge count
     const days = Array.from({length: 7}, (_, i) => {
        const d = addDays(startOfWeek(new Date()), i);
        return {
           name: format(d, 'EEE'),
           date: format(d, 'yyyy-MM-dd'),
           count: 0
        };
     });

     urges.forEach(u => {
        const dStr = format(parseISO(u.timestamp), 'yyyy-MM-dd');
        const day = days.find(d => d.date === dStr);
        if (day) day.count++;
     });
     return days;
  }, [urges]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quote Banner */}
      <div className="bg-black text-white p-6 rounded-xl flex items-center justify-between shadow-lg">
        <div>
           <p className="text-xs font-bold text-gray-400 uppercase mb-2">Daily Motivation</p>
           <p className="text-lg md:text-xl font-medium italic">"{dailyQuote}"</p>
        </div>
        <div className="hidden md:block">
           <ShieldAlert className="text-gray-500" size={32} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
           label="Clean Streak" 
           value={`${daysSober} Days`} 
           subValue={`${hoursSober} Hours`} 
           icon={<Clock size={24} />}
        />
        <StatCard 
           label="Money Saved (Est.)" 
           value={`$${(daysSober * (user.dailyCost || 10)).toFixed(0)}`} 
           subValue="Keep it up!" 
           icon={<TrendingUp size={24} />}
        />
        <StatCard 
           label="Urges Resisted" 
           value={urges.length} 
           subValue="You are stronger." 
           icon={<ShieldAlert size={24} />}
        />
      </div>

      {/* Chart */}
      <Card title="Urge Frequency (This Week)" className="h-80">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999'}} />
               <YAxis axisLine={false} tickLine={false} tick={{fill: '#999'}} allowDecimals={false} />
               <Tooltip cursor={{fill: '#f9f9f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
               <Bar dataKey="count" fill="#111" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
         </ResponsiveContainer>
      </Card>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
       <div className="space-y-6">
          <Card title="Log a Craving">
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Intensity: {intensity}/10</label>
                   <input 
                      type="range" min="1" max="10" 
                      value={intensity} 
                      onChange={e => setIntensity(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                   />
                </div>
                <Input 
                   label="Trigger (What caused it?)" 
                   placeholder="e.g., Stress, Boredom, Saw someone smoking"
                   value={trigger}
                   onChange={e => setTrigger(e.target.value)}
                />
                <Input 
                   label="Notes (Optional)" 
                   placeholder="How did you feel?"
                   value={notes}
                   onChange={e => setNotes(e.target.value)}
                />
                <Button onClick={handleLog} className="w-full">Log Urge</Button>
             </div>
          </Card>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
             <h4 className="font-bold text-blue-900 mb-2">Quick Tip</h4>
             <p className="text-blue-800 text-sm">
                When an urge hits, follow the <strong>3-minute rule</strong>. Most cravings last only about 3 minutes. Distract yourself, drink water, or take 10 deep breaths. It will pass.
             </p>
          </div>
       </div>

       <div className="space-y-4">
          <h3 className="font-bold text-lg">Recent History</h3>
          {urges.length === 0 && <p className="text-gray-400">No urges logged yet. That's great!</p>}
          {urges.map(urge => (
             <div key={urge.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
                <div>
                   <p className="font-medium text-gray-900">{urge.trigger}</p>
                   <p className="text-xs text-gray-400">{format(parseISO(urge.timestamp), 'MMM d, h:mm a')}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                   urge.intensity > 7 ? 'bg-red-100 text-red-800' :
                   urge.intensity > 4 ? 'bg-orange-100 text-orange-800' :
                   'bg-green-100 text-green-800'
                }`}>
                   Level {urge.intensity}
                </div>
             </div>
          ))}
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
    
    // Optimistic UI update with empty model message that we will stream into
    setMessages(prev => [...prev, { id: responseId, role: 'model', text: '' }]);

    await streamChatResponse([...messages, userMsg], input, (chunk) => {
       fullResponse += chunk;
       setMessages(prev => prev.map(m => m.id === responseId ? { ...m, text: fullResponse } : m));
    });
    
    setLoading(false);
  };

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
       <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                   msg.role === 'user' 
                   ? 'bg-black text-white rounded-br-none' 
                   : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                  </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
       </div>
       <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
          <Input 
             placeholder="Type your message..." 
             value={input} 
             onChange={e => setInput(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handleSend()}
             className="bg-white"
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()} className="px-6">
             <ChevronRight size={20} />
          </Button>
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
      <div className="space-y-6 animate-fade-in">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Get Tailored Alternatives">
               <p className="text-sm text-gray-500 mb-6">
                  Select your current craving level to get specific activities or substitutes that match your need for dopamine or distraction.
               </p>
               <div className="space-y-3">
                  <Button variant="secondary" onClick={() => fetchSuggestions(3)} className="w-full justify-between">
                     <span>Mild Craving</span>
                     <span className="text-gray-400 text-xs">Easy distraction</span>
                  </Button>
                  <Button variant="secondary" onClick={() => fetchSuggestions(6)} className="w-full justify-between">
                     <span>Moderate Craving</span>
                     <span className="text-gray-400 text-xs">Need physical action</span>
                  </Button>
                  <Button variant="secondary" onClick={() => fetchSuggestions(9)} className="w-full justify-between border-red-200 text-red-600 hover:bg-red-50">
                     <span>Severe Urge</span>
                     <span className="text-red-400 text-xs">Immediate help</span>
                  </Button>
               </div>
            </Card>

            <Card title="AI Recommendations" className="bg-gray-50 border-dashed border-gray-300">
               {loading ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                     <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mb-2" />
                     <p>Generating tailored ideas...</p>
                  </div>
               ) : suggestions ? (
                  <div className="prose prose-sm prose-p:text-gray-600">
                     <p className="whitespace-pre-wrap">{suggestions}</p>
                  </div>
               ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                     <HeartHandshake size={32} className="mb-2 opacity-20" />
                     <p>Select a level to see suggestions.</p>
                  </div>
               )}
            </Card>
         </div>
      </div>
   );
};
