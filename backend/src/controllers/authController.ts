import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { AppError } from '../utils/errorHandler';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(400, 'Email already registered');
  }

  const user = await User.create({ email, password });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
  
  res.status(201).json({ token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    throw new AppError(401, 'Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
  res.json({ token });
};
