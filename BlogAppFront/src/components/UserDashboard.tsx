// UserDashboard.tsx  (FULL FILE – delete/edit buttons restored)
import React, { useEffect, useState } from "react";
import { Heart, Calendar, User, X, Eye, Sparkles, Trash2, Edit3, BookOpen } from "lucide-react";
import CreateBlog from "./CreateBlog";

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

interface NavbarProps {
  onCreateClick: () => void;
}
const Navbar: React.FC<NavbarProps> = ({ onCreateClick }) => (
  <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-purple-100 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            BlogSphere
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-300">
            Dashboard
          </button>
          <button
            onClick={onCreateClick}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const UserDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [blogStats, setBlogStats] = useState<BlogStats>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* -------------------------  FETCH  ------------------------- */
  useEffect(() => {
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
  }, []);

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
    el.className = `fixed top-6 right-6 px-6 py-4 rounded-2xl text-white font-semibold flex items-center space-x-3 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    el.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  };

  const handleDelete = async (blogId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this blog?")) return;
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
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col">
        <Navbar onCreateClick={() => setShowCreateModal(true)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div className="w-32 h-32 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
            <Sparkles className="w-12 h-12 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
          </div>
          <div className="ml-6 text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">Loading Your Universe</h2>
            <p className="text-purple-500">Preparing something magical...</p>
          </div>
        </div>
      </div>
    );

  /* -------------------------  RENDER  ------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar onCreateClick={() => setShowCreateModal(true)} />

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 py-32">
        <div className="absolute inset-0 bg-black/15"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl animate-ping"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-tight animate-fade-in">
            <span className="block">Your</span>
            <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Creative Universe
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto animate-fade-in-delay font-light">
            ✨ Where Stories Come Alive & Dreams Take Flight ✨
          </p>
          
        </div>
      </div>

      {/* GRID */}
      <div className="p-8 max-w-7xl mx-auto -mt-16 relative z-10">
        {error && (
          <div className="bg-red-50 border-l-6 border-red-500 p-6 mb-8 rounded-r-2xl shadow-lg animate-slide-in">
            <X className="w-6 h-6 text-red-500 mr-3" />
            <p className="text-red-700 font-medium text-lg">{error}</p>
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">No Stories Yet</h3>
            <p className="text-gray-500 text-lg">Start creating your first masterpiece!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {blogs.map((blog, index) => (
              <div
                key={blog._id}
                className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-700 ease-out cursor-pointer transform hover:-translate-y-3 hover:rotate-1 hover-glow card-entrance floating-particles"
                style={{
                  animationDelay: `${index * 150}ms`,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                }}
                onClick={() => setSelectedBlog(blog)}
                onMouseEnter={() => setHoveredCard(blog._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden rounded-t-3xl h-64">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center">
                      <Sparkles className="w-20 h-20 text-white opacity-80 animate-spin-slow" />
                    </div>
                  )}

                  {/* FLOATING ACTION BUTTONS */}
                  <div
                    className={`absolute top-4 right-4 flex space-x-2 transition-all duration-500 ${
                      hoveredCard === blog._id
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Edit functionality coming soon!");
                      }}
                      className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-lg hover:scale-110"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(blog._id, e)}
                      className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                    {blog.title}
                  </h2>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-purple-600">{blog.email || "Anonymous"}</p>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">
                    {stripHtml(blog.description)}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SINGLE-BLOG MODAL */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl max-w-5xl w-full mx-auto overflow-hidden animate-modal-appear">
            <div className="relative h-96 overflow-hidden">
              {selectedBlog.image ? (
                <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center">
                  <Sparkles className="w-32 h-32 text-white opacity-60" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30"
              >
                <X className="w-7 h-7" />
              </button>
              <div className="absolute bottom-8 left-8 text-white max-w-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Written by</p>
                    <p className="text-lg font-semibold">{selectedBlog.email || "Anonymous"}</p>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">{selectedBlog.title}</h1>
              </div>
            </div>
            <div className="p-10 overflow-y-auto max-h-96">
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
              />
            </div>
            <div className="px-10 py-8 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-t border-purple-100">
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE-BLOG MODAL */}
      <CreateBlog
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newBlog) => {
          setBlogs((prev) => [newBlog, ...prev]);
          showNotification("✅ New blog published!", "success");
        }}
      />

      {/* KEEP YOUR ORIGINAL <style> BLOCK HERE */}
    </div>
  );
};

export default UserDashboard;