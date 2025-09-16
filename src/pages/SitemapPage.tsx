import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Calendar, Image, Users, Mail, FileText, 
  User, Settings, Shield, BarChart3, ChevronRight 
} from 'lucide-react';

const SitemapPage: React.FC = () => {
  const siteStructure = [
    {
      title: 'Main Pages',
      icon: Home,
      pages: [
        { name: 'Home', path: '/', description: 'Welcome page with featured events and quick stats' },
        { name: 'Events', path: '/events', description: 'Browse all college events with filters and search' },
        { name: 'Media Gallery', path: '/gallery', description: 'Photos and videos from past events' },
        { name: 'About Us', path: '/about', description: 'Learn about EventSphere and our mission' },
        { name: 'Contact', path: '/contact', description: 'Get in touch with our support team' },
        { name: 'Sitemap', path: '/sitemap', description: 'This page - overview of site structure' }
      ]
    },
    {
      title: 'Authentication',
      icon: User,
      pages: [
        { name: 'Login', path: '/login', description: 'Sign in to your EventSphere account' },
        { name: 'Register', path: '/register', description: 'Create a new account to participate in events' }
      ]
    },
    {
      title: 'User Dashboards',
      icon: Settings,
      pages: [
        { name: 'Student Dashboard', path: '/dashboard', description: 'Manage registrations and view activity (Students only)' },
        { name: 'Organizer Dashboard', path: '/organizer', description: 'Create and manage events (Staff only)' },
        { name: 'Admin Dashboard', path: '/admin', description: 'System administration and event approval (Admins only)' }
      ]
    },
    {
      title: 'Event Details',
      icon: Calendar,
      pages: [
        { name: 'Event Details', path: '/events/:id', description: 'Detailed view of individual events with registration' }
      ]
    }
  ];

  const userRoles = [
    {
      role: 'Visitor (Unregistered)',
      icon: Users,
      color: 'bg-gray-100 text-gray-800',
      access: [
        'View all public pages (Home, Events, Gallery, About, Contact)',
        'Browse event listings and details',
        'View media gallery',
        'Access general information pages'
      ],
      restrictions: [
        'Cannot register for events',
        'Cannot access dashboards',
        'Cannot submit feedback or reviews'
      ]
    },
    {
      role: 'Participant (Student)',
      icon: User,
      color: 'bg-blue-100 text-blue-800',
      access: [
        'All visitor privileges',
        'Register for events',
        'Access student dashboard',
        'Submit event feedback',
        'Download certificates',
        'Manage event registrations'
      ],
      restrictions: [
        'Cannot create events',
        'Cannot access admin features'
      ]
    },
    {
      role: 'Organizer (Staff)',
      icon: Settings,
      color: 'bg-emerald-100 text-emerald-800',
      access: [
        'All participant privileges',
        'Create and manage events',
        'Access organizer dashboard',
        'View event registrations',
        'Upload media to gallery',
        'Mark attendance'
      ],
      restrictions: [
        'Cannot approve events (requires admin)',
        'Cannot manage other users'
      ]
    },
    {
      role: 'Admin (System Administrator)',
      icon: Shield,
      color: 'bg-purple-100 text-purple-800',
      access: [
        'Full system access',
        'Approve/reject events',
        'Manage all users',
        'Access admin dashboard',
        'Generate reports',
        'System configuration'
      ],
      restrictions: [
        'None - full access to all features'
      ]
    }
  ];

  const features = [
    {
      category: 'Event Management',
      items: [
        'Event creation and editing',
        'Real-time registration tracking',
        'Capacity management with waitlists',
        'Event approval workflow',
        'Calendar integration',
        'Social media sharing'
      ]
    },
    {
      category: 'User Experience',
      items: [
        'Responsive design for all devices',
        'Advanced search and filtering',
        'Real-time notifications',
        'Personalized dashboards',
        'Activity tracking',
        'Certificate management'
      ]
    },
    {
      category: 'Media & Content',
      items: [
        'Rich media gallery',
        'Event photo/video uploads',
        'Content categorization',
        'Media sharing capabilities',
        'Event documentation',
        'Visual event promotion'
      ]
    },
    {
      category: 'Administration',
      items: [
        'User role management',
        'Event approval system',
        'Analytics and reporting',
        'System monitoring',
        'Content moderation',
        'Bulk operations'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">EventSphere Sitemap</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete overview of EventSphere's structure, features, and navigation flow
          </p>
        </div>

        {/* Site Structure */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-600" />
            Site Structure
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {siteStructure.map((section, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <section.icon className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {section.pages.map((page, pageIndex) => (
                    <div key={pageIndex} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-center justify-between">
                        <Link
                          to={page.path}
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        >
                          {page.name}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {page.path}
                        </code>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Roles & Access */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-emerald-600" />
            User Roles & Access Levels
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {userRoles.map((role, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <role.icon className="h-6 w-6 mr-3" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${role.color}`}>
                    {role.role}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">✓ Access Permissions</h4>
                    <ul className="space-y-1">
                      {role.access.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-700 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">✗ Restrictions</h4>
                    <ul className="space-y-1">
                      {role.restrictions.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-700 flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-purple-600" />
            Platform Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Flow */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Typical User Journey
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Discover</h3>
              <p className="text-sm text-gray-600">Browse events on homepage or events page</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-sm text-gray-600">Create account and register for events</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Participate</h3>
              <p className="text-sm text-gray-600">Attend events and engage with community</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-amber-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share</h3>
              <p className="text-sm text-gray-600">Provide feedback and share experiences</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Navigation</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Home
            </Link>
            <Link to="/events" className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
              Browse Events
            </Link>
            <Link to="/gallery" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Media Gallery
            </Link>
            <Link to="/about" className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;