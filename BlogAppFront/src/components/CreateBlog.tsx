import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image, FileText, Type, AlertCircle, CheckCircle, Loader, Send } from "lucide-react";

// Type definitions for Quill
declare global {
  interface Window {
    Quill: any;
  }
}

interface CreateBlogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (blog: any) => void; // Callback for successful creation
}

interface FormData {
  title: string;
  description: string;
  image: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
  general?: string;
}

const CreateBlog: React.FC<CreateBlogProps> = ({ 
  isOpen = false, 
  onClose = () => {}, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    image: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const quillRef = useRef<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorFocused, setEditorFocused] = useState(false);
  const [quillLoaded, setQuillLoaded] = useState(false);
  const [quillError, setQuillError] = useState(false);

  // API Configuration - You can modify these as needed
  const API_BASE_URL = 'http://localhost:3000';
  const API_ENDPOINT = `${API_BASE_URL}/api/v1/blog`;

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
      quillScript.onerror = () => {
        setQuillError(true);
        console.error('Failed to load Quill.js');
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
      try {
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
          // Clear description error when user starts typing
          if (errors.description) {
            setErrors(prev => ({ ...prev, description: undefined }));
          }
        });

        // Handle focus events
        quillRef.current.on('selection-change', (range: any) => {
          setEditorFocused(!!range);
        });
      } catch (error) {
        console.error('Error initializing Quill editor:', error);
        setQuillError(true);
      }
    }

    // Cleanup when modal closes
    return () => {
      if (!isOpen && quillRef.current) {
        try {
          quillRef.current.off('text-change');
          quillRef.current.off('selection-change');
        } catch (error) {
          console.error('Error cleaning up Quill editor:', error);
        } finally {
          quillRef.current = null;
        }
      }
    };
  }, [isOpen, quillLoaded, errors.description]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ title: "", description: "", image: "" });
      setErrors({});
      setSubmitStatus('idle');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    const editorContent = quillRef.current?.root.innerText?.trim() || '';
    if (!editorContent) {
      newErrors.description = 'Blog content is required';
    } else if (editorContent.length < 50) {
      newErrors.description = 'Blog content must be at least 50 characters long';
    }

    if (!formData.image) {
      newErrors.image = 'Featured image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus('idle');

    try {
      // Prepare blog data
      const blogData = {
        title: formData.title.trim(),
        description: quillRef.current?.root.innerHTML || formData.description,
        image: formData.image,
        // Add additional fields if needed
        createdAt: new Date().toISOString(),
        status: 'published'
      };

      console.log("Sending blog data to API:", {
        ...blogData,
        image: formData.image ? `[Base64 image data - ${Math.round(formData.image.length / 1024)}KB]` : 'No image'
      });
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`   // 🔑 send token
  },
        body: JSON.stringify(blogData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle different types of API errors
        if (response.status === 400) {
          // Validation errors from backend
          if (responseData.errors) {
            setErrors(responseData.errors);
          } else {
            setErrors({ general: responseData.message || 'Validation failed' });
          }
        } else if (response.status === 401) {
          setErrors({ general: 'Authentication required. Please login.' });
        } else if (response.status === 403) {
          setErrors({ general: 'You do not have permission to create blogs.' });
        } else if (response.status === 429) {
          setErrors({ general: 'Too many requests. Please wait and try again.' });
        } else {
          setErrors({ general: responseData.message || `Server error: ${response.status}` });
        }
        setSubmitStatus('error');
        return;
      }

      console.log('Blog created successfully:', responseData);
      
      setSubmitStatus('success');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(responseData);
      }
      
      // Close modal after a brief delay to show success message
      setTimeout(() => {
        onClose();
        // Reset form after closing
        setTimeout(() => {
          setFormData({ title: "", description: "", image: "" });
          setSubmitStatus('idle');
          if (quillRef.current) {
            quillRef.current.setText('');
          }
        }, 300);
      }, 2000);

    } catch (error) {
      console.error('Network error submitting blog:', error);
      setSubmitStatus('error');
      
      // Handle different types of network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrors({ 
          general: 'Unable to connect to server. Please check your internet connection and try again.' 
        });
      } else {
        setErrors({ 
          general: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.' 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, image: 'File size must be less than 10MB' }));
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Please upload a valid image file (JPG, PNG, GIF, WebP)' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setFormData(prev => ({ ...prev, image: result }));
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    };
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, image: 'Error reading file. Please try again.' }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
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
          
          {/* Modal */}
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
                disabled={isSubmitting}
                className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mx-6 mt-4 p-4 bg-green-500/20 border border-green-400/30 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300">Blog created successfully! Publishing to your site...</span>
                </motion.div>
              )}
              
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mx-6 mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">{errors.general}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
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
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter your blog title..."
                  maxLength={200}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all ${
                    errors.title 
                      ? 'border-red-400/50 focus:border-red-400' 
                      : 'border-cyan-400/30 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20'
                  }`}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between text-sm">
                  {errors.title ? (
                    <p className="text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  ) : (
                    <span></span>
                  )}
                  <span className="text-gray-400">{formData.title.length}/200</span>
                </div>
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
                
                {quillError ? (
                  <div className="w-full px-4 py-12 bg-red-500/10 border border-red-400/30 rounded-xl text-red-400 flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      <p>Failed to load rich text editor. Please refresh the page.</p>
                    </div>
                  </div>
                ) : !quillLoaded ? (
                  <div className="w-full px-4 py-12 bg-slate-800/50 border border-teal-400/30 rounded-xl text-white placeholder-gray-400 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin text-teal-400" />
                      <span className="text-gray-400">Loading rich text editor...</span>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    whileFocus={{ scale: 1.02 }}
                    className={`relative transition-all ${editorFocused ? 'editor-focused' : ''} ${
                      errors.description ? 'editor-error' : ''
                    }`}
                  >
                    <div 
                      ref={editorRef}
                      className="bg-slate-800/50 rounded-xl overflow-hidden"
                    />
                  </motion.div>
                )}
                
                {errors.description && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
                
                <p className="text-xs text-gray-400 mt-2">
                  Use the toolbar above to format your text, add links, and more! Minimum 50 characters required.
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
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition-all group ${
                      errors.image 
                        ? 'border-red-400/30 hover:border-red-400/50' 
                        : 'border-blue-400/30 hover:border-blue-400/50'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Image className={`w-10 h-10 mb-3 transition-colors ${
                        errors.image 
                          ? 'text-red-400 group-hover:text-red-300' 
                          : 'text-blue-400 group-hover:text-blue-300'
                      }`} />
                      <p className={`mb-2 text-sm transition-colors ${
                        errors.image 
                          ? 'text-red-300 group-hover:text-red-200' 
                          : 'text-blue-300 group-hover:text-blue-200'
                      }`}>
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </motion.label>

                  {errors.image && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.image}
                    </p>
                  )}

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
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 bg-gray-600/50 text-gray-300 font-semibold rounded-xl hover:bg-gray-600/70 transition-all border border-gray-500/30 disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  disabled={isSubmitting || submitStatus === 'success'}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-400/40 transition-all relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 opacity-0 hover:opacity-100 transition-all" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {isSubmitting ? 'Publishing...' : 'Publish Blog'}
                  </span>
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