import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Edit3, 
  Tag, 
  X, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { addItem, updateItem, deleteItem } from '../firebase/firestoreService';
import { useAuth } from '../firebase/auth';

export default function NotesView({ notes = [] }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNote, setSelectedNote] = useState(null);

  // Edit / Add modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Philosophy');
  const [pinned, setPinned] = useState(false);

  const categories = ['Philosophy', 'Engineering', 'Productivity', 'Ideas', 'Personal'];

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('Philosophy');
    setPinned(false);
    setShowModal(true);
  };

  const handleOpenEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category || 'Philosophy');
    setPinned(note.pinned || false);
    setShowModal(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    if (editingId) {
      await updateItem(user.uid, 'notes', editingId, {
        title: title.trim(),
        content: content.trim(),
        category,
        pinned,
        updatedAt: new Date().toISOString()
      });
    } else {
      await addItem(user.uid, 'notes', {
        title: title.trim(),
        content: content.trim(),
        category,
        pinned,
        updatedAt: new Date().toISOString()
      });
    }

    setShowModal(false);
  };

  const handleTogglePin = async (note) => {
    if (!user) return;
    await updateItem(user.uid, 'notes', note.id, { pinned: !note.pinned });
  };

  const handleDelete = async (noteId) => {
    if (!user) return;
    if (confirm('Delete this note?')) {
      await deleteItem(user.uid, 'notes', noteId);
      if (selectedNote?.id === noteId) setSelectedNote(null);
    }
  };

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          (n.content || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Notes, Knowledge & Journal</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture thoughts, software design principles, reading takeaways, and daily reflections.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, insights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No notes found. Click "+ New Note" to capture your thoughts.
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5 ${
                note.pinned 
                  ? 'border-indigo-500/40 bg-gradient-to-br from-indigo-950/20 to-slate-900 shadow-lg shadow-indigo-950/30' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {note.category || 'General'}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleTogglePin(note); }}
                      className={`p-1 rounded transition ${note.pinned ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                      title={note.pinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenEdit(note); }}
                      className="p-1 text-slate-500 hover:text-slate-300 rounded transition opacity-0 group-hover:opacity-100"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mt-3 line-clamp-1">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-4 whitespace-pre-line leading-relaxed font-sans">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>{note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}</span>
                <span className="group-hover:text-indigo-400 font-semibold transition">Read Note →</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Note Reader Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 lg:p-8 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {selectedNote.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{selectedNote.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const n = selectedNote;
                    setSelectedNote(null);
                    handleOpenEdit(n);
                  }}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 pr-2">
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed space-y-2 font-mono bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
                {selectedNote.content}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Last updated: {selectedNote.updatedAt ? new Date(selectedNote.updatedAt).toLocaleString() : 'N/A'}</span>
              <button
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Note Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {editingId ? 'Edit Note' : 'Create Note'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center space-x-2 pt-5">
                  <input
                    type="checkbox"
                    id="pinnedNote"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="pinnedNote" className="text-xs text-slate-300 font-medium cursor-pointer">
                    Pin note to top
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Content (Markdown)</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write your thoughts, code, or documentation..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  {editingId ? 'Save Changes' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
