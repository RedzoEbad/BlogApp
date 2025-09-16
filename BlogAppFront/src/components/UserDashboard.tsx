// UserDashboard.tsx  (new UI + old logic)
import React, { useEffect, useState } from "react";
import {
  Heart, Calendar, User, X, Eye, Sparkles, Trash2, Edit3, BookOpen, Star, Zap
} from "lucide-react";
import CreateBlog from "./CreateBlog";
import EditBlog from "./EditBlog";

/* ---------- TYPES ---------- */
interface Blog {
  _id: string;
  title: string;
  description: string;
  image?: string;
  email?: string;
  createdAt: string;
}
interface BlogStats {
  [key: string]: {
    likes: number;
    views: number;
    comments: number;
    isLiked: boolean;
  };
}
interface NavbarProps { onCreateClick: () => void; }

/* ---------- NAVBAR ---------- */
const Navbar: React.FC<NavbarProps> = ({ onCreateClick }) => (
  <nav className="bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-2xl shadow-2xl border-b border-purple-500/30 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur animate-pulse" />
            <div className="relative w-12 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white animate-spin" />
            </div>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            ✨ BlogCosmos
          </h1>
        </div>
        <button
          onClick={onCreateClick}
          className="group relative px-8 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 
                   hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 text-white text-lg font-bold rounded-2xl 
                   transition-all duration-500 shadow-2xl hover:shadow-fuchsia-500/50 hover:scale-105 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Create Magic</span>
          </span>
        </button>
      </div>
    </div>
  </nav>
);

/* ---------- MAIN DASHBOARD ---------- */
const UserDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [blogStats, setBlogStats] = useState<BlogStats>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<Blog | null>(null);
  const [mounted, setMounted] = useState(false);

  /* -------------------------  FETCH  ------------------------- */
  useEffect(() => {
    setMounted(true);
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/v1/blog", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setBlogs(data.blogs || []);
        const initialStats: BlogStats = {};
        (data.blogs || []).forEach((blog: Blog) => {
          initialStats[blog._id] = {
            likes: Math.floor(Math.random() * 100) + 10,
            views: Math.floor(Math.random() * 500) + 50,
            comments: Math.floor(Math.random() * 30) + 5,
            isLiked: false,
          };
        });
        setBlogStats(initialStats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [blogs]);

  /* -------------------------  HELPERS  ------------------------- */
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const stripHtml = (html: string) => {
    const safeHtml = html ?? "";
    return safeHtml.replace(/<[^>]+>/g, "").slice(0, 120) + "...";
  };

  const showNotification = (message: string, type: "success" | "error") => {
    const el = document.createElement("div");
    el.className = `fixed top-6 right-6 px-6 py-4 rounded-2xl text-white font-semibold flex items-center space-x-3 z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    el.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  };

  const handleEdit = (blog: Blog, e: React.MouseEvent) => {
    e.stopPropagation();
    setBlogToEdit(blog);
    setShowEditModal(true);
  };

  const handleEditSuccess = (updatedBlog: Blog) => {
    setBlogs((prev) =>
      prev.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
    );
    showNotification("✅ Blog updated successfully!", "success");
  };

  const handleDelete = async (blogId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this masterpiece?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/v1/blog/${blogId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete blog");
      }
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      setBlogStats((prev) => {
        const next = { ...prev };
        delete next[blogId];
        return next;
      });
      showNotification("🗑️ Blog deleted!", "success");
    } catch (err: any) {
      showNotification(`❌ ${err.message}`, "error");
    }
  };

  /* -------------------------  LOADING  ------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
        <Navbar onCreateClick={() => setShowCreateModal(true)} />
        <div className="flex-1 flex items-center justify-center relative">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            >
              <Star className="w-2 h-2 text-white/30" />
            </div>
          ))}
          <div className="relative">
            <div className="w-40 h-40 relative">
              <div className="absolute inset-0 border-8 border-violet-200/20 border-t-violet-500 rounded-full animate-spin" />
              <div className="absolute inset-4 border-6 border-fuchsia-200/20 border-t-fuchsia-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              <div className="absolute inset-8 rounded-full bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>
            <div className="text-center mt-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
                ✨ Loading Your Universe ✨
              </h2>
              <p className="text-xl text-slate-300">Preparing something extraordinary...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------  RENDER  ------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <Navbar onCreateClick={() => setShowCreateModal(true)} />
      {/* cosmic particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`absolute transition-all duration-1000 ${mounted ? 'opacity-60' : 'opacity-0'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {i % 4 === 0 ? <Star className="w-2 h-2 text-violet-300/40 animate-pulse" /> :
             i % 4 === 1 ? <Sparkles className="w-1 h-1 text-fuchsia-300/40 animate-bounce" /> :
             i % 4 === 2 ? <div className="w-1 h-1 bg-cyan-400/40 rounded-full animate-ping" /> :
             <Zap className="w-2 h-2 text-yellow-300/40 animate-pulse" />}
          </div>
        ))}
      </div>

      {/* HERO */}
      <div className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[600px] h-[600px] border border-violet-500/30 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
          <div className="absolute w-[500px] h-[500px] border border-fuchsia-500/20 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
          <div className="absolute w-[400px] h-[400px] border border-cyan-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute top-20 right-20 w-60 h-60 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="relative max-w-7xl mx-auto px-6 text-center z-20">
          <h1 className={`text-7xl md:text-9xl font-black text-white mb-8 leading-tight transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <span className="block mb-4">Your</span>
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Digital Universe</span>
          </h1>
          <p className={`text-2xl md:text-4xl text-slate-200 max-w-5xl mx-auto font-light transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            ✨ Where Stories Become Legends & Dreams Take Flight ✨
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="relative px-8 max-w-7xl mx-auto -mt-20 z-30">
        {error && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-400/50 rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-center text-red-300 font-semibold text-lg"><X className="w-6 h-6 mr-3" />{error}</div>
          </div>
        )}
        {blogs.length === 0 ? (
          <div className="text-center py-32">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-2xl opacity-50" />
              <div className="relative w-40 h-40 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center"><BookOpen className="w-20 h-20 text-white" /></div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-4">No Stories Yet</h3>
            <p className="text-slate-400 text-xl">Begin your journey into digital storytelling!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog, index) => (
              <div
                key={blog._id}
                className={`group relative transition-all duration-1000 cursor-pointer transform hover:scale-105 hover:-translate-y-4 hover:rotate-1 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ animationDelay: `${index * 200}ms` }}
                onClick={() => setSelectedBlog(blog)}
                onMouseEnter={() => setHoveredCard(blog._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700" />
                <div className="relative bg-gradient-to-br from-slate-800/90 via-purple-800/50 to-slate-800/90 rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
                  <div className="relative h-64 overflow-hidden">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-600 flex items-center justify-center"><Sparkles className="w-16 h-16 text-white opacity-80 animate-spin" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className={`absolute top-4 right-4 flex space-x-2 transition-all duration-500 ${hoveredCard === blog._id ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-90"}`}>
                      <button onClick={(e) => handleEdit(blog, e)} className="group/btn relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 shadow-2xl hover:scale-110 overflow-hidden"><div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" /><Edit3 className="relative w-5 h-5" /></button>
                      <button onClick={(e) => handleDelete(blog._id, e)} className="group/btn relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-2xl hover:scale-110 overflow-hidden"><div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" /><Trash2 className="relative w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="relative p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-white line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text transition-all duration-500">{blog.title}</h2>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur animate-pulse" />
                        <div className="relative w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-violet-300">{blog.email || "Anonymous"}</p>
                        <p className="text-xs text-slate-400 flex items-center"><Calendar className="w-3 h-3 mr-1" />{formatDate(blog.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{stripHtml(blog.description)}</p>
                    {blogStats[blog._id] && (
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                          <span className="flex items-center"><Heart className="w-3 h-3 mr-1" />{blogStats[blog._id].likes}</span>
                          <span className="flex items-center"><Eye className="w-3 h-3 mr-1" />{blogStats[blog._id].views}</span>
                        </div>
                        <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SINGLE-BLOG MODAL */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-2xl" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="absolute animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}>
                <Star className="w-2 h-2 text-white/20" />
              </div>
            ))}
          </div>
          <div className="relative w-full max-w-6xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 rounded-3xl blur-2xl opacity-60" />
            <div className="relative bg-gradient-to-br from-slate-800/95 via-purple-800/50 to-slate-800/95 rounded-3xl overflow-hidden backdrop-blur-2xl border border-white/20">
              <div className="relative h-96 overflow-hidden">
                {selectedBlog.image ? (
                  <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-600 flex items-center justify-center"><Sparkles className="w-32 h-32 text-white opacity-60 animate-spin" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <button onClick={() => setSelectedBlog(null)} className="absolute top-6 right-6 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"><X className="w-8 h-8" /></button>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"><User className="w-8 h-8" /></div>
                    <div>
                      <p className="text-lg opacity-90">Created by</p>
                      <p className="text-2xl font-semibold">{selectedBlog.email || "Anonymous"}</p>
                    </div>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black leading-tight bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">{selectedBlog.title}</h1>
                </div>
              </div>
              <div className="p-12 overflow-y-auto max-h-96">
                <div className="prose prose-lg prose-invert max-w-none text-slate-200 leading-relaxed"><div dangerouslySetInnerHTML={{ __html: selectedBlog.description }} /></div>
              </div>
              <div className="px-12 py-8 bg-gradient-to-r from-slate-800/80 to-purple-800/80 border-t border-white/10 backdrop-blur-sm">
                <button onClick={() => setSelectedBlog(null)} className="px-10 py-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-2xl transition-all duration-300 font-semibold hover:scale-105">← Back to Universe</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT MODALS */}
      <CreateBlog
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newBlog) => {
          setBlogs((prev) => [newBlog, ...prev]);
          showNotification("✅ New blog published!", "success");
        }}
      />
      {blogToEdit && (
        <EditBlog
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setBlogToEdit(null); }}
          blog={blogToEdit}
          onSuccess={handleEditSuccess}
        />
      )}

      <style>{`
        .line-clamp-2{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}
        .line-clamp-3{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}
        .prose-invert{color:#e2e8f0}
        .prose-invert h1,.prose-invert h2,.prose-invert h3,.prose-invert strong{color:#f8fafc}
        .prose-invert code{color:#c4b5fd}
      `}</style>
    </div>
  );
};

export default UserDashboard;