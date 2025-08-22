import express from 'express';
import { loginController, registerController, adminDataController, userDataController } from '../contoller/TodoController';
import { auth } from '../middleware/TodoMiddleware';
import { format } from 'path';

const router = express.Router();

// Public routes
router.post('/register', registerController);
router.post('/login', loginController);

// Protected routes
router.get('/admin', auth('admin'), adminDataController); 
router.get('/user', auth('user'), userDataController);   
// router.get('/profile', auth(), (req, res) => {          
//   res.json({ message: 'Profile data', user: req.user });
// });

export default router;
