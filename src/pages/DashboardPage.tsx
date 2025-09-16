import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { Calendar, Users, Award, Clock, MapPin, Star } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { events, getRegistrationsForStudent, getFeedbackForEvent } = useEvents();

  if (!user) return null;

  // Calculate event status dynamically (same as OrganizerDashboard)
  const calculateStatus = (event: any) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    if (now > end) return "completed";
    return "upcoming";
  };

  const userRegistrations = getRegistrationsForStudent(user.id);
  const registeredEvents = events
    .map(e => ({ ...e, status: calculateStatus(e) }))
    .filter(event =>
      userRegistrations.some(reg => reg.eventId === event._id && reg.status !== 'cancelled')
    );

  const upcomingEvents = registeredEvents.filter(event => event.status === 'upcoming');
  const completedEvents = registeredEvents.filter(event => event.status === 'completed');

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">Welcome back, {user.fullName}!</h1>
          <p className="text-gray-300 mt-2">Manage your event registrations and track your participation</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Calendar className="h-8 w-8 text-yellow-400" />} label="Total Registered" value={registeredEvents.length} />
          <StatCard icon={<Clock className="h-8 w-8 text-yellow-400" />} label="Upcoming" value={upcomingEvents.length} />
          <StatCard icon={<Award className="h-8 w-8 text-yellow-400" />} label="Completed" value={completedEvents.length} />
          <StatCard icon={<Users className="h-8 w-8 text-yellow-400" />} label="Department" valueText={user.department || '—'} />
        </div>

        {/* Upcoming Events */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
            <p className="text-sm text-gray-400">{upcomingEvents.length} registered</p>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-800 shadow">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-44 object-cover" />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryBadge(event.category)}`}>{capitalize(event.category)}</span>
                      <span className="text-sm text-gray-400">{new Date(event.startDateTime).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>

                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-yellow-400" />{new Date(event.startDateTime).toLocaleDateString()} - {new Date(event.endDateTime).toLocaleDateString()}</div>
                      <div className="flex items-center"><Clock className="h-4 w-4 mr-2 text-yellow-400" />{new Date(event.startDateTime).toLocaleTimeString()} - {new Date(event.endDateTime).toLocaleTimeString()}</div>
                      <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-yellow-400" />{event.venue}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />} title="No Upcoming Events" description="You haven't registered for any upcoming events yet." />
          )}
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <p className="text-sm text-gray-400">{completedEvents.length} completed</p>
          </div>

          {completedEvents.length > 0 ? (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow overflow-hidden border border-gray-800">
              <div className="divide-y divide-gray-800">
                {completedEvents.slice(0, 5).map((event) => {
                  const registration = userRegistrations.find(reg => reg.eventId === event._id);
                  const feedback = getFeedbackForEvent(event._id).find(f => f.studentId === user.id);

                  return (
                    <div key={event._id} className="p-6 flex items-start gap-4">
                      <img src={event.imageUrl} alt={event.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                            <p className="text-sm text-gray-400">{new Date(event.endDate).toLocaleDateString()}</p>
                            <div className="flex items-center mt-2 gap-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${registration?.attended ? 'bg-green-100 text-green-800' : 'bg-gray-800 text-gray-300'}`}>
                                {registration?.attended ? 'Attended' : 'Registered'}
                              </span>

                              {feedback && (
                                <div className="flex items-center text-sm text-gray-300">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                                  <span>{feedback.rating}/5</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-sm text-gray-400">
                            {event.registeredCount}/{event.maxParticipants}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState icon={<Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />} title="No Activity Yet" description="Your event participation history will appear here." />
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;

/* ----------------- small helpers / components ----------------- */

function StatCard({ icon, label, value, valueText }: { icon: React.ReactNode; label: string; value?: number; valueText?: string | number }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 shadow flex items-center">
      <div className="p-3 rounded-lg bg-black/30">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{typeof valueText !== 'undefined' ? valueText : (value ?? 0)}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow p-8 border border-gray-800 text-center">
      {icon}
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}

function capitalize(s: string) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function categoryBadge(category: string) {
  switch (category) {
    case 'technical': return 'bg-blue-100 text-blue-800';
    case 'cultural': return 'bg-purple-100 text-purple-800';
    case 'sports': return 'bg-green-100 text-green-800';
    case 'academic': return 'bg-pink-100 text-pink-800';
    case 'workshop': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-800 text-gray-300';
  }
}
