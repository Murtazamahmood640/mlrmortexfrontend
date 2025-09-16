import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEvents } from "../contexts/EventContext";
import {
  Plus,
  Calendar,
  Users,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
} from "lucide-react";

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "technical",
    startDateTime: "",
    endDateTime: "",
    venue: "",
    maxParticipants: 100,
    registrationDeadline: "",
    certificateFee: 0,
    tags: "",
    imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
  });

  if (!user || (user.role !== "organizer" && user.role !== "admin")) return null;

  // Calculate status dynamically
  const calculateStatus = (event: any) => {
    const now = new Date();
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    if (now > end) return "completed";
    return "upcoming";
  };

  const organizerEvents = events
    .filter((event) => event.organizerId === user.id)
    .map((event) => ({ ...event, status: calculateStatus(event) }));

  const upcomingEvents = organizerEvents.filter((event) => event.status === "upcoming");
  const completedEvents = organizerEvents.filter((event) => event.status === "completed");
  const totalRegistrations = organizerEvents.reduce(
    (sum, event) => sum + (event.registeredCount || 0),
    0
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "maxParticipants" || name === "certificateFee"
          ? parseInt(value as string) || 0
          : value,
    }));
  };

  // Prefill form when editing
  useEffect(() => {
    if (isEditing && selectedEvent) {
      setFormData({
        title: selectedEvent.title || "",
        description: selectedEvent.description || "",
        category: selectedEvent.category || "technical",
        startDateTime: selectedEvent.startDateTime
          ? new Date(selectedEvent.startDateTime).toISOString().slice(0, 16)
          : "",
        endDateTime: selectedEvent.endDateTime
          ? new Date(selectedEvent.endDateTime).toISOString().slice(0, 16)
          : "",
        venue: selectedEvent.venue || "",
        maxParticipants: selectedEvent.maxParticipants || 100,
        registrationDeadline: selectedEvent.registrationDeadline
          ? new Date(selectedEvent.registrationDeadline).toISOString().slice(0, 16)
          : "",
        certificateFee: selectedEvent.certificateFee || 0,
        tags: (selectedEvent.tags || []).join(", "),
        imageUrl: selectedEvent.imageUrl || formData.imageUrl,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, selectedEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    };

    if (isEditing && selectedEvent) {
      updateEvent(selectedEvent._id, eventData);
    } else {
      addEvent({
        ...eventData,
        organizerId: user.id,
        organizerName: user.fullName,
        department: user.department || "Unknown",
        registeredCount: 0,
      } as any);
    }

    setShowCreateForm(false);
    setShowEventModal(false);
    setIsEditing(false);
    setFormData({
      title: "",
      description: "",
      category: "technical",
      startDateTime: "",
      endDateTime: "",
      venue: "",
      maxParticipants: 100,
      registrationDeadline: "",
      certificateFee: 0,
      tags: "",
      imageUrl:
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    });
  };
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Calendar className="h-8 w-8 text-yellow-400" />}
          title="Total Events"
          value={organizerEvents.length}
        />
        <StatCard
          icon={<Users className="h-8 w-8 text-yellow-400" />}
          title="Total Registrations"
          value={totalRegistrations}
        />
        <StatCard
          icon={<Clock className="h-8 w-8 text-yellow-400" />}
          title="Upcoming"
          value={upcomingEvents.length}
        />
        <StatCard
          icon={<BarChart3 className="h-8 w-8 text-yellow-400" />}
          title="Completed"
          value={completedEvents.length}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 shadow">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold shadow"
        >
          <Plus className="h-5 w-5" />
          Create New Event
        </button>
      </div>
    </div>
  );

  const renderEventManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Manage Events</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizerEvents.map((event) => (
          <div
            key={event._id}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-800 shadow"
          >
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-black/30 text-yellow-300">
                  {event.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === "upcoming"
                      ? "bg-yellow-100 text-yellow-800"
                      : event.status === "ongoing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {event.title}
              </h3>

              <div className="space-y-2 mb-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                  {new Date(event.startDateTime).toLocaleDateString()} -{" "}
                  {new Date(event.endDateTime).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-yellow-400" />
                  {event.startDateTime}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
                  {event.venue}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-yellow-400" />
                  {event.registeredCount}/{event.maxParticipants} registered
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsEditing(false);
                    setShowEventModal(true);
                  }}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-800 text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </button>
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsEditing(true);
                    setShowEventModal(true);
                  }}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-800 text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-red-600 text-red-300 rounded-lg hover:bg-red-800 text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-6">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={<BarChart3 className="h-4 w-4 inline mr-2" />}
            >
              Overview
            </TabButton>
            <TabButton
              active={activeTab === "events"}
              onClick={() => setActiveTab("events")}
              icon={<Calendar className="h-4 w-4 inline mr-2" />}
            >
              Manage Events
            </TabButton>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "events" && renderEventManagement()}

        {/* Create / Edit / View Modal */}
        {(showCreateForm || showEventModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800 shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-yellow-400">
                  {isEditing
                    ? "Edit Event"
                    : showCreateForm
                    ? "Create New Event"
                    : "Event Details"}
                </h3>

                {/* VIEW MODE */}
                {!isEditing && !showCreateForm && selectedEvent && (
                  <div className="space-y-4 text-gray-300">
                    <img
                      src={selectedEvent.imageUrl}
                      alt={selectedEvent.title}
                      className="w-full rounded-lg mb-4"
                    />
                    <h2 className="text-2xl font-bold text-white">
                      {selectedEvent.title}
                    </h2>
                    <p>{selectedEvent.description}</p>
                    <p className="text-sm">
                      <strong className="text-gray-300">Start:</strong>{" "}
                      {new Date(selectedEvent.startDateTime).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <strong className="text-gray-300">End:</strong>{" "}
                      {new Date(selectedEvent.endDateTime).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <strong className="text-gray-300">Venue:</strong>{" "}
                      {selectedEvent.venue}
                    </p>
                    <p className="text-sm">
                      <strong className="text-gray-300">Participants:</strong>{" "}
                      {selectedEvent.registeredCount}/
                      {selectedEvent.maxParticipants}
                    </p>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => setShowEventModal(false)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {/* CREATE / EDIT MODE */}
                {(isEditing || showCreateForm) && (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 text-gray-300"
                  >
                    <label className="block">
                      <span className="text-sm">Title</span>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-800"
                        placeholder="Event Title"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm">Description</span>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-800"
                        placeholder="Description"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm">Category</span>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-800"
                      >
                        <option value="technical">Technical</option>
                        <option value="cultural">Cultural</option>
                        <option value="sports">Sports</option>
                        <option value="academic">Academic</option>
                        <option value="workshop">Workshop</option>
                      </select>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="block">
                        <span className="text-sm">Start Date & Time</span>
                        <input
                          type="datetime-local"
                          name="startDateTime"
                          value={formData.startDateTime}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-800"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm">End Date & Time</span>
                        <input
                          type="datetime-local"
                          name="endDateTime"
                          value={formData.endDateTime}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-800"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-sm">Venue</span>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-800"
                        placeholder="Venue"
                      />
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm">Max Participants</span>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-800"
                        placeholder="Max Participants"
                        />
                        </label>
                    <label className="block">
                      <span className="text-sm">Registration DeadLine</span>
                      <input
                        type="date"
                        name="registrationDeadline"
                        value={formData.registrationDeadline}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-800"
                      />
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm">Certification Fee</span>
                      <input
                        type="number"
                        name="certificateFee"
                        value={formData.certificateFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-800"
                        placeholder="Certificate Fee"
                        />
                        </label>
                    <label className="block">
                      <span className="text-sm">Tags</span>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-800"
                        placeholder="Tags (comma separated)"
                        />
                        </label>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg"
                      >
                        {isEditing ? "Save Changes" : "Create Event"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateForm(false);
                          setShowEventModal(false);
                          setIsEditing(false);
                        }}
                        className="flex-1 border border-gray-700 py-3 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;

// ---------- small styled components ----------
const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) => (
  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

const TabButton = ({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
      active
        ? "bg-yellow-500 text-black"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`}
  >
    {icon}
    {children}
  </button>
);
