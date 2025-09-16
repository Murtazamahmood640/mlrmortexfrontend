// src/pages/ContactPage.tsx
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    userType: "student",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        userType: "student",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@eventsphere.edu", "support@eventsphere.edu"],
      description: "Send us an email and we'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+92 323-4567", "+92 343-6543"],
      description: "Available Monday to Friday, 9 AM to 6 PM",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Student Services Building", "Room 205, 2nd Floor"],
      description: "Main Campus, University District",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 2:00 PM",
      ],
      description: "Closed on Sundays and public holidays",
    },
  ];

  const faqItems = [
    {
      question: "How do I register for an event?",
      answer:
        'Simply browse our events page, click on the event you\'re interested in, and click the "Register Now" button. You\'ll need to be logged in to register.',
    },
    {
      question: "Can I cancel my event registration?",
      answer:
        "Yes, you can cancel your registration up to 24 hours before the event start time through your dashboard.",
    },
    {
      question: "How do I get my participation certificate?",
      answer:
        "Certificates are available for download after event completion, provided you attended the event and paid any applicable certificate fees.",
    },
    {
      question: "Who can organize events on the platform?",
      answer:
        "College staff members with organizer privileges can create and manage events. All events require admin approval before going live.",
    },
    {
      question: "Is there a fee for using EventSphere?",
      answer:
        "EventSphere is free to use for all students and staff. Some events may have participation or certificate fees as determined by the organizers.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Have questions about EventSphere? We're here to help! Reach out
            through any channel below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <div className="space-y-5">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-yellow-500 rounded-lg p-3 flex-shrink-0">
                        <Icon className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-300 font-medium">
                            {detail}
                          </p>
                        ))}
                        <p className="text-sm text-gray-400 mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-300">
                    Thank you for contacting us. We'll get back to you within 24
                    hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="userType"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        I am a...
                      </label>
                      <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                      >
                        <option value="student">Student</option>
                        <option value="staff">Staff Member</option>
                        <option value="visitor">Visitor</option>
                        <option value="parent">Parent/Guardian</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                        placeholder="What is this about?"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                      placeholder="Please describe your question or concern in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-black py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors font-semibold flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section (Accordion) */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-yellow-400 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-300">
              Find quick answers to common questions about EventSphere
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-800">
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-4"
              defaultValue={undefined}
            >
              {faqItems.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-lg border border-gray-700 overflow-hidden"
                >
                  <AccordionTrigger
                    className="w-full text-left flex justify-between items-center text-lg md:text-xl font-semibold py-4 px-6
                      text-gray-200 hover:bg-yellow-500/10 transition-colors duration-200"
                  >
                    {faq.question}
                  </AccordionTrigger>

                  <AccordionContent className="text-gray-300 text-base md:text-lg leading-relaxed bg-gray-900 transition-all duration-300 px-6 pb-5">
                    <p>{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 bg-red-900/10 border border-red-800 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Phone className="h-6 w-6 text-red-400 mr-3" />
            <h3 className="text-lg font-semibold text-red-300">Emergency Contact</h3>
          </div>
          <p className="text-red-200">
            For urgent matters or emergencies during events, please call our 24/7 emergency hotline:
            <strong className="ml-2 text-red-100">+92 000 000 - HELP</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
