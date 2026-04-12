import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import ProtectedRoute from "./components/auth/ProtectedRoute"

// ✅ NORMAL IMPORTS (NO LAZY = NO ERROR)
import Home from "./pages/Home"
import ExplorePackages from "./pages/ExplorePackages"
import PackageDetail from "./pages/PackageDetail"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import TripPlanner from "./pages/TripPlanner"
import Dashboard from "./pages/Dashboard"
import TripEditor from "./pages/TripEditor"
import HotelSearch from "./pages/HotelSearch"
import HotelDetail from "./pages/HotelDetail"
import CostCalculator from "./pages/CostCalculator"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

        <Toaster position="top-right" />

        <Navbar />

        <main className="flex-1">

          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ExplorePackages />} />
            <Route path="/explore/:id" element={<PackageDetail />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/planner"
              element={
                <ProtectedRoute>
                  <TripPlanner />
                </ProtectedRoute>
              }
            />

            <Route
              path="/trip-editor/:id"
              element={
                <ProtectedRoute>
                  <TripEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/hotels" element={<HotelSearch />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/calculator" element={<CostCalculator />} />

          </Routes>

        </main>

        <Footer />

      </div>
    </BrowserRouter>
  )
}

export default App