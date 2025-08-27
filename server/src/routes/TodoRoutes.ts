import express from 'express';
import { loginController, registerController, adminDataController, userDataController , BlogController } from '../contoller/TodoController';
import { auth } from '../middleware/TodoMiddleware';
import { format } from 'path';
import BlogModel from '../model/BlogModel';

const router = express.Router();

// Public routes
router.post('/register', registerController);
router.post('/login', loginController);
router.get("/blog", async (req, res) => {
  try {
    const blogs = await BlogModel.find().sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Protected routes
router.get('/admin', auth('admin'), adminDataController); 
router.get('/user', auth('user'), userDataController);   
// router.post('/bl og', BlogController);
router.post('/blog',auth("user") ,  BlogController);

export default router;
