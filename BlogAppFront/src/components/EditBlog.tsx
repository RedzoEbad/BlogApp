// EditBlog.tsx  (same brains, new celestial skin)
import React, { useEffect, useState } from "react";
import { Camera, Loader2, Save, X, Sparkles, Edit3, Zap, Heart, Star } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  description: string;
  image?: string;
  email?: string;
  createdAt: string;
}

interface EditBlogProps {
  blog: Blog;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedBlog: Blog) => void;
}

const EditBlog: React.FC<EditBlogProps> = ({ blog, isOpen, onClose, onSuccess }) => {
  /* -------------  state  ------------- */
  const [title, setTitle] = useState(blog.title);
  const [description, setDescription] = useState(blog.description);
  const [image, setImage] = useState(blog.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [sparkleAnimation, setSparkleAnimation] = useState(false);

  /* -------------  effects  ------------- */
  useEffect(() => {                           // reset on new blog
    setTitle(blog.title);
    setDescription(blog.description);
    setImage(blog.image || "");
    setError("");
  }, [blog]);

  useEffect(() => {                           // mount / unmount animations
    if (isOpen) {
      setTimeout(() => setMounted(true), 50);
      setTimeout(() => setSparkleAnimation(true), 500);
    } else {
      setMounted(false);
      setSparkleAnimation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /* -------------  handlers  ------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and Content are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 2500)); // simulate API
      onSuccess({ ...blog, title, description, image });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------  render  ------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 transition-all duration-1000 ease-out ${
          mounted
            ? "bg-gradient-to-br from-violet-950/90 via-fuchsia-950/90 to-black/90 backdrop-blur-2xl"
            : "bg-transparent backdrop-blur-none"
        }`}
      />

      {/* floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute transition-all duration-1000 ${
              sparkleAnimation ? "opacity-100" : "opacity-0"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {i % 3 === 0 ? (
              <Star className="w-3 h-3 text-yellow-300/60 animate-pulse" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-2 h-2 text-pink-300/60 animate-bounce" />
            ) : (
              <div className="w-1 h-1 bg-white/40 rounded-full animate-ping" />
            )}
          </div>
        ))}
      </div>

      {/* modal container */}
      <div
        className={`relative w-full max-w-5xl transition-all duration-1000 ease-out transform ${
          mounted
            ? "translate-y-0 opacity-100 scale-100 rotate-0"
            : "translate-y-20 opacity-0 scale-90 rotate-1"
        }`}
      >
        {/* outer glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 rounded-3xl blur-2xl opacity-60 animate-pulse" />

        {/* card */}
        <form
          onSubmit={handleSubmit}
          className="relative bg-gradient-to-br from-[#0a031c] via-purple-900/30 to-[#0a031c] rounded-3xl overflow-hidden backdrop-blur-3xl border border-white/10"
        >
          {/* animated mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 animate-pulse" />

          {/* header */}
          <div className="relative flex items-center justify-between p-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur animate-pulse" />
                <div className="relative p-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  Edit Your Cosmos
                </h2>
                <p className="text-slate-300 text-sm flex items-center mt-1">
                  <Heart className="w-4 h-4 mr-2 text-pink-400" />
                  Refine your masterpiece
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="group p-2 hover:bg-white/10 rounded-2xl transition text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* error */}
          {error && (
            <div className="px-8 pb-4">
              <div className="bg-red-500/10 border border-red-400/50 rounded-2xl p-4 text-red-300 font-semibold text-center flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2 animate-bounce" />
                {error}
              </div>
            </div>
          )}

          {/* body */}
          <div className="grid lg:grid-cols-5 gap-8 px-8 pb-8">
            {/* left */}
            <div className="lg:col-span-2 space-y-6">
              {/* title */}
              <div className="group relative">
                <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-violet-400 animate-spin" />
                  Title *
                </label>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="relative w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 backdrop-blur-sm"
                    placeholder="Epic title here..."
                  />
                </div>
              </div>

              {/* image */}
              <div className="group relative">
                <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center">
                  <Camera className="w-4 h-4 mr-2 text-cyan-400" />
                  Cover Art
                </label>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="relative w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 backdrop-blur-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* preview */}
              {image && (
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={image}
                    alt="cover"
                    className="w-full h-40 object-cover"
                    onError={() => setError("Invalid image URL")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-xs bg-black/50 px-2 py-1 rounded-full text-white flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-300" />
                    <span>Preview</span>
                  </div>
                </div>
              )}
            </div>

            {/* right */}
            <div className="lg:col-span-3 flex flex-col">
              <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center">
                <Edit3 className="w-4 h-4 mr-2 text-emerald-400" />
                Content *
              </label>
              <div className="relative flex-1 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="relative w-full h-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur-sm resize-none"
                  placeholder="Let the universe hear your voice..."
                />
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-end space-x-4 px-8 py-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition backdrop-blur-sm border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 
                         hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 text-white 
                         rounded-2xl font-semibold transition-all duration-300 shadow-lg 
                         disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Weaving magic...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save changes</span>
                </>
              )}
            </button>
          </div>

          {/* decorative orbs */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        </form>
      </div>
    </div>
  );
};

export default EditBlog;