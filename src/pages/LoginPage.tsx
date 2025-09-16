import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Mail, Lock, AlertCircle } from "lucide-react"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (success) {
        // Get user from localStorage after login
        const savedUser = localStorage.getItem('currentUser')
        let redirectPath = "/dashboard"
        if (savedUser) {
          const userObj = JSON.parse(savedUser)
          if (userObj.role === "admin") redirectPath = "/admin"
          else if (userObj.role === "organizer") redirectPath = "/organizer"
          else if (userObj.role === "participant") redirectPath = "/dashboard"
          else redirectPath = "/dashboard"
        }
        navigate(redirectPath)
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }, 100)
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError(err + "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to your EventSphere account</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-8 border border-gray-800">
          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-black/30 rounded-lg border border-gray-800">
            <h3 className="font-semibold text-yellow-400 mb-2">Demo Credentials:</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>
                <strong className="text-white">Admin:</strong> admin@college.edu / <span className="text-yellow-300">admin123</span>
              </div>
              <div>
                <strong className="text-white">Organizer:</strong> organizer@college.edu / <span className="text-yellow-300">organizer123</span>
              </div>
              <div>
                <strong className="text-white">Student:</strong> student@college.edu / <span className="text-yellow-300">student123</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-3 text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="you@domain.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg transition-colors font-semibold disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-yellow-300 hover:text-yellow-400 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
