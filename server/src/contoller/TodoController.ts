// 1. Updated Backend Controller (loginController.ts)
import { Request, Response } from 'express';
import UserModel from '../model/TodoModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import BlogModel from '../model/BlogModel';

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token with role included
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key', 
      { expiresIn: '24h' }
    );
    
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token: token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Default role is 'user' - only admins can create other admins
    const newUser = new UserModel({ 
      name, 
      email, 
      password: hashedPassword,
      role: 'user' // Default role
    });
    
    await newUser.save();
    
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      user: userResponse
    });
    
  } catch (err) {
    console.error('Registration error:', err); 
    res.status(500).json({ message: 'Server error' }); 
  }
};

 const adminDataController = (req: Request, res: Response) => {
  res.json({
    message: "Welcome Admin! You have access to admin features.",
    role: 'admin',
    user: req.user
  });
};

 const userDataController = (req: Request, res: Response) => {
  console.log("User data accessed by:", req.user);
  res.json({
    message: "Welcome User! You have access to user features.",
    role: "user",
    user: req.user
  });
};

const BlogController = async (req: Request, res: Response) => {
  try {
    const { title, description, image } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // If you're using auth middleware and attaching user to req
    const userId = (req as any).user?.userId || null;
const email = (req as any).user?.email || null;
    const newBlog = new BlogModel({
      title,
      description,
      image,
      email,
      createdBy: userId
    });

    await newBlog.save();

    return res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { loginController, registerController ,  adminDataController, userDataController  , BlogController};
