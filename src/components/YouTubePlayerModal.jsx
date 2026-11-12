import React, { useState } from 'react';
import { 
  X, 
  Play, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  CheckCircle2,
  Clock,
  Youtube
} from 'lucide-react';

export default function YouTubePlayerModal({ isOpen, onClose, video, onAddQuestFromVideo }) {
  const [activeNote, setActiveNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  if (!isOpen || !video) return null;

  // Extract clean YouTube video ID if given a full URL
  const getVideoId = (vid) => {
    if (!vid) return 'gXDMoiEkyu8';
    if (typeof vid === 'string' && vid.includes('youtube.com/watch?v=')) {
      return vid.split('v=')[1]?.split('&')[0];
    }
    if (typeof vid === 'string' && vid.includes('youtu.be/')) {
      return vid.split('youtu.be/')[1]?.split('?')[0];
    }
    return vid.videoId || vid.id || (typeof vid === 'string' ? vid : 'gXDMoiEkyu8');
  };

  const videoId = getVideoId(video);
  const videoTitle = video.title || 'Growth & Mindset Mastery Video';
  const videoDesc = video.desc || video.whyWatch || 'Deepen your knowledge and fuel your mission momentum.';

  const handleSaveTakeaway = (e) => {
    e.preventDefault();
    if (!activeNote.trim() || !onAddQuestFromVideo) return;
    onAddQuestFromVideo({
      title: `Actionable Insight: ${activeNote.trim()}`,
      category: 'Learning',
      durationMins: 20,
      xp: 75
    });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
    setActiveNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c1527] border border-amber-500/40 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5 truncate">
            <span className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Youtube className="w-4 h-4" />
            </span>
            <div className="truncate">
              <h3 className="text-sm font-bold text-[#fdfbf7] truncate">{videoTitle}</h3>
              <p className="text-[11px] text-slate-400 truncate">{video.channel ? `Channel: ${video.channel}` : 'LifeOS Curated Video'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition text-xs flex items-center gap-1"
              title="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player (16:9 Aspect Ratio) */}
        <div className="relative w-full bg-black aspect-video flex-shrink-0">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Notes & Quick Action Bar */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-[#090f1e]">
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {videoDesc}
          </p>

          <form onSubmit={handleSaveTakeaway} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800/80">
            <input
              type="text"
              placeholder="What is your #1 takeaway? (Converts directly to a Quest!)"
              value={activeNote}
              onChange={(e) => setActiveNote(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500/60 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              Convert to Quest (+75 XP)
            </button>
          </form>

          {noteSaved && (
            <p className="text-xs font-semibold text-emerald-400 animate-pulse flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Takeaway added to your Daily Quests!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
