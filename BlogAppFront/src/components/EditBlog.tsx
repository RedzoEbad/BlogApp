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
  const [title, setTitle] = useState(blog.title);
  const [description, setDescription] = useState(blog.description);
  const [image, setImage] = useState(blog.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [sparkleAnimation, setSparkleAnimation] = useState(false);

  // Reset state if blog changes
  useEffect(() => {
    setTitle(blog.title);
    setDescription(blog.description);
    setImage(blog.image || "");
    setError("");
  }, [blog]);

  // Animation mounting effect
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setMounted(true), 50);
      setTimeout(() => setSparkleAnimation(true), 500);
    } else {
      setMounted(false);
      setSparkleAnimation(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and Content are required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Simulated API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const updatedBlog = {
        ...blog,
        title,
        description,
        image
      };
      
      onSuccess(updatedBlog);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Epic animated backdrop */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-out ${
          mounted 
            ? 'bg-gradient-to-br from-violet-900/95 via-fuchsia-900/90 to-cyan-900/95 backdrop-blur-2xl' 
            : 'bg-transparent backdrop-blur-none'
        }`}
        onClick={onClose}
      />
      
      {/* Floating cosmic particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute transition-all duration-1000 ${
              sparkleAnimation ? 'opacity-100' : 'opacity-0'
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

      {/* Rotating background rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 border border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 border border-pink-500/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
      </div>

      {/* Main modal container */}
      <div 
        className={`relative w-full max-w-5xl transition-all duration-1000 ease-out transform ${
          mounted 
            ? 'translate-y-0 opacity-100 scale-100 rotate-0' 
            : 'translate-y-20 opacity-0 scale-90 rotate-1'
        }`}
      >
        {/* Outer glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 via-pink-600 to-cyan-500 rounded-3xl blur-2xl opacity-60 animate-pulse" />
        
        {/* Inner glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-75" />
        
        <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-3xl overflow-hidden">
          {/* Animated mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 animate-pulse" />
          
          {/* Glass morphism layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-transparent rounded-3xl backdrop-blur-3xl" />
          
          <div className="relative p-10 space-y-8">
            {/* Epic header section */}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur animate-pulse" />
                  <div className="relative p-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl">
                    <Edit3 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                    ✨ Edit Your Masterpiece
                  </h2>
                  <p className="text-slate-300 text-lg mt-1 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-pink-400" />
                    Craft words that inspire the world
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="group p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 text-slate-400 hover:text-white relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <X className="relative w-6 h-6" />
              </button>
            </div>

            {/* Spectacular error display */}
            {error && (
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-pink-500/30 animate-pulse" />
                <div className="relative bg-red-500/10 border-2 border-red-400/50 rounded-2xl p-6 text-red-300 font-semibold text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2 animate-bounce" />
                  {error}
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-5 gap-10">
              {/* Left side - Inputs */}
              <div className="lg:col-span-2 space-y-8">
                {/* Title input with cosmic effects */}
                <div className="group relative">
                  <label className="block text-lg font-bold text-slate-200 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-3 text-violet-400 animate-spin" />
                    Title of Wonder *
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-500" />
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="relative w-full bg-white/5 border-2 border-white/10 rounded-2xl p-5 text-white text-lg placeholder-slate-400 
                               focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:border-violet-400/50 
                               transition-all duration-500 group-hover:border-white/20 backdrop-blur-sm"
                      placeholder="Your epic story begins here..."
                    />
                    <div className="absolute top-5 right-5">
                      <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Image input with magical styling */}
                <div className="group relative">
                  <label className="block text-lg font-bold text-slate-200 mb-4 flex items-center">
                    <Camera className="w-5 h-5 mr-3 text-cyan-400 animate-bounce" />
                    Cover Art (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-500" />
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="relative w-full bg-white/5 border-2 border-white/10 rounded-2xl p-5 text-white text-lg placeholder-slate-400 
                               focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400/50 
                               transition-all duration-500 group-hover:border-white/20 backdrop-blur-sm"
                      placeholder="https://your-amazing-image.jpg"
                    />
                  </div>
                </div>

                {/* Epic image preview */}
                {image && (
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl opacity-75 blur animate-pulse" />
                    <div className="relative overflow-hidden rounded-3xl bg-gray-800">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                        onError={() => setError("Invalid image URL")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-white font-medium">Cover Preview</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right side - Content */}
              <div className="lg:col-span-3 space-y-8">
                <div className="group relative h-full flex flex-col">
                  <label className="block text-lg font-bold text-slate-200 mb-4 flex items-center">
                    <Edit3 className="w-5 h-5 mr-3 text-emerald-400 animate-pulse" />
                    Your Story *
                  </label>
                  <div className="relative flex-1">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-500" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={16}
                      className="relative w-full h-full bg-white/5 border-2 border-white/10 rounded-2xl p-6 text-white text-lg placeholder-slate-400 
                               focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400/50 
                               transition-all duration-500 group-hover:border-white/20 resize-none backdrop-blur-sm"
                      placeholder="Pour your heart and soul into every word. Let your creativity flow like stardust across the universe..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Magnificent action buttons */}
            <div className="flex justify-end space-x-6 pt-8 border-t-2 border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="group relative px-10 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-2xl 
                         transition-all duration-300 backdrop-blur-sm border-2 border-white/10 hover:border-white/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">Cancel</span>
              </button>
              
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className={`group relative px-12 py-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 
                          hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 text-white text-lg font-bold rounded-2xl 
                          transition-all duration-500 shadow-2xl overflow-hidden
                          ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-fuchsia-500/50 hover:scale-105 hover:-translate-y-1'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {loading ? (
                  <div className="relative flex items-center space-x-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>✨ Weaving Magic...</span>
                  </div>
                ) : (
                  <div className="relative flex items-center space-x-3">
                    <Save className="w-6 h-6" />
                    <span>🚀 Launch Story</span>
                  </div>
                )}
              </button>
            </div>

            {/* Decorative cosmic orbs */}
            <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;