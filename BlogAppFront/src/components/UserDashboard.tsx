import React, { useEffect, useState } from "react";
import { Heart, Calendar, User, X, Eye, Clock, Sparkles, Share2, MessageCircle } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  description: string;
  image?: string;
  email?: string;
  createdAt: string;
}

import Navbar from "../Utilities/Navbar";

const UserDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]+>/g, "").slice(0, 120) + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Sparkles className="w-10 h-10 text-purple-600 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 py-24">
        <div className="absolute inset-0 bg-black/15"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight animate-fade-in">
            <span className="block">Your</span>
            <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              Creative Universe
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in-delay">
            Explore inspiring stories, ideas, and voices that spark imagination.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="p-6 max-w-7xl mx-auto -mt-12 relative z-10">
        {error && (
          <div className="bg-red-50 border-l-6 border-red-500 p-5 mb-8 rounded-r-xl shadow-md animate-slide-in">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-700 ease-out cursor-pointer transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedBlog(blog)}
              onMouseEnter={() => setHoveredCard(blog._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-t-3xl h-56">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white opacity-60 animate-spin-slow" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Content */}
              <div className="p-7">
                <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                  {blog.title}
                </h2>

                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-purple-500" />
                  <p className="text-sm font-medium text-purple-600">{blog.email || "Anonymous"}</p>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">
                  {stripHtml(blog.description)}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-purple-500">
                    <Clock className="w-4 h-4" />
                    <span>5 min read</span>
                  </div>
                </div>
              </div>

              {/* Hover Action Icons */}
              <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-lg">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg">
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-xl transform rotate-45 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Beautiful Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-3xl max-w-4xl w-full mx-auto overflow-hidden transform transition-all animate-modal-appear"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Image */}
            <div className="relative h-80 overflow-hidden">
              {selectedBlog.image ? (
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-white opacity-40 animate-spin-slow" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
              </button>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm opacity-90">By {selectedBlog.email || "Unknown"}</p>
                <h1 className="text-3xl font-bold">{selectedBlog.title}</h1>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto max-h-96">
              <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>Published on {formatDate(selectedBlog.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-pink-500" />
                  <span>5 min read</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>42 likes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span>18 comments</span>
                </div>
              </div>

              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
              />
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <Heart className="w-5 h-5" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 px-5 py-3 border border-purple-300 text-purple-600 rounded-full hover:bg-purple-50 transition-all duration-300 shadow">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1.2s ease-out 0.4s forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }

        .animate-modal-appear {
          animation: modal-appear 0.4s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .prose {
          font-size: 1rem;
          line-height: 1.8;
        }

        .prose p {
          margin-bottom: 1rem;
        }

        .prose h1, .prose h2, .prose h3 {
          font-weight: 600;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;