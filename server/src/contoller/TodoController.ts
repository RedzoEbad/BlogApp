
import { Request, Response } from 'express';
import UserModel from '../model/TodoModel';
const loginController = (req: Request, res: Response) => {
    res.send("Login endpoint");
};
const registerController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new UserModel({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


export { loginController, registerController };