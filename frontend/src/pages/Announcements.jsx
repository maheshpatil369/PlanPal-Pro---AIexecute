import React, { useState, useEffect, useContext } from 'react';
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
  CheckCircle,
  Loader2
} from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx'; // Assuming AuthContext provides API functions or token

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Announcements = () => {
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating new announcement
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('update');
  const [newPriority, setNewPriority] = useState('low');
  const [newTags, setNewTags] = useState('');
  const [newPinned, setNewPinned] = useState(false);

  const { token } = useContext(AuthContext); // Or however you get the auth token

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/announcements?`;
      if (filterType !== 'all') {
        url += `type=${filterType}&`;
      }
      if (searchTerm) {
        url += `search=${encodeURIComponent(searchTerm)}&`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnnouncementsData(data);
    } catch (e) {
      console.error("Failed to fetch announcements:", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) { // Only fetch if token is available
        fetchAnnouncements();
    }
  }, [filterType, searchTerm, token]); // Re-fetch when filter, search term, or token changes

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      alert("Title and content are required.");
      return;
    }
    try {
      const payload = {
        title: newTitle,
        content: newContent,
        type: newType,
        priority: newPriority,
        tags: newTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        pinned: newPinned,
      };
      const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || `HTTP error! status: ${response.status}`);
      }
      // const createdAnnouncement = await response.json();
      // setAnnouncementsData(prev => [createdAnnouncement, ...prev]); // Add to top or re-fetch
      fetchAnnouncements(); // Re-fetch to get the latest list including the new one
      setShowCreateModal(false);
      // Reset form
      setNewTitle('');
      setNewContent('');
      setNewType('update');
      setNewPriority('low');
      setNewTags('');
      setNewPinned(false);
    } catch (e) {
      console.error("Failed to create announcement:", e);
      alert(`Error creating announcement: ${e.message}`);
    }
  };

  const handleLikeAnnouncement = async (announcementId) => {
    try {
      const response = await fetch(`${API_URL}/announcements/${announcementId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedLikeData = await response.json();
      setAnnouncementsData(prevAnnouncements =>
        prevAnnouncements.map(ann =>
          ann._id === announcementId ? { ...ann, likes: updatedLikeData.likes } : ann
        )
      );
    } catch (e) {
      console.error("Failed to like announcement:", e);
      alert(`Error liking announcement: ${e.message}`);
    }
  };


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

  // Filtering and sorting is now handled by the backend, but we can keep client-side if needed for responsiveness
  // For now, we'll rely on backend sorting (pinned first, then createdAt)
  // The search and filter type are passed as query params to the backend
  const sortedAnnouncements = announcementsData; // Already sorted by backend

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return dateString; // Fallback if date is not valid
    }
  };

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
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading announcements...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 dark:text-red-400 font-semibold">Error loading announcements:</p>
              <p className="text-red-600 dark:text-red-500">{error}</p>
              <button
                onClick={fetchAnnouncements}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          )}
          {!isLoading && !error && sortedAnnouncements.map((announcement, index) => {
            const TypeIcon = getTypeIcon(announcement.type);
            return (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 ${getPriorityColor(announcement.priority)} border-r border-t border-b border-gray-200 dark:border-gray-700 overflow-hidden`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      {announcement.author?.avatar && (
                        <img
                          src={announcement.author.avatar}
                          alt={announcement.author.name || 'Author'}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-gray-300"
                        />
                      )}
                      {!announcement.author?.avatar && (
                         <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                         </div>
                      )}
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
                          <span className="font-medium">{announcement.author?.name || 'System'}</span>
                          {announcement.author?.role && (
                            <>
                              <span>•</span>
                              <span>{announcement.author.role}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatDate(announcement.createdAt)}</span>
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
                    {announcement.tags && announcement.tags.length > 0 && announcement.tags.map((tag) => (
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
                        onClick={() => handleLikeAnnouncement(announcement._id)}
                      >
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{announcement.likes || 0}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                        // onClick={() => alert('Comment functionality to be implemented')} // Placeholder
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{announcement.comments || 0}</span>
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

        {!isLoading && !error && sortedAnnouncements.length === 0 && (
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
                ? 'Try adjusting your search or filter criteria.'
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
              <form onSubmit={handleCreateAnnouncement}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Create New Announcement
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="newTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      id="newTitle"
                      type="text"
                      placeholder="Enter announcement title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="newType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        id="newType"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="update">Update</option>
                        <option value="important">Important</option>
                        <option value="opportunity">Opportunity</option>
                        <option value="meeting">Meeting</option>
                        <option value="welcome">Welcome</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="newPriority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        id="newPriority"
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      id="newContent"
                      rows={6}
                      placeholder="Write your announcement content..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="newTags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      id="newTags"
                      type="text"
                      placeholder="e.g., Tokyo Trip, Important, Deadline"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="pin-announcement"
                      type="checkbox"
                      checked={newPinned}
                      onChange={(e) => setNewPinned(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="pin-announcement" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Pin this announcement
                    </label>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Publish Announcement
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Announcements;
