import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import { generateToken } from '../utils/tokenUtils'

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, password } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ fullName, email, phone, passwordHash })
    const token = generateToken(user._id.toString(), user.role)

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error during signup' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user._id.toString(), user.role)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' })
  }
}

export const logout = async (_req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' })
}