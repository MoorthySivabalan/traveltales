import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  fullName: string
  email: string
  phone: string
  passwordHash: string
  role: 'user' | 'admin'
  isVerified: boolean
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model<IUser>('User', UserSchema)