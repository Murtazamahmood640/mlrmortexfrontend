import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })
import {
  Calendar,
  Mail,
  Phone,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp,
  Check,
  Copy,
} from "lucide-react"

const GOLD = "#D4AF37"

const Footer: React.FC = () => {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [subscribeMsg, setSubscribeMsg] = useState<string | null>(null)
  const [subscribeError, setSubscribeError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [openQuickLinks, setOpenQuickLinks] = useState(false)
  const [openContact, setOpenContact] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

  const handleSubscribe = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setSubscribeError(null)
    setSubscribeMsg(null)

    if (!isValidEmail(email)) {
      setSubscribeError("Please enter a valid email.")
      return
    }

    setSubmitting(true)
    try {
      await new Promise((res) => setTimeout(res, 900))
      setSubscribeMsg("Subscribed! Check your inbox.")
      setEmail("")
    } catch {
      setSubscribeError("Something went wrong. Try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast(`${label} copied`)
    } catch {
      setToast(`Can't copy ${label}`)
    }
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <>
      <footer className="bg-black text-white border-t border-white-800 ">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <Calendar className="h-8 w-8" style={{ color: GOLD }} />
                <span className="text-xl font-semibold">EventSphere</span>
              </Link>
              <p className="text-sm text-gray-400">
                Build, manage and showcase events — simple, fast and beautiful.
              </p>

    <div className="flex items-center gap-3">
  <a
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    className="transform transition hover:scale-110"
  >
    <Twitter className="h-5 w-5" style={{ color: GOLD }} />
  </a>
  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="transform transition hover:scale-110"
  >
    <Instagram className="h-5 w-5" style={{ color: GOLD }} />
  </a>
  <a
    href="https://linkedin.com"
    target="_blank"
    rel="noopener noreferrer"
    className="transform transition hover:scale-110"
  >
    <Linkedin className="h-5 w-5" style={{ color: GOLD }} />
  </a>
</div>

            </div>

            {/* Quick links */}
            <div>
              <button
                onClick={() => setOpenQuickLinks((v) => !v)}
                className="flex w-full items-center justify-between md:justify-start"
              >
                <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
                <span className="md:hidden text-sm">{openQuickLinks ? "−" : "+"}</span>
              </button>

              <ul
                className={`text-sm space-y-2 transition-[max-height] duration-300 overflow-hidden md:overflow-visible ${
                  openQuickLinks ? "max-h-40" : "max-h-0 md:max-h-full"
                }`}
              >
                <li><Link to="/" className="hover:text-yellow-400" onClick={scrollToTop}>Home</Link></li>
                <li><Link to="/events" className="hover:text-yellow-400" onClick={scrollToTop}>Events</Link></li>
                <li><Link to="/gallery" className="hover:text-yellow-400" onClick={scrollToTop}>Gallery</Link></li>
                <li><Link to="/about" className="hover:text-yellow-400" onClick={scrollToTop}>About</Link></li>
                <li><Link to="/contact" className="hover:text-yellow-400" onClick={scrollToTop}>Contact</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <button
                onClick={() => setOpenContact((v) => !v)}
                className="flex w-full items-center justify-between md:justify-start"
              >
                <h3 className="text-sm font-semibold mb-3">Contact</h3>
                <span className="md:hidden text-sm">{openContact ? "−" : "+"}</span>
              </button>

              <div
                className={`text-sm space-y-3 transition-[max-height] duration-300 overflow-hidden md:overflow-visible ${
                  openContact ? "max-h-60" : "max-h-0 md:max-h-full"
                }`}
              >
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-1 text-yellow-400" />
                  <div className="flex items-center gap-2">
                    <span>+92 300 1234567</span>
                    <button
                      onClick={() => handleCopy("+923001234567", "Phone")}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md hover:bg-gray-800"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1 text-yellow-400" />
                  <div className="flex items-center gap-2">
                    <span>support@eventsphere.com</span>
                    <button
                      onClick={() => handleCopy("support@eventsphere.com", "Email")}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md hover:bg-gray-800"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div>
                  <strong>Location:</strong>
                  <div>Karachi, Pakistan</div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Stay in touch</h3>
              <p className="text-sm text-gray-400 mb-3">
                Subscribe for updates, new features and event tips.
              </p>

              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@domain.com"
                  className="flex-1 rounded-md border border-gray-700 bg-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md px-3 py-2 text-sm font-medium"
                  style={{ backgroundColor: GOLD, color: "#000" }}
                >
                  {submitting ? "Sending..." : "Subscribe"}
                </button>
              </form>

              {subscribeMsg && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                  <Check className="w-4 h-4" />
                  <span>{subscribeMsg}</span>
                </div>
              )}
              {subscribeError && (
                <div className="mt-3 text-sm text-red-400">{subscribeError}</div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} EventSphere. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/terms" className="hover:text-yellow-400" onClick={scrollToTop}>Terms</Link>
              <Link to="/privacy" className="hover:text-yellow-400" onClick={scrollToTop}>Privacy</Link>
              <Link to="/support" className="hover:text-yellow-400" onClick={scrollToTop}>Support</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 bottom-6 z-50 rounded-md bg-gray-900 text-white px-4 py-2 text-sm flex items-center gap-2 shadow-lg">
          <Check className="w-4 h-4 text-green-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Back to top */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-4 bottom-20 z-50 rounded-full p-3 shadow-lg bg-yellow-500 hover:scale-105 hover:yellow-600 transition"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}
    </>
  )
}

export default Footer
