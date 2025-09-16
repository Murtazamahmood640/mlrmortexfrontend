import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useEvents } from "../contexts/EventContext"
import { Calendar, Users, Award, Sparkles, ArrowRight, Clock, MapPin } from "lucide-react"
// import { Button } from "../components/ui/button" 




const HomePage: React.FC = () => {
  const { events } = useEvents()
  const upcomingEvents = events.filter((event) => event.status === "upcoming" && event.approved).slice(0, 3)
  const featuredEvent = upcomingEvents[0]

  const [activeStudents, setActiveStudents] = useState<number | null>(null)
  const [certificatesIssued, setCertificatesIssued] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/users/active-students-count")
      .then((res) => res.json())
      .then((data) => setActiveStudents(data.count))
      .catch(() => setActiveStudents(null))
    fetch("/api/users/certificates-count")
      .then((res) => res.json())
      .then((data) => setCertificatesIssued(data.count))
      .catch(() => setCertificatesIssued(null))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-yellow-400">
              Welcome to <span className="text-white">EventSphere</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Your centralized platform for discovering, registering, and participating in college events.
              Never miss an opportunity to engage with your campus community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg transition-transform transform hover:-translate-y-0.5 font-semibold text-lg shadow-lg"
              >
                Explore Events
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center border-2 border-yellow-500 text-yellow-300 px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
              >
                Join Community
              </Link>
            </div>
          </div>

          {/* Featured Event (dark card) */}
          {featuredEvent && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">Featured Event</h2>
              <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto border border-gray-800">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={featuredEvent.imageUrl}
                      alt={featuredEvent.title}
                      className="w-full h-64 md:h-full object-cover opacity-95"
                    />
                  </div>

                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          featuredEvent.category === "technical"
                            ? "bg-blue-800 text-blue-200"
                            : featuredEvent.category === "cultural"
                            ? "bg-purple-800 text-purple-200"
                            : featuredEvent.category === "sports"
                            ? "bg-emerald-800 text-emerald-200"
                            : "bg-gray-800 text-gray-200"
                        }`}
                      >
                        {featuredEvent.category.charAt(0).toUpperCase() + featuredEvent.category.slice(1)}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4">{featuredEvent.title}</h3>
                    <p className="text-gray-300 mb-6">{featuredEvent.description.substring(0, 150)}...</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="h-5 w-5 mr-2 text-yellow-400" />
                        <span>{new Date(featuredEvent.startDateTime).toLocaleDateString()} • {new Date(featuredEvent.startDateTime).toLocaleTimeString()}</span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                        <span>{featuredEvent.venue}</span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <Users className="h-5 w-5 mr-2 text-gray-400" />
                        <span>{featuredEvent.registeredCount}/{featuredEvent.maxParticipants} registered</span>
                      </div>
                    </div>

                    <Link
                      to={`/events/${featuredEvent._id}`}
                      className="inline-flex items-center bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Section (cards) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl p-6 text-center border border-gray-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mb-4 shadow-inner">
                <Calendar className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white">{events.length}</h3>
              <p className="text-gray-300">Total Events</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl p-6 text-center border border-gray-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                <Users className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {activeStudents !== null ? activeStudents : "-"}
              </h3>
              <p className="text-gray-300">Active Students</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl p-6 text-center border border-gray-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 shadow-inner">
                <Award className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {certificatesIssued !== null ? certificatesIssued : "-"}
              </h3>
              <p className="text-gray-300">Certificates Issued</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl p-6 text-center border border-gray-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 shadow-inner">
                <Sparkles className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white">15</h3>
              <p className="text-gray-300">Departments</p>
            </div>
          </div>

          {/* Upcoming Events Preview (dark cards) */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-yellow-400">Upcoming Events</h2>
              <Link to="/events" className="text-yellow-400 hover:text-yellow-500 font-semibold flex items-center">
                View All Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:shadow-2xl transition-shadow">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover opacity-95" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.category === "technical"
                            ? "bg-blue-800 text-blue-200"
                            : event.category === "cultural"
                            ? "bg-purple-800 text-purple-200"
                            : event.category === "sports"
                            ? "bg-emerald-800 text-emerald-200"
                            : "bg-gray-800 text-gray-200"
                        }`}
                      >
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>

                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(featuredEvent.startDateTime).toLocaleTimeString()}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-300 mb-4">{event.description.substring(0, 100)}...</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-300 text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        {event.registeredCount}/{event.maxParticipants}
                      </div>
                      <Link to={`/events/${event._id}`} className="text-yellow-400 hover:text-yellow-500 font-semibold">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links - stylish cards */}
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
            <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Link
                to="/events"
                className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-800 rounded-lg p-6 text-center transition-transform transform hover:-translate-y-1"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mb-3 shadow-sm">
                  <Calendar className="h-6 w-6 text-black" />
                </div>
                <span className="font-semibold text-white">All Events</span>
              </Link>

              <Link
                to="/gallery"
                className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-800 rounded-lg p-6 text-center transition-transform transform hover:-translate-y-1"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mb-3 shadow-sm">
                  <Sparkles className="h-6 w-6 text-black" />
                </div>
                <span className="font-semibold text-white">Gallery</span>
              </Link>

              <Link
                to="/about"
                className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-800 rounded-lg p-6 text-center transition-transform transform hover:-translate-y-1"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mb-3 shadow-sm">
                  <Users className="h-6 w-6 text-black" />
                </div>
                <span className="font-semibold text-white">About Us</span>
              </Link>

              <Link
                to="/sitemap"
                className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-800 rounded-lg p-6 text-center transition-transform transform hover:-translate-y-1"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center mb-3 shadow-sm">
                  <Award className="h-6 w-6 text-black" />
                </div>
                <span className="font-semibold text-white">Sitemap</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
