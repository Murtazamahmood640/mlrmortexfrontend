import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEvents } from "../contexts/EventContext";
import {
  Users,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Settings,
  UserCheck,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, updateEvent } = useEvents();
  const [activeTab, setActiveTab] = useState<
    "overview" | "approvals" | "feedbacks" | "attendance" | "certificates" | "settings"
  >("overview");

  if (!user || user.role !== "admin") return null;

  const pendingEvents = events.filter((event) => !event.approved);
  const approvedEvents = events.filter((event) => event.approved);
  const totalRegistrations = events.reduce(
    (sum, event) => sum + (event.registeredCount || 0),
    0
  );

  const handleEventApproval = (eventId: string, approved: boolean) => {
    updateEvent(eventId, { approved });
  };

  // -----------------------
  // OVERVIEW TAB
  // -----------------------
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
              <Calendar className="h-8 w-8 text-black" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Total Events</p>
              <p className="text-2xl font-extrabold text-white">{events.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
              <Users className="h-8 w-8 text-black" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Total Registrations</p>
              <p className="text-2xl font-extrabold text-white">{totalRegistrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
              <Clock className="h-8 w-8 text-black" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Pending Approval</p>
              <p className="text-2xl font-extrabold text-white">{pendingEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <TrendingUp className="h-8 w-8 text-black" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Active Events</p>
              <p className="text-2xl font-extrabold text-white">
                {events.filter(
                  (e) => e.status === "upcoming" || e.status === "ongoing"
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-yellow-400 mb-6">Recent Events</h3>
        <div className="space-y-4">
          {events.slice(0, 5).map((event) => (
            <div
              key={event._id}
              className="flex items-center justify-between p-4 border border-gray-800 rounded-lg bg-gray-950/40"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-white">{event.title}</h4>
                  <p className="text-sm text-gray-400">{event.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.approved
                      ? "bg-green-800 text-green-100"
                      : "bg-yellow-800 text-yellow-100"
                  }`}
                >
                  {event.approved ? "Approved" : "Pending"}
                </span>
                <span className="text-sm text-gray-400">
                  {event.registeredCount}/{event.maxParticipants}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // -----------------------
  // EVENT APPROVALS TAB
  // -----------------------
  const renderEventApprovals = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-yellow-400">Event Approvals</h3>

      {pendingEvents.length > 0 ? (
        <div className="space-y-6">
          {pendingEvents.map((event) => (
            <div
              key={event._id}
              className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex space-x-4 w-full md:w-2/3">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-400 mb-3">
                      {event.description?.substring(0, 150)}...
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="font-medium text-gray-300">
                          Start Date:
                        </span>{" "}
                        <span className="text-gray-200">
                          {new Date(event.startDateTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Time:</span>{" "}
                        <span className="text-gray-200">
                          {new Date(event.startDateTime).toLocaleTimeString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Venue:</span>{" "}
                        <span className="text-gray-200">{event.venue}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">
                          Organizer:
                        </span>{" "}
                        <span className="text-gray-200">{event.organizerName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex space-x-3">
                  <button
                    onClick={() => handleEventApproval(event._id, true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-black rounded-lg hover:bg-green-500 transition-colors font-semibold"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleEventApproval(event._id, false)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800 text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">All Caught Up!</h3>
          <p className="text-gray-400">
            No events pending approval at the moment.
          </p>
        </div>
      )}
    </div>
  );

  // -----------------------
  // FEEDBACKS TAB
  // -----------------------
  const renderFeedbacks = () => (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold text-yellow-400 mb-6">Event Feedbacks</h3>
      {events.map((event) => (
        <div key={event._id} className="mb-6">
          <h4 className="font-bold text-white">{event.title}</h4>
          {event.feedbacks && event.feedbacks.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {event.feedbacks.map((fb) => (
                <li
                  key={fb._id}
                  className="bg-gray-800 p-3 rounded-lg text-sm"
                >
                  <p className="text-gray-200">
                    <span className="font-semibold">
                      {typeof fb.studentId === "object"
                        ? fb.studentId.fullName
                        : "Unknown"}
                    </span>
                    : {fb.comments}
                  </p>
                  <p className="text-yellow-400">⭐ {fb.rating}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No feedback yet.</p>
          )}
        </div>
      ))}
    </div>
  );

  // -----------------------
  // ATTENDANCE TAB
  // -----------------------
  // -----------------------
// ATTENDANCE TAB
// -----------------------
const renderAttendance = () => {
  const toggleAttendance = async (eventId: string, studentId: string, attended: boolean) => {
    try {
      const { data } = await API.post("/registrations/attendance", {
        eventId,
        studentId,
        attended,
      });

      // Update local state
      updateEvent(eventId, {
        registrations: events
          .find((e) => e._id === eventId)
          ?.registrations.map((reg) =>
            (typeof reg.studentId === "object" ? reg.studentId._id : reg.studentId) === studentId
              ? { ...reg, attended }
              : reg
          ),
      });
    } catch (err) {
      console.error("Attendance update error:", err);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold text-yellow-400 mb-6">Event Attendance</h3>
      {events.map((event) => (
        <div key={event._id} className="mb-6">
          <h4 className="font-bold text-white">{event.title}</h4>
          {event.registrations && event.registrations.length > 0 ? (
            <table className="w-full text-sm mt-3 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-2 text-left">Student</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {event.registrations.map((reg) => {
                  const sid =
                    typeof reg.studentId === "object" ? reg.studentId._id : reg.studentId;
                  const studentName =
                    typeof reg.studentId === "object" ? reg.studentId.fullName : "Unknown";

                  return (
                    <tr key={reg._id} className="border-t border-gray-700">
                      <td className="p-2 text-gray-200">{studentName}</td>
                      <td className="p-2">
                        {reg.attended ? (
                          <span className="text-green-400 font-medium">Present</span>
                        ) : (
                          <span className="text-red-400 font-medium">Absent</span>
                        )}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => toggleAttendance(event._id, sid, !reg.attended)}
                          className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
                            reg.attended
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-black"
                          }`}
                        >
                          {reg.attended ? "Mark Absent" : "Mark Present"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm">No registrations yet.</p>
          )}
        </div>
      ))}
    </div>
  );
};


  // -----------------------
  // CERTIFICATES TAB
  // -----------------------
  const renderCertificates = () => (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold text-yellow-400 mb-6">Certificates</h3>
      {events.map((event) => (
        <div key={event._id} className="mb-6">
          <h4 className="font-bold text-white">{event.title}</h4>
          <p className="text-gray-400 text-sm">
            Certificates Paid:{" "}
            <span className="text-yellow-400 font-semibold">
              {event.registrations
                ? event.registrations.filter((reg) => reg.certificatePaid)
                    .length
                : 0}
            </span>{" "}
            / {event.registrations ? event.registrations.length : 0}
          </p>
        </div>
      ))}
    </div>
  );

  // -----------------------
  // RENDER MAIN COMPONENT
  // -----------------------
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-yellow-400">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage events, users, and system settings
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-6 flex-wrap gap-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeTab === "overview"
                  ? "bg-gray-800 border border-yellow-500 text-yellow-400"
                  : "text-gray-300 hover:bg-gray-900/40"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab("approvals")}
              className={`py-2 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeTab === "approvals"
                  ? "bg-gray-800 border border-yellow-500 text-yellow-400"
                  : "text-gray-300 hover:bg-gray-900/40"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Event Approvals
              {pendingEvents.length > 0 && (
                <span className="ml-2 bg-red-700 text-red-100 text-xs font-medium px-2 py-0.5 rounded-full">
                  {pendingEvents.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("feedbacks")}
              className={`py-2 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeTab === "feedbacks"
                  ? "bg-gray-800 border border-yellow-500 text-yellow-400"
                  : "text-gray-300 hover:bg-gray-900/40"
              }`}
            >
              <Award className="h-4 w-4" />
              Feedbacks
            </button>

            <button
              onClick={() => setActiveTab("attendance")}
              className={`py-2 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeTab === "attendance"
                  ? "bg-gray-800 border border-yellow-500 text-yellow-400"
                  : "text-gray-300 hover:bg-gray-900/40"
              }`}
            >
              <Users className="h-4 w-4" />
              Attendance
            </button>

            <button
              onClick={() => setActiveTab("certificates")}
              className={`py-2 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeTab === "certificates"
                  ? "bg-gray-800 border border-yellow-500 text-yellow-400"
                  : "text-gray-300 hover:bg-gray-900/40"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              Certificates
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeTab === "settings"
                  ? "bg-gray-800 border border-yellow-500 text-yellow-400"
                  : "text-gray-300 hover:bg-gray-900/40"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "approvals" && renderEventApprovals()}
          {activeTab === "feedbacks" && renderFeedbacks()}
          {activeTab === "attendance" && renderAttendance()}
          {activeTab === "certificates" && renderCertificates()}
          {activeTab === "settings" && (
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-yellow-400 mb-6">
                Settings
              </h3>
              <p className="text-gray-400">Settings management coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
