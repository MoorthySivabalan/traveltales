import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  fullName: string
  email: string
  role: 'user' | 'admin'
  isVerified: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      setAuth: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    { name: 'traveltales-auth' }
  )
)