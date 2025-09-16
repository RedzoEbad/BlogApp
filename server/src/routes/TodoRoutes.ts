import express from 'express';
import { loginController,  registerController, adminDataController, userDataController , BlogController  , deleteDataController, getAllBlogsController , EditblogController} from '../contoller/TodoController';
import { auth } from '../middleware/TodoMiddleware';
import { format } from 'path';
import BlogModel from '../model/BlogModel';

const router = express.Router();

// Public routes
router.post('/register', registerController);
router.post('/login', loginController);
router.get("/blog", auth() , getAllBlogsController);
// Protected routes
router.get('/admin', auth('admin'), adminDataController); 
router.get('/user', auth('user'), userDataController);   
router.delete('/blog/:id', auth('user'), deleteDataController);
router.post('/blog',auth("user") ,  BlogController);
router.put('/blog/:id', auth('user'), EditblogController);


export default router;
