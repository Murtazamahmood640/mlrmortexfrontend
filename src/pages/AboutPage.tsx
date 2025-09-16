import React, { useEffect, useState } from "react"
import { Users, Target, Award, Heart, Calendar, Sparkles } from "lucide-react"

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: "Event Management",
      description:
        "Comprehensive platform for organizing and managing college events with real-time updates and notifications.",
    },
    {
      icon: Users,
      title: "Community Engagement",
      description:
        "Connect students, faculty, and staff through shared interests and collaborative event participation.",
    },
    {
      icon: Award,
      title: "Achievement Tracking",
      description: "Track participation, earn certificates, and build a portfolio of your college activities and achievements.",
    },
    {
      icon: Sparkles,
      title: "Rich Media Gallery",
      description: "Preserve memories with our comprehensive media gallery featuring photos and videos from all events.",
    },
  ]

  const team = [
    {
      name: "Burhan Uddin",
      role: "System Administrator",
      department: "Computer Science",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    },
    {
      name: "Ahmed Ali",
      role: "Event Coordinator",
      department: "Arts & Culture",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    },
    {
      name: "Aman Ullah",
      role: "Academic Liaison",
      department: "Business Administration",
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg",
    },
  ]


  const [activeStudents, setActiveStudents] = useState<number | null>(null)
  const [eventsOrganized, setEventsOrganized] = useState<number | null>(null)
  const [certificatesIssued, setCertificatesIssued] = useState<number | null>(null)
  // Departments and satisfaction rate can remain static unless you want to make them dynamic

  useEffect(() => {
    fetch("/api/users/active-students-count")
      .then((res) => res.json())
      .then((data) => setActiveStudents(data.count))
      .catch(() => setActiveStudents(null))
    fetch("/api/users/certificates-count")
      .then((res) => res.json())
      .then((data) => setCertificatesIssued(data.count))
      .catch(() => setCertificatesIssued(null))
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEventsOrganized(Array.isArray(data) ? data.length : null))
      .catch(() => setEventsOrganized(null))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-yellow-400">About EventSphere</h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-300">
            Transforming college event management through innovative technology and community engagement.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Heart className="h-6 w-6 text-yellow-400" />
            <span className="text-lg text-gray-300">Built with passion for our college community</span>
          </div>
        </div>
      </section>

      {/* Mission + Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-6 gap-3">
              <Target className="h-8 w-8 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-300 mb-4">
              EventSphere was created to bridge the gap between event organizers and participants in our college community.
              We believe every student should have easy access to information about campus events and opportunities for
              engagement.
            </p>
            <p className="text-lg text-gray-300">
              Our platform removes barriers to event discovery and registration, creating a seamless experience that
              encourages participation and strengthens community bonds.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800 shadow-lg">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6">Platform Statistics</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-white mb-1">{activeStudents !== null ? activeStudents : "-"}</div>
                <div className="text-sm text-gray-400">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-white mb-1">{eventsOrganized !== null ? eventsOrganized : "-"}</div>
                <div className="text-sm text-gray-400">Events Organized</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-white mb-1">{certificatesIssued !== null ? certificatesIssued : "-"}</div>
                <div className="text-sm text-gray-400">Certificates Issued</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-extrabold text-white mb-1">15</div>
                <div className="text-sm text-gray-400">Departments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-yellow-400 mb-3">Platform Features</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">Discover the powerful features that make EventSphere the perfect solution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-center border border-gray-800 shadow hover:shadow-2xl transition"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mb-4 shadow-inner">
                    <Icon className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-yellow-400 mb-3">Meet Our Team</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">The dedicated professionals who make EventSphere possible.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:shadow-2xl transition"
              >
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover opacity-95" />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-yellow-400 font-medium mb-1">{member.role}</p>
                  <p className="text-gray-400">{member.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-800 shadow">
              <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Community First</h3>
              <p className="text-gray-300">We prioritize the needs of our college community, ensuring every feature brings people together.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-800 shadow">
              <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Innovation</h3>
              <p className="text-gray-300">We evolve our platform with modern tech to enhance user experience.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-800 shadow">
              <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Excellence</h3>
              <p className="text-gray-300">We strive for excellence in design and functionality across the platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Involved?</h2>
          <p className="text-lg text-gray-300 mb-6">
            Join thousands of students who are already using EventSphere to discover and participate in amazing college events.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/events"
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition"
            >
              Explore Events
            </a>

            <a
              href="/register"
              className="inline-flex items-center justify-center border-2 border-yellow-500 text-yellow-300 px-8 py-3 rounded-lg hover:bg-yellow-500 hover:text-black transition"
            >
              Join Community
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
