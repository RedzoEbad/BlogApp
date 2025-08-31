// loginController.ts
import { Request, Response } from 'express';
import UserModel from '../model/TodoModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import BlogModel from '../model/BlogModel';

// ---------------- Login Controller ----------------
const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

    // Generate JWT token with role
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ message: 'Login successful', user: userResponse, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- Register Controller ----------------
const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: 'user', // default role
    });

    await newUser.save();

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- Admin Data ----------------
const adminDataController = async (req: Request, res: Response) => {
  try {
    // Get all blogs for admin
    const blogs = await BlogModel.find().sort({ createdAt: -1 });
    res.json({
      message: "Welcome Admin! You have access to admin features.",
      role: 'admin',
      user: (req as any).user,
      blogs: blogs,
    });
  } catch (error) {
    console.error('Admin data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- User Data ----------------
const userDataController = async (req: Request, res: Response) => {
  try {
    console.log("User data accessed by:", (req as any).user);
    
    // Get blogs for the specific user
    const userEmail = (req as any).user?.email;
    const blogs = await BlogModel.find({ email: userEmail }).sort({ createdAt: -1 });
    
    res.json({
      message: "Welcome User! You have access to user features.",
      role: "user",
      user: (req as any).user,
      blogs: blogs,
    });
  } catch (error) {
    console.error('User data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- Blog Creation ----------------
const BlogController = async (req: Request, res: Response) => {
  try {
    const { title, description, image } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const userId = (req as any).user?.userId || null;
    const email = (req as any).user?.email || null;

    if (!email) {
      return res.status(401).json({ message: "User email not found" });
    }

    const newBlog = new BlogModel({
      title,
      description,
      image,
      email,
      createdBy: userId,
    });

    await newBlog.save();

    return res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Blog Deletion ----------------
const deleteDataController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userEmail = (req as any).user?.email;
    const userRole = (req as any).user?.role;

    console.log('Delete request received:', { 
      blogId: id, 
      userEmail, 
      userRole,
      timestamp: new Date().toISOString()
    });

    // Validate required data
    if (!userEmail) {
      return res.status(401).json({ message: "User authentication required" });
    }

    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    // Find the blog
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    console.log('Blog found:', {
      blogId: blog._id,
      blogEmail: (blog as any).email,
      blogTitle: (blog as any).title
    });

    // Check ownership (user can delete own blogs, admin can delete any)
    // const isOwner = (blog as any).email === userEmail;
    // const isAdmin = userRole === 'admin';
    // const canDelete = isOwner || isAdmin;
    
    // if (!canDelete) {
    //   return res.status(403).json({ 
    //     message: "You can only delete your own blogs",
    //     debug: {
    //       userEmail,
    //       blogEmail: (blog as any).email,
    //       userRole,
    //       isOwner,
    //       isAdmin
    //     }
    //   });
    // }

    // Delete the blog
    const deletedBlog = await BlogModel.findByIdAndDelete(id);
    
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found or already deleted" });
    }

    console.log('Blog deleted successfully:', {
      deletedBlogId: id,
      deletedBy: userEmail
    });
    
    res.status(200).json({ 
      message: "Blog deleted successfully",
      deletedBlog: {
        id: deletedBlog._id,
        title: (deletedBlog as any).title
      }
    });
  } catch (err: any) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ---------------- Get All Blogs (Public) ----------------
const getAllBlogsController = async (req: Request, res: Response) => {
  try {
    const blogs = await BlogModel.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      message: "Blogs fetched successfully", 
      blogs: blogs,
      count: blogs.length 
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Get Single Blog ----------------
const getSingleBlogController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ 
      message: "Blog fetched successfully", 
      blog: blog 
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Update Blog ----------------
const updateBlogController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const userEmail = (req as any).user?.email;
    const userRole = (req as any).user?.role;

    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    // Find the blog
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
   
    // Check ownership (user can update own blogs, admin can update any)
    const isOwner = (blog as any).email === userEmail;
    const isAdmin = userRole === 'admin';
    const canUpdate = isOwner || isAdmin;
    
    if (!canUpdate) {
      return res.status(403).json({ 
        message: "You can only update your own blogs"
      });
    }

    // Update the blog
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      { 
        ...(title && { title }),
        ...(description && { description }),
        ...(image !== undefined && { image }),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      message: "Blog updated successfully",
      blog: updatedBlog
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  loginController,
  registerController,
  adminDataController,
  userDataController,
  BlogController,
  deleteDataController,
  getAllBlogsController,
  getSingleBlogController,
  updateBlogController,
};