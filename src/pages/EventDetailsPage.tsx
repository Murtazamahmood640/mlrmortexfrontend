import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents, Feedback } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  User,
  Star,
  Share2,
  Download,
  CreditCard,
  CheckCircle,
  UserCheck,
} from 'lucide-react';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    getEventById,
    registerForEvent,
    cancelRegistration,
    getRegistrationsForStudent,
    getFeedbackForEvent,
    submitFeedback,
    markAttendance,
    markCertificatePaid,
  } = useEvents();

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [certificatePaidMarked, setCertificatePaidMarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Feedback state
  const [eventFeedbacks, setEventFeedbacks] = useState<Feedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  if (!id) return <div className="min-h-screen bg-gray-900 text-gray-100 p-8">Event not found</div>;

  const event = getEventById(id);
  if (!event) return <div className="min-h-screen bg-gray-900 text-gray-100 p-8">Event not found</div>;

  // Load feedbacks
  useEffect(() => {
    (async () => {
      if (id) {
        setLoadingFeedback(true);
        const feedbacks = await getFeedbackForEvent(id);
        setEventFeedbacks(feedbacks);
        setLoadingFeedback(false);
      }
    })();
  }, [id, getFeedbackForEvent]);

  const userRegistrations = user ? getRegistrationsForStudent(user.id) : [];
  const isRegistered = userRegistrations.some((reg) => reg.eventId === id && reg.status !== 'cancelled');
  const registration = userRegistrations.find((reg) => reg.eventId === id && reg.status !== 'cancelled');
  const hasSubmittedFeedback = eventFeedbacks.some((f) => f.studentId._id == String(user?.id));

  // Combine persisted registration attended flag with local state for immediate UI response
  const hasAttended = Boolean(registration?.attended) || attendanceMarked;
  const hasCertificatePaid = Boolean(registration?.certificatePaid) || certificatePaidMarked;

  const handleRegistration = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isRegistered) {
      await cancelRegistration(id, user!.id);
    } else {
      const success = await registerForEvent(id, user!.id);
      if (!success) {
        alert('Registration failed — event might be full.');
      }
    }
  };

  const handleMarkAttendance = async () => {
    if (!user || !registration) return;
    await markAttendance(id, user.id, true);
    setAttendanceMarked(true);
  };
  
  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    if (!user || !registration) return;
    await markCertificatePaid(id, user.id, true);
    setCertificatePaidMarked(true);
    alert('Payment successful — you can download your certificate after the event.');
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const fb = await submitFeedback({
      eventId: String(id),
      rating,
      comments,
      studentId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _id: '', // will be set by backend
    });

    if (fb) {
      setEventFeedbacks((prev) => [...prev, fb]);
    }

    setShowFeedbackForm(false);
    setComments('');
    setRating(5);
  };

  const handleShare = (platform: string) => {
    const eventUrl = window.location.href;
    const text = `Check out this event: ${event.title}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + eventUrl)}`, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  const averageRating =
    eventFeedbacks.length > 0
      ? eventFeedbacks.reduce((sum, f) => sum + f.rating, 0) / eventFeedbacks.length
      : 0;

  const canRegister = event.status === 'upcoming' && event.registeredCount < event.maxParticipants && !hasAttended;
  const canMarkAttendance = isRegistered && event.status === 'ongoing' && !hasAttended;
  const canPayCertificateFee = hasAttended && event.certificateFee && !registration?.certificatePaid;
  const canDownloadCertificate = hasAttended && registration?.certificatePaid && event.status === 'completed';
  const canSubmitFeedback = hasAttended && event.status === 'completed' && !hasSubmittedFeedback;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Event Header */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-800/40 backdrop-blur rounded-2xl shadow-2xl overflow-hidden mb-8 border border-gray-800">
          <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover" />

          <div className="p-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.category === 'technical' ? 'bg-blue-600 text-white' :
                  event.category === 'cultural' ? 'bg-purple-600 text-white' :
                  event.category === 'sports' ? 'bg-green-600 text-white' :
                  event.category === 'academic' ? 'bg-indigo-600 text-white' :
                  'bg-gray-700 text-white'
                }`}
              >
                {event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'General'}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === 'upcoming' ? 'bg-emerald-700 text-white' :
                  event.status === 'ongoing' ? 'bg-yellow-600 text-white' :
                  'bg-gray-700 text-white'
                }`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>

              {event.tags?.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full text-sm bg-gray-700 text-gray-200">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-extrabold text-yellow-400 mb-4">{event.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-blue-400" />
                  <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-yellow-400" />
                  <span>{new Date(event.startDateTime).toLocaleTimeString()}</span>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-red-400" />
                  <span>{event.venue}</span>
                </div>
              </div>

              <div className="space-y-3 text-gray-300">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-indigo-400" />
                  <span>{event.organizerName} — {event.department}</span>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-green-400" />
                  <span>{event.registeredCount}/{event.maxParticipants} registered</span>
                </div>

                {eventFeedbacks.length > 0 && (
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-3 text-yellow-400" />
                    <span>{averageRating.toFixed(1)}/5 ({eventFeedbacks.length} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">{event.description}</p>

            {/* Action Buttons row */}
            <div className="flex flex-wrap gap-3 items-center">
              {user?.role === 'participant' && (
                <>
                  {canRegister && (
                    <button
                      onClick={handleRegistration}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        isRegistered ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      }`}
                    >
                      {isRegistered ? 'Cancel Registration' : 'Register Now'}
                    </button>
                  )}

                  {canMarkAttendance && (
                    <button
                      onClick={handleMarkAttendance}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center"
                    >
                      <UserCheck className="h-5 w-5 mr-2" />
                      Mark Attendance
                    </button>
                  )}

                  {canPayCertificateFee && (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-6 py-3 bg-emerald-600 text-black rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay Fee (₹{event.certificateFee})
                    </button>
                  )}

                  {canDownloadCertificate && (
                    <button
                      onClick={() => alert('Downloading certificate... (demo)')}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Certificate
                    </button>
                  )}
                </>
              )}

              {!isAuthenticated && canRegister && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                >
                  Login to Register
                </button>
              )}

              {/* Share dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu((s) => !s)}
                  className="px-5 py-3 border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-800/60 transition-colors flex items-center gap-2"
                >
                  <Share2 className="h-5 w-5" />
                  Share
                </button>

                {showShareMenu && (
                  <div className="right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-40">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700/60"
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700/60"
                    >
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700/60"
                    >
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700/60"
                    >
                      WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Registration Status */}
        {isRegistered && (
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Registration Status</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-900/40 rounded-lg">
                <div className="text-sm text-gray-300 font-medium">Status</div>
                <div className="text-white font-semibold">
                  {registration?.status ? registration.status.charAt(0).toUpperCase() + registration.status.slice(1) : 'Registered'}
                </div>
              </div>

              <div className="text-center p-4 bg-gray-900/40 rounded-lg">
                <div className="text-sm text-gray-300 font-medium">Registered On</div>
                <div className="text-white">
                  {registration ? new Date(registration.createdAt).toLocaleDateString() : '-'}
                </div>
              </div>

              <div className="text-center p-4 bg-gray-900/40 rounded-lg">
                <div className="text-sm text-gray-300 font-medium">Attendance</div>
                <div className="text-white">{hasAttended ? 'Marked' : 'Not Marked'}</div>
              </div>

              <div className="text-center p-4 bg-gray-900/40 rounded-lg">
                <div className="text-sm text-gray-300 font-medium">Certificate</div>
                <div className="text-white">{registration?.certificatePaid ? 'Paid' : 'Not Paid'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback form */}
        {canSubmitFeedback && (
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Share Your Feedback</h2>

            {!showFeedbackForm ? (
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
              >
                Submit Feedback
              </button>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`h-8 w-8 rounded-md flex items-center justify-center ${s <= rating ? 'text-yellow-400' : 'text-gray-500'}`}
                        aria-label={`Rate ${s}`}
                      >
                        <Star fill="currentColor" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Comments (optional)</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-gray-100"
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 font-semibold">
                    Submit
                  </button>
                  <button type="button" onClick={() => setShowFeedbackForm(false)} className="px-6 py-2 border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-800/60">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Existing Feedbacks */}
        {loadingFeedback ? (
          <div className="text-gray-400">Loading feedback...</div>
        ) : (
          eventFeedbacks.length > 0 && (
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Event Feedback</h2>

              <div className="space-y-6">
                {eventFeedbacks.map((feedback) => (
                  <div key={feedback._id} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="font-medium text-gray-200">{feedback.studentId?.fullName || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(feedback.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">{feedback.comments || 'No comments provided.'}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(feedback.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Payment</h2>
            <p className="text-gray-300 mb-6">Pay ₹{event.certificateFee} for your certificate.</p>

            <div className="flex gap-3">
              <button onClick={handlePaymentSuccess} className="flex-1 px-6 py-3 bg-emerald-600 text-black rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                Pay Now
              </button>
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-6 py-3 border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-800/60">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
