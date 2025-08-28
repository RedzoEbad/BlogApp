import React , {useState}from "react";
import { motion } from "framer-motion";
import { Search, PlusCircle, BookOpen } from "lucide-react";
import CreateBlog from "../components/CreateBlog" // Adjust the import path as necessary

const Navbar = () => {
  const [showCreateBlog, setShowCreateBlog] = useState(false);

  const createBlog = () => {
    console.log("Create Blog button clicked");
    setShowCreateBlog(true);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 12 }}
        className="w-full bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 px-8 py-4 flex items-center justify-between shadow-2xl border-b border-cyan-300/30 relative z-10"
      >
        {/* Left: Buttons */}
        <div className="flex gap-4">
          {/* Create Blog */}
          <motion.button
            onClick={createBlog}
            whileHover={{ scale: 1.08, rotate: 1 }}
            whileTap={{ scale: 0.92 }}
            className="flex items-center gap-2 bg-slate-900 text-cyan-300 font-bold px-5 py-2.5 rounded-2xl shadow-lg hover:shadow-cyan-400/40 transition-all border border-cyan-400/30 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 hover:opacity-100 transition-all" />
            <PlusCircle className="w-5 h-5 text-cyan-300" />
            Create Blog
          </motion.button>

         
        </div>

        {/* Right: Search */}
        <motion.div
          className="flex items-center bg-slate-900/80 px-3 py-2 rounded-2xl shadow-lg gap-2 border border-cyan-400/30 transition-all focus-within:shadow-cyan-400/40"
          whileHover={{ scale: 1.05 }}
        >
          <Search className="w-5 h-5 text-cyan-300" />
          <motion.input
            type="text"
            placeholder="Search blogs..."
            initial={{ width: "8rem" }}
            whileFocus={{ width: "14rem" }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="outline-none bg-transparent text-gray-200 placeholder-gray-400 w-40"
          />
        </motion.div>
      </motion.nav>

      {/* Create Blog Form */}
      <CreateBlog 
        isOpen={showCreateBlog} 
        onClose={() => setShowCreateBlog(false)} 
      />
    </>
  );
};

export default Navbar;