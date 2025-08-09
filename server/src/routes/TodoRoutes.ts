import * as express from 'express';
import { loginController, registerController } from '../contoller/TodoController'

const router = express.Router();

router.get('/login', loginController);
router.post('/register', registerController);

export default router;