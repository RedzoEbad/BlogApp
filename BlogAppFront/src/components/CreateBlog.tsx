import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image, FileText, Type } from "lucide-react";

// Type definitions for Quill
declare global {
  interface Window {
    Quill: any;
  }
}

interface CreateBlogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBlog: React.FC<CreateBlogProps> = ({ isOpen = false, onClose = () => {} }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: ""
  });
  
  const quillRef = useRef<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorFocused, setEditorFocused] = useState(false);
  const [quillLoaded, setQuillLoaded] = useState(false);

  // Load Quill.js dynamically
  useEffect(() => {
    if (!window.Quill) {
      // Load Quill CSS
      const quillCSS = document.createElement('link');
      quillCSS.rel = 'stylesheet';
      quillCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.css';
      document.head.appendChild(quillCSS);

      // Load Quill JS
      const quillScript = document.createElement('script');
      quillScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
      quillScript.onload = () => {
        setQuillLoaded(true);
      };
      document.head.appendChild(quillScript);
    } else {
      setQuillLoaded(true);
    }

    // Add custom styles for dark theme
    if (!document.getElementById('quill-dark-theme')) {
      const style = document.createElement('style');
      style.id = 'quill-dark-theme';
      style.textContent = `
        .ql-toolbar {
          border-top: 1px solid rgba(34, 211, 238, 0.3) !important;
          border-left: 1px solid rgba(34, 211, 238, 0.3) !important;
          border-right: 1px solid rgba(34, 211, 238, 0.3) !important;
          border-bottom: none !important;
          background: rgba(30, 41, 59, 0.5) !important;
          border-radius: 0.75rem 0.75rem 0 0 !important;
        }
        
        .ql-container {
          border-bottom: 1px solid rgba(34, 211, 238, 0.3) !important;
          border-left: 1px solid rgba(34, 211, 238, 0.3) !important;
          border-right: 1px solid rgba(34, 211, 238, 0.3) !important;
          border-top: none !important;
          background: rgba(30, 41, 59, 0.5) !important;
          border-radius: 0 0 0.75rem 0.75rem !important;
          color: white !important;
        }
        
        .ql-editor {
          color: white !important;
          min-height: 200px !important;
          padding: 1rem !important;
        }
        
        .ql-editor.ql-blank::before {
          color: rgb(156, 163, 175) !important;
          font-style: normal !important;
        }
        
        .ql-toolbar .ql-stroke {
          stroke: rgba(45, 212, 191, 0.8) !important;
        }
        
        .ql-toolbar .ql-fill {
          fill: rgba(45, 212, 191, 0.8) !important;
        }
        
        .ql-toolbar button:hover {
          background: rgba(45, 212, 191, 0.2) !important;
          border-radius: 4px !important;
        }
        
        .ql-toolbar button.ql-active {
          background: rgba(45, 212, 191, 0.3) !important;
          border-radius: 4px !important;
        }
        
        .ql-picker {
          color: rgba(45, 212, 191, 0.8) !important;
        }
        
        .ql-picker-options {
          background: rgba(30, 41, 59, 0.95) !important;
          border: 1px solid rgba(45, 212, 191, 0.3) !important;
          border-radius: 0.5rem !important;
        }
        
        .ql-picker-item {
          color: white !important;
        }
        
        .ql-picker-item:hover {
          background: rgba(45, 212, 191, 0.2) !important;
        }

        .editor-focused .ql-toolbar {
          border-color: rgba(45, 212, 191, 0.6) !important;
          box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.2) !important;
        }
        
        .editor-focused .ql-container {
          border-color: rgba(45, 212, 191, 0.6) !important;
          box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.2) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Initialize Quill editor when modal opens and Quill is loaded
  useEffect(() => {
    if (isOpen && quillLoaded && editorRef.current && !quillRef.current) {
      const Quill = window.Quill;
      
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your amazing blog content here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['blockquote', 'code-block'],
           
          ]
        }
      });

      // Handle content changes
      quillRef.current.on('text-change', () => {
        const content = quillRef.current.root.innerHTML;
        setFormData(prev => ({ ...prev, description: content }));
      });

      // Handle focus events
      quillRef.current.on('selection-change', (range: any) => {
        setEditorFocused(!!range);
      });
    }

    // Cleanup when modal closes
    if (!isOpen && quillRef.current) {
      quillRef.current = null;
    }
  }, [isOpen, quillLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = {
      ...formData,
      description: quillRef.current?.root.innerHTML || formData.description
    };
    console.log("Blog submitted:", blogData);
    // Handle form submission here
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setFormData(prev => ({ ...prev, image: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Form Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.3 }
            }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cyan-400/20">
              <motion.h2 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"
              >
                Create New Blog
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Title Field */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-cyan-300 font-medium">
                  <Type className="w-5 h-5" />
                  Blog Title *
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter your blog title..."
                  className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all"
                />
              </motion.div>

              {/* Rich Text Editor */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-teal-300 font-medium">
                  <FileText className="w-5 h-5" />
                  Blog Content *
                </label>
                
                {!quillLoaded ? (
                  <div className="w-full px-4 py-12 bg-slate-800/50 border border-teal-400/30 rounded-xl text-white placeholder-gray-400 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-400">Loading rich text editor...</span>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    whileFocus={{ scale: 1.02 }}
                    className={`relative transition-all ${editorFocused ? 'editor-focused' : ''}`}
                  >
                    <div 
                      ref={editorRef}
                      className="bg-slate-800/50 rounded-xl overflow-hidden"
                    />
                  </motion.div>
                )}
                
                <p className="text-xs text-gray-400 mt-2">
                  Use the toolbar above to format your text, add links, images, and more!
                </p>
              </motion.div>

              {/* Image Upload */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-blue-300 font-medium">
                  <Image className="w-5 h-5" />
                  Featured Image *
                </label>
                
                <div className="space-y-4">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-400/30 rounded-xl cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition-all group"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Image className="w-10 h-10 mb-3 text-blue-400 group-hover:text-blue-300 transition-colors" />
                      <p className="mb-2 text-sm text-blue-300 group-hover:text-blue-200 transition-colors">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </motion.label>

                  {/* Image Preview */}
                  {formData.image && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="relative rounded-xl overflow-hidden"
                    >
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <p className="absolute bottom-2 left-2 text-white text-sm font-medium">
                        Featured Image Preview
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Submit Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 pt-4"
              >
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 px-6 bg-gray-600/50 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/70 transition-all border border-gray-500/30"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-400/40 transition-all relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 opacity-0 hover:opacity-100 transition-all" />
                  <span className="relative">Publish Blog</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateBlog;