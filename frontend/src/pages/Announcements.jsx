import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Plus, 
  Search,
  Filter,
  Calendar,
  User,
  Pin,
  MessageCircle,
  Heart,
  Share2,
  MoreVertical,
  Bell,
  AlertCircle,
  Info,
  CheckCircle
} from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const announcements = [
    {
      id: 1,
      title: 'Tokyo Trip Update: Hotel Confirmed!',
      content: 'Great news everyone! I\'ve successfully booked our hotel in Shibuya for the Tokyo trip. The Shibuya Grand Hotel has confirmed our reservation for December 15-22. All rooms are adjacent and we have a great view of the city. Check-in is at 6 PM.',
      author: {
        name: 'Emily Rodriguez',
        avatar: 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Trip Coordinator'
      },
      type: 'update',
      priority: 'high',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 5,
      pinned: true,
      tags: ['Tokyo Trip', 'Accommodation', 'Confirmed']
    },
    {
      id: 2,
      title: 'Important: Passport Expiration Check',
      content: 'Please ensure your passport is valid for at least 6 months from your travel date. Japan requires this for entry. If your passport expires before June 2025, please renew it immediately. Contact me if you need help with the renewal process.',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Team Lead'
      },
      type: 'important',
      priority: 'urgent',
      timestamp: '1 day ago',
      likes: 8,
      comments: 3,
      pinned: true,
      tags: ['Documentation', 'Urgent', 'All Trips']
    },
    {
      id: 3,
      title: 'European Tour: Flight Deals Available',
      content: 'I found some amazing flight deals for our European tour in January! Prices are 30% lower than usual. The deals expire in 48 hours, so please confirm your participation by tomorrow evening. I\'ll need final headcount to book.',
      author: {
        name: 'Michael Chen',
        avatar: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Budget Manager'
      },
      type: 'opportunity',
      priority: 'medium',
      timestamp: '2 days ago',
      likes: 15,
      comments: 8,
      pinned: false,
      tags: ['Europe Tour', 'Flights', 'Deals']
    },
    {
      id: 4,
      title: 'Team Meeting: Trip Planning Session',
      content: 'Join us for our monthly trip planning session this Friday at 3 PM PST. We\'ll discuss upcoming trips, budget updates, and new destination ideas. The meeting will be held via video call. Agenda and meeting link will be shared tomorrow.',
      author: {
        name: 'David Kim',
        avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Organizer'
      },
      type: 'meeting',
      priority: 'medium',
      timestamp: '3 days ago',
      likes: 6,
      comments: 2,
      pinned: false,
      tags: ['Meeting', 'Planning', 'Team']
    },
    {
      id: 5,
      title: 'New Team Member Welcome!',
      content: 'Please join me in welcoming Lisa Thompson to our travel team! Lisa is an experienced traveler with expertise in wellness and beach destinations. She\'ll be joining us for the Bali retreat and future trips. Welcome aboard, Lisa! 🎉',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'Team Lead'
      },
      type: 'welcome',
      priority: 'low',
      timestamp: '1 week ago',
      likes: 20,
      comments: 12,
      pinned: false,
      tags: ['Team', 'Welcome', 'New Member']
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'important': return AlertCircle;
      case 'update': return Info;
      case 'opportunity': return CheckCircle;
      case 'meeting': return Calendar;
      case 'welcome': return Heart;
      default: return Megaphone;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'important': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'update': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'opportunity': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'meeting': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'welcome': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-blue-500';
      default: return 'border-l-gray-300 dark:border-l-gray-600';
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || announcement.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Sort by pinned first, then by timestamp
  const sortedAnnouncements = filteredAnnouncements.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0; // In a real app, you'd sort by timestamp here if not pinned
  });

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Stay updated with important team news and trip updates
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Megaphone className="h-5 w-5 mr-2" />
            New Announcement
          </motion.button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="important">Important</option>
              <option value="update">Updates</option>
              <option value="opportunity">Opportunities</option>
              <option value="meeting">Meetings</option>
              <option value="welcome">Welcome</option>
            </select>
          </div>
        </motion.div>

        {/* Announcements List */}
        <div className="space-y-6">
          {sortedAnnouncements.map((announcement, index) => {
            const TypeIcon = getTypeIcon(announcement.type);
            return (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 ${getPriorityColor(announcement.priority)} border-r border-t border-b border-gray-200 dark:border-gray-700 overflow-hidden`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <img
                        src={announcement.author.avatar}
                        alt={announcement.author.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {announcement.title}
                          </h3>
                          {announcement.pinned && (
                            <Pin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{announcement.author.name}</span>
                          <span>•</span>
                          <span>{announcement.author.role}</span>
                          <span>•</span>
                          <span>{announcement.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(announcement.type)}`}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {announcement.type}
                      </span>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {announcement.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {announcement.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{announcement.likes}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{announcement.comments}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">Share</span>
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Bell className="h-4 w-4" />
                      <span className="text-sm">Follow</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {sortedAnnouncements.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No announcements found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to share important news with your team!'
              }
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Announcement
            </button>
          </motion.div>
        )}

        {/* Create Announcement Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Create New Announcement
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter announcement title"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="update">Update</option>
                      <option value="important">Important</option>
                      <option value="opportunity">Opportunity</option>
                      <option value="meeting">Meeting</option>
                      <option value="welcome">Welcome</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Write your announcement content..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tokyo Trip, Important, Deadline"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pin-announcement"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="pin-announcement" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Pin this announcement
                  </label>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Publish Announcement
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Announcements;