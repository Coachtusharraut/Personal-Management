import React, { useState } from 'react';
import { 
  DAILY_REMINDERS, 
  CURATED_VIDEOS 
} from '../firebase/missionService';
import { 
  Bell, 
  Play, 
  Sun, 
  Coffee, 
  Moon, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Plus, 
  ExternalLink,
  Flame,
  Volume2,
  Youtube
} from 'lucide-react';

const SLOT_ICONS = {
  morning_prime: Sun,
  afternoon_momentum: Coffee,
  evening_reflection: Moon
};

export default function DailyRemindersView({ 
  missionState, 
  onSaveMissionState, 
  onPlayVideo 
}) {
  const [activeTab, setActiveTab] = useState('rituals'); // 'rituals' | 'library'
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('Obesity & Metabolic Science');
  const [notificationStatus, setNotificationStatus] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const reminders = missionState?.dailyReminders || DAILY_REMINDERS;
  const customVideos = missionState?.customVideos || [];
  const allCuratedVideos = [...CURATED_VIDEOS, ...customVideos];

  // Request browser notification permission
  const handleEnableNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      if (permission === 'granted') {
        new Notification('Tushar LifeOS Reminders Active', {
          body: 'You will receive reminders for Morning Prime (07:00), Midday Momentum (14:00), and Night Debrief (21:30).',
          icon: '/favicon.ico'
        });
      }
    }
  };

  // Toggle checklist item
  const handleToggleChecklist = (slotId, checkIdx) => {
    const updated = reminders.map(slot => {
      if (slot.id === slotId) {
        const updatedChecklist = [...slot.checklist];
        updatedChecklist[checkIdx] = {
          ...updatedChecklist[checkIdx],
          done: !updatedChecklist[checkIdx].done
        };
        return { ...slot, checklist: updatedChecklist };
      }
      return slot;
    });

    onSaveMissionState({ dailyReminders: updated });
  };

  // Add custom video
  const handleAddCustomVideo = (e) => {
    e.preventDefault();
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) return;

    // extract video id
    let videoId = newVideoUrl.trim();
    if (videoId.includes('v=')) {
      videoId = videoId.split('v=')[1]?.split('&')[0];
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1]?.split('?')[0];
    }

    const newVid = {
      id: `custom-vid-${Date.now()}`,
      category: newVideoCategory,
      title: newVideoTitle.trim(),
      videoId: videoId,
      channel: 'Custom Selection',
      duration: 'User Added',
      desc: 'Added to your personal LifeOS growth library.'
    };

    const updated = [newVid, ...customVideos];
    onSaveMissionState({ customVideos: updated });
    setNewVideoTitle('');
    setNewVideoUrl('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1527] via-[#070b14] to-[#141b2d] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5" />
              Daily 3-Time Ritual Reminders & Video Station
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fdfbf7] tracking-tight">
              State-Lock Rituals & Video Fuel
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Prime your mental biology 3 times a day. Watch high-impact metabolic science, speaking, and warrior discipline videos directly inside LifeOS to maintain relentless growth.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleEnableNotifications}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition flex items-center gap-2 ${
                notificationStatus === 'granted'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 hover:border-amber-500 text-slate-200'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>{notificationStatus === 'granted' ? 'Reminders Active' : 'Enable 3x Notifications'}</span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'rituals' ? 'library' : 'rituals')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Youtube className="w-4 h-4 stroke-[2.5]" />
              {activeTab === 'rituals' ? 'Video Library' : 'View Daily Rituals'}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'rituals' ? (
        /* The 3 Daily Rituals */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {reminders.map((slot) => {
              const Icon = SLOT_ICONS[slot.id] || Sun;
              const video = slot.featuredVideo;

              return (
                <div 
                  key={slot.id}
                  className="rounded-3xl bg-[#090f1e] border border-slate-800 hover:border-amber-500/40 p-6 flex flex-col justify-between space-y-5 shadow-xl transition relative group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Icon className="w-4 h-4" />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-[#fdfbf7]">{slot.slotName}</h3>
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{slot.time}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                        {slot.theme.split('&')[0]}
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="text-xs text-amber-200/80 italic font-medium leading-relaxed bg-amber-500/5 p-3 rounded-2xl border border-amber-500/10">
                      "{slot.quote}"
                    </p>

                    {/* Embedded Featured Video Card */}
                    {video && (
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                            <Youtube className="w-3.5 h-3.5" /> Featured In-App Video
                          </span>
                          <span className="text-[10px] text-slate-500">{video.duration}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug">
                          {video.title}
                        </h4>

                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {video.whyWatch}
                        </p>

                        <button
                          onClick={() => onPlayVideo(video)}
                          className="w-full py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold transition flex items-center justify-center gap-2"
                        >
                          <Play className="w-3.5 h-3.5 fill-red-400" />
                          <span>Play Video In-App</span>
                        </button>
                      </div>
                    )}

                    {/* 4-Item Ritual Checklist */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        State-Lock Checklist
                      </span>

                      <div className="space-y-1.5">
                        {slot.checklist.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleToggleChecklist(slot.id, idx)}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2 transition"
                          >
                            <span className={`text-xs ${item.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                              {item.text}
                            </span>
                            {item.done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Curated Video Library */
        <div className="space-y-8">
          {/* Add Custom Video Card */}
          <div className="p-6 rounded-3xl bg-[#090f1e] border border-amber-500/20 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-[#fdfbf7] flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              Add Any YouTube Video to Your Personal LifeOS Library
            </h3>

            <form onSubmit={handleAddCustomVideo} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Video Title (e.g. Visceral Fat Science by Dr. Roy)"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200"
              />

              <input
                type="text"
                required
                placeholder="YouTube Link (e.g. https://youtu.be/...)"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200"
              />

              <div className="flex gap-2">
                <select
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 flex-1"
                >
                  <option value="Obesity & Metabolic Science">Obesity & Metabolic Science</option>
                  <option value="Speaking & Influence">Speaking & Influence</option>
                  <option value="Discipline & Warrior Mindset">Discipline & Warrior Mindset</option>
                  <option value="Focus & Soundscapes">Focus & Soundscapes</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex-shrink-0"
                >
                  Save
                </button>
              </div>
            </form>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCuratedVideos.map((vid) => (
              <div 
                key={vid.id}
                className="p-5 rounded-3xl bg-[#090f1e] border border-slate-800 hover:border-red-500/30 flex flex-col justify-between space-y-4 shadow-xl transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/10 text-red-400 border border-red-500/20">
                      {vid.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{vid.duration}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 leading-snug">
                    {vid.title}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {vid.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500 truncate">{vid.channel}</span>
                  <button
                    onClick={() => onPlayVideo(vid)}
                    className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-red-400" />
                    <span>Play In-App</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
