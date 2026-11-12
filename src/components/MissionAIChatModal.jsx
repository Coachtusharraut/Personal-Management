import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  User, 
  CheckCircle2, 
  Plus, 
  Compass, 
  Target, 
  BookOpen, 
  Flame, 
  Zap, 
  Lightbulb, 
  Brain,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SPECIALISTS = [
  {
    id: 'strategist',
    name: 'Mission Strategist',
    role: 'Long-Term Vision & Business Models',
    icon: Compass,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    description: 'Thinks 5–10 years ahead, analyzes obesity market economics, challenges weak assumptions, and designs high-leverage experiments.'
  },
  {
    id: 'coach',
    name: 'Execution Coach',
    role: 'Daily Tactical Velocity & Habits',
    icon: Target,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: 'Ruthlessly eliminates busywork, locks in the Core Three daily quests, tracks consistency, and drives consultation follow-ups.'
  },
  {
    id: 'storyteller',
    name: 'Story Creator',
    role: 'Legacy Chronicles & Narrative Worlds',
    icon: BookOpen,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    description: 'Transforms real-life wins into Mahabharata/Ramayana epic chapters, crafts sci-fi episodes, and writes inspiring decision trees.'
  }
];

const QUICK_ACTIONS = [
  'Plan my day around Speak to Impact',
  'Challenge my assumptions on ₹1L challenge',
  'Write a 60s video script on Visceral Fat',
  'How to close a ₹25,000 coaching client',
  'Draft WhatsApp follow-up for consultation',
  'Analyze my ₹1 Lakh revenue pacing'
];

export default function MissionAIChatModal({ 
  isOpen, 
  onClose, 
  missionState, 
  onAddQuest 
}) {
  const [activeSpecialistId, setActiveSpecialistId] = useState('strategist');
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'ai',
      specialistId: 'strategist',
      text: "Namaste Tushar. I am your LifeOS Mission Guide. Let's turn your real priorities into a clear plan. What is the one outcome that would make today meaningful?",
      timestamp: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeSpecialist = SPECIALISTS.find(s => s.id === activeSpecialistId) || SPECIALISTS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate intelligent specialist reasoning
    setTimeout(() => {
      let aiReply = '';
      const lower = text.toLowerCase();

      if (activeSpecialistId === 'strategist') {
        if (lower.includes('challenge') || lower.includes('assumption')) {
          aiReply = `Strategic Critique: You assume that high-ticket health coaching (₹25k+) requires long sales pitches. In reality, urban Indian executives aren't buying workouts—they are buying freedom from chronic 3 PM fatigue and fear of sudden cardiac events. Instead of explaining diet theory, challenge them with a diagnostic audit: "If your current diet worked, why does your waist-to-height ratio still flag metabolic risk?"`;
        } else if (lower.includes('revenue') || lower.includes('pacing')) {
          aiReply = `Revenue Pacing Audit: Target is ₹1,00,000 by Nov 20. You already have ₹25,000 collected + ₹35,000 committed. That leaves ₹40,000 to bridge in 8 days. 2 clients at ₹20,000 or 1 corporate keynote at ₹50,000 achieves 100% of the goal. Focus 80% of energy on closing the existing ₹35,000 committed payments before chasing cold outreach.`;
        } else {
          aiReply = `Mission Strategist Analysis: For ReshapeNation, our unfair advantage is that people love listening when you speak. To reach national scale for an Obesity-Free India, we must move from 1-on-1 time trading to cohort leverage. Recommendation: Host a 45-minute live masterclass this Sunday and offer exactly 5 seats in the 90-Day Metabolic Transformation Cohort.`;
        }
      } else if (activeSpecialistId === 'coach') {
        if (lower.includes('plan') || lower.includes('day')) {
          aiReply = `Execution Coach Directives for Today:\n1. Conduct your 2 scheduled health consultations with zero distractions.\n2. Release the 90-second Visceral Fat video before 4 PM.\n3. Send 3 personalized audio follow-ups to committed prospects with clear payment links.\n4. Complete your 45-min strength training session. No skipped workouts for the leader of ReshapeNation!`;
        } else if (lower.includes('whatsapp') || lower.includes('follow-up')) {
          aiReply = `High-Conversion WhatsApp Script:\n"Hi [Name], was reviewing our metabolic notes from our call. You mentioned afternoon energy crashes are hurting your work focus. I'm finalizing the 5 slots for the 90-Day ReshapeNation Reset this week. Let's get your onboarding kit locked in today so we hit the ground running. Here is the direct link: [Link]. Let me know once done!"`;
        } else {
          aiReply = `Execution Coach Insight: Consistency is your weapon. Don't worry about tomorrow's tasks yet. Lock in the Core Three on your Daily Mission Board right now. Finish what is in front of you.`;
        }
      } else {
        // Story Creator
        aiReply = `Story Creator Narrative: In Chapter 3 of 'The Warrior's Path', the hero stands at the edge of the Virata plain. Every client you help break free from visceral obesity is not just a customer—they are reclaiming their life's vitality from the grips of the modern metabolic trap. Keep your bow drawn, Vanguard!`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          specialistId: activeSpecialistId,
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleConvertMessageToQuest = (msgText) => {
    if (!onAddQuest) return;
    onAddQuest({
      title: `AI Action: ${msgText.slice(0, 50)}...`,
      description: msgText,
      category: 'Business Development',
      tier: 'top3',
      priority: 'urgent',
      durationMins: 30,
      xp: 100
    });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c1527] border border-amber-500/40 rounded-3xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-amber-500 text-slate-950 font-black">
              <Bot className="w-5 h-5 stroke-[2.5]" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[#fdfbf7] flex items-center gap-1.5">
                <span>Ask My Mission AI</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Asia/Kolkata
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Context: Obesity-Free India & Speak to Impact Challenge</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Specialists Switcher Bar */}
        <div className="p-2.5 bg-[#090f1e] border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {SPECIALISTS.map((spec) => {
            const Icon = spec.icon;
            const isActive = activeSpecialistId === spec.id;

            return (
              <button
                key={spec.id}
                onClick={() => setActiveSpecialistId(spec.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{spec.name}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#070b14]/70">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 mt-1 font-bold text-xs">
                    AI
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-lg ${
                  isAi 
                    ? 'bg-[#090f1e] border border-amber-500/30 text-slate-200' 
                    : 'bg-amber-500 text-slate-950 font-medium'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  <div className="flex items-center justify-between text-[10px] opacity-70 pt-1">
                    <span>{msg.timestamp}</span>
                    {isAi && (
                      <button
                        onClick={() => handleConvertMessageToQuest(msg.text)}
                        className="hover:underline flex items-center gap-1 font-bold text-amber-300"
                        title="Add as a Daily Quest"
                      >
                        <Plus className="w-3 h-3" />
                        Turn into Quest
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-amber-400 animate-pulse pl-10">
              <Sparkles className="w-4 h-4" />
              <span>{activeSpecialist.name} is synthesizing strategic insights...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips */}
        <div className="p-2.5 bg-[#090f1e] border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
          {QUICK_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action)}
              className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-400 flex-shrink-0 transition truncate"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder={`Ask ${activeSpecialist.name} (strategy, scripts, daily priorities)...`}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500/60 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center justify-center shadow-md shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
