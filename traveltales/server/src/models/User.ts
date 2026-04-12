import mongoose, { Schema, Document, HydratedDocument } from 'mongoose'
export interface IUser extends Document {
  fullName: string
  email: string
  phone?: string
  passwordHash: string
  role: 'user' | 'admin'
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
   savedTrips: mongoose.Types.ObjectId[]
}
const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    savedTrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }]
  },
  { timestamps: true }
)
userSchema.pre('save', async function (this: HydratedDocument<IUser>) {
  if (this.email) {
    this.email = this.email.trim().toLowerCase()
  }
})
const User =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User