import React from "react"
import SimpleSmokeCursor from "./components/SmokeCursor"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { EventProvider } from "./contexts/EventContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import EventsPage from "./pages/EventsPage"
import EventDetailsPage from "./pages/EventDetailsPage"
import DashboardPage from "./pages/DashboardPage"
import AdminDashboard from "./pages/AdminDashboard"
import OrganizerDashboard from "./pages/OrganizerDashboard"
import MediaGallery from "./pages/MediaGallery"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import SitemapPage from "./pages/SitemapPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          {/* SmokeCursor mounted once globally — change forceEnable to true for testing on touch devices */}
           <SimpleSmokeCursor forceEnable={true} spawnPerMove={1} />

          <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar always at the top */}
            <Navbar />

            {/* Main content grows to push footer down */}
            <main className="flex-1 pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/gallery" element={<MediaGallery />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer"
                  element={
                    <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                      <OrganizerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer always at the bottom */}
            <Footer />
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  )
}

export default App
