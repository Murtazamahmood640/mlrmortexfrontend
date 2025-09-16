// src/pages/EventsPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { Calendar, MapPin, Users, Clock, Search, Filter } from 'lucide-react';

const EventsPage: React.FC = () => {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    if (!event.approved) return false;

    const title = (event.title || '').toLowerCase();
    const desc = (event.description || '').toLowerCase();
    const dept = (event.department || '').toLowerCase();

    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      desc.includes(searchTerm.toLowerCase()) ||
      dept.includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['all', 'technical', 'cultural', 'sports', 'academic', 'workshop'];
  const statuses = ['all', 'upcoming', 'ongoing', 'completed'];

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">College Events</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Discover and participate in exciting events happening around campus
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-200"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none text-gray-200"
              >
                {categories.map(category => (
                  <option key={category} value={category} className='bg-gray-900 '>
                    {category === 'all' ? 'All Categories' : capitalize(category)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-200"
              >
                {statuses.map(status => (
                  <option key={status} value={status} className='bg-gray-900 '>
                    {status === 'all' ? 'All Events' : capitalize(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event: any) => (
            <div
              key={event.id ?? event._id}
              className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border border-gray-800"
            >
              <div className="relative">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover opacity-95"
                />
                <div className="absolute top-4 left-4 ">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.category === 'technical'
                        ? 'bg-blue-800 text-blue-200'
                        : event.category === 'cultural'
                        ? 'bg-purple-800 text-purple-200'
                        : event.category === 'sports'
                        ? 'bg-emerald-800 text-emerald-200'
                        : event.category === 'academic'
                        ? 'bg-indigo-800 text-indigo-200'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    {capitalize(event.category || 'Other')}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === 'upcoming'
                        ? 'bg-green-800 text-green-100'
                        : event.status === 'ongoing'
                        ? 'bg-yellow-800 text-yellow-100'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    {capitalize(event.status || '')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                    <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Clock className="h-4 w-4 mr-2 text-yellow-400" />
                    <span>{new Date(event.startDateTime).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Users className="h-4 w-4 mr-2 text-yellow-400" />
                    <span>{event.registeredCount}/{event.maxParticipants} registered</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">by {event.organizerName}</div>
                  <Link
                    to={`/events/${event.id ?? event._id}`}
                    className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow">
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

/* Helpers */
function capitalize(s: string) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
