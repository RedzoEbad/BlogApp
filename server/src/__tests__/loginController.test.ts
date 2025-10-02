import { Request, Response } from 'express';
import { loginController } from '../contoller/TodoController';  // adjust path
import UserModel from '../model/TodoModel';            // adjust path
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../model/TodoModel');   // mock the model module
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('loginController', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 400 if email or password missing', async () => {
    const req = { body: {} } as Request;
    const res = mockResponse();
    await loginController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect((res.json as jest.Mock).mock.calls[0][0]).toEqual({ message: 'Email and password are required' });
  });

  it('returns 401 if user not found', async () => {
    (UserModel as any).findOne = jest.fn().mockResolvedValue(null);
    const req = { body: { email: 'a@b.com', password: 'pass' } } as Request;
    const res = mockResponse();
    await loginController(req, res);
    expect((UserModel as any).findOne).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(res.status).toHaveBeenCalledWith(401);
    expect((res.json as jest.Mock).mock.calls[0][0]).toEqual({ message: 'Invalid email or password' });
  });

  it('returns 401 if password invalid', async () => {
    const fakeUser = { _id: 'id1', email: 'a@b.com', password: 'hashed', name: 'Test', role: 'user' };
    (UserModel as any).findOne = jest.fn().mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = { body: { email: 'a@b.com', password: 'wrong' } } as Request;
    const res = mockResponse();
    await loginController(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith('wrong', 'hashed');
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 200 and token on success', async () => {
    process.env.JWT_SECRET = 'test-secret';
    const fakeUser = { _id: 'id1', email: 'a@b.com', password: 'hashed', name: 'Test', role: 'admin' };
    (UserModel as any).findOne = jest.fn().mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('token-123');

    const req = { body: { email: 'a@b.com', password: 'right' } } as Request;
    const res = mockResponse();
    await loginController(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({ userId: fakeUser._id, email: fakeUser.email, role: fakeUser.role }),
      'test-secret',
      { expiresIn: '24h' }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock).mock.calls[0][0]).toMatchObject({ message: 'Login successful', token: 'token-123' });
  });

  it('returns 500 on exception', async () => {
    (UserModel as any).findOne = jest.fn().mockRejectedValue(new Error('db down'));
    const req = { body: { email: 'a@b.com', password: 'any' } } as Request;
    const res = mockResponse();
    await loginController(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect((res.json as jest.Mock).mock.calls[0][0]).toEqual({ message: 'Server error' });
  });
});
