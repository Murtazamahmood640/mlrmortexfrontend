// src/contexts/EventContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios, { AxiosRequestConfig } from "axios";

/* ----------------- Interfaces ----------------- */
export interface Event {
  _id: string;
  title: string;
  description: string;
  category: "technical" | "cultural" | "sports" | "academic" | "workshop";
  startDateTime: string;
  endDateTime: string;
  venue: string;
  organizerId: string;
  organizerName: string;
  department: string;
  maxParticipants: number;
  registeredCount: number;
  status: "upcoming" | "ongoing" | "completed"; // dynamically calculated
  approved: boolean;
  imageUrl?: string;
  certificateFee?: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Feedback {
  _id: string;
  eventId: string;
  rating: number;
  comments?: string;
  studentId: { _id: string; fullName: string; email: string }; // no union
  createdAt: string;
  updatedAt: string;
}


export interface Registration {
  _id: string;
  eventId: string;
  studentId: string;
  status: "registered" | "cancelled";
  attended?: boolean;
  certificatePaid?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SubmitFeedbackInput {
  eventId: string;
  rating: number;
  comments?: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
  _id?: string;
}

/* ----------------- Axios Setup ----------------- */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// attach token automatically
API.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ----------------- Helpers ----------------- */
const calculateStatus = (event: Event): "upcoming" | "ongoing" | "completed" => {
  const now = new Date();
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  return "completed";
};

const withStatus = (event: Event): Event => ({
  ...event,
  status: calculateStatus(event),
});

/* ----------------- Context ----------------- */
interface EventContextType {
  events: Event[];
  registrations: Registration[];
  addEvent: (data: FormData) => Promise<Event | null>;
  updateEvent: (id: string, data: FormData | Partial<Event>) => Promise<Event | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  registerForEvent: (eventId: string, studentId: string) => Promise<any>;
  cancelRegistration: (eventId: string, studentId: string) => Promise<any>;
  submitFeedback: (eventId: string, rating: number, comments?: string) => Promise<Feedback | null>;
  markAttendance: (eventId: string, studentId: string, attended: boolean) => Promise<any>;
  markCertificatePaid: (eventId: string, studentId: string, certificatePaid: boolean) => Promise<any>;
  getEventById: (id: string) => Event | undefined;
  getFeedbackForEvent: (eventId: string) => Promise<Feedback[]>;
  getAverageRating: (eventId: string) => Promise<{ averageRating: number; count: number }>;
  getRegistrationsForStudent: (studentId: string) => Registration[];
  reloadEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  /* -------- Load Data on Mount -------- */
  useEffect(() => {
    (async () => {
      await loadEvents();
      await loadRegistrations();
    })();
  }, []);

  const loadEvents = async () => {
    try {
      const { data } = await API.get<Event[]>("/events");
      setEvents(data.map(withStatus));
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };

 const loadRegistrations = async () => {
  try {
    const response = await API.get<Registration[]>("/registrations");
    if (response.data) {
      setRegistrations(response.data);
    }
  } catch (err) {
    console.error("❌ Failed to load registrations:", err);
  }
};


  const reloadEvents = async () => {
    await loadEvents();
    await loadRegistrations();
  };

  /* -------- Event CRUD -------- */
  const addEvent = async (formData: FormData): Promise<Event | null> => {
    try {
      const { data } = await API.post<Event>("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newEvent = withStatus(data);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      console.error("addEvent error:", err);
      return null;
    }
  };

  const updateEvent = async (id: string, dataToSend: FormData | Partial<Event>): Promise<Event | null> => {
    try {
      let res;
      if (dataToSend instanceof FormData) {
        res = await API.put<Event>(`/events/${id}`, dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await API.put<Event>(`/events/${id}`, dataToSend);
      }

      const updated = withStatus(res.data);
      setEvents((prev) => prev.map((e) => (e._id === id ? updated : e)));
      return updated;
    } catch (err) {
      console.error("updateEvent error:", err);
      return null;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      await API.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      return true;
    } catch (err) {
      console.error("deleteEvent error:", err);
      return false;
    }
  };

  /* -------- Registrations -------- */
  const registerForEvent = async (eventId: string, studentId: string) => {
    try {
      const { data } = await API.post("/registrations", { eventId, studentId });
      setRegistrations((prev) => [...prev, data]);
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === eventId ? { ...ev, registeredCount: ev.registeredCount + 1 } : ev
        )
      );
      return data;
    } catch (err: any) {
      console.error("registerForEvent error:", err.response?.data || err.message);
      throw err;
    }
  };

  const cancelRegistration = async (eventId: string, studentId: string) => {
    try {
      const { data } = await API.post("/registrations/cancel", { eventId, studentId });
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.eventId === eventId && reg.studentId === studentId
            ? { ...reg, status: "cancelled" }
            : reg
        )
      );
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === eventId
            ? { ...ev, registeredCount: Math.max(0, ev.registeredCount - 1) }
            : ev
        )
      );
      return data;
    } catch (err) {
      console.error("cancelRegistration error:", err);
      throw err;
    }
  };

  const markAttendance = async (eventId: string, studentId: string, attended: boolean) => {
    try {
      const { data } = await API.post("/registrations/attendance", { eventId, studentId, attended });
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.eventId === eventId && reg.studentId === studentId
            ? { ...reg, attended }
            : reg
        )
      );
      return data;
    } catch (err) {
      console.error("markAttendance error:", err);
      throw err;
    }
  };

  const markCertificatePaid = async (eventId: string, studentId: string, certificatePaid: boolean) => {
  try {
    const { data } = await API.post("/registrations/certificate", { eventId, studentId, certificatePaid });
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.eventId === eventId && reg.studentId === studentId
          ? { ...reg, certificatePaid }
          : reg
      )
    );
    return data;
  } catch (err) {
    console.error("markCertificatePaid error:", err);
    throw err;
  }
};

  const getRegistrationsForStudent = (studentId: string): Registration[] => {
    return registrations.filter((reg) => reg.studentId === studentId);
  };

  /* -------- Feedback -------- */
  const submitFeedback = async (feedback: SubmitFeedbackInput): Promise<Feedback | null> => {
  try {
    const { data } = await API.post<Feedback>("/feedback", feedback);
    return data;
  } catch (err) {
    console.error("submitFeedback error:", err);
    return null;
  }
};

  const getFeedbackForEvent = async (eventId: string): Promise<Feedback[]> => {
    try {
      const { data } = await API.get<Feedback[]>(`/feedback/${eventId}`);
      return data;
    } catch (err) {
      console.error("getFeedbackForEvent error:", err);
      return [];
    }
  };

  const getAverageRating = async (
    eventId: string
  ): Promise<{ averageRating: number; count: number }> => {
    try {
      const { data } = await API.get<{ averageRating: number; count: number }>(
        `/feedback/${eventId}/average`
      );
      return data;
    } catch (err) {
      console.error("getAverageRating error:", err);
      return { averageRating: 0, count: 0 };
    }
  };

  /* -------- Single Event -------- */
  const getEventById = (id: string) =>
    events.find((e) => e._id === id) || undefined;

  return (
    <EventContext.Provider
      value={{
        events,
        registrations,
        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        cancelRegistration,
        submitFeedback,
        markAttendance,
        markCertificatePaid,
        getEventById,
        getFeedbackForEvent,
        getAverageRating,
        getRegistrationsForStudent,
        reloadEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

/* ----------------- Hook ----------------- */
export const useEvents = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvents must be used inside EventProvider");
  return ctx;
};
