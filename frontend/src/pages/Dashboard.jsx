import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Users, 
  TrendingUp, 
  Plus,
  Clock,
  
  IndianRupee,
  Globe
} from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Active Trips', value: '3', icon: MapPin, color: 'bg-blue-500', change: '+2 this month' },
    { name: 'Team Members', value: '12', icon: Users, color: 'bg-emerald-500', change: '+3 new' },
    { name: 'Countries Visited', value: '8', icon: Globe, color: 'bg-purple-500', change: '+2 planned' },
    { name: 'Total Savings', value: '₹2,450', icon: IndianRupee, color: 'bg-amber-500', change: '+₹320 this month' },
  ];

  const recentTrips = [
    {
      id: 1,
      title: 'Tokyo Adventure',
      destination: 'Tokyo, Japan',
      dates: 'Dec 15-22, 2024',
      members: 4,
      status: 'Planning',
      progress: 65,
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'European Tour',
      destination: 'Paris, Rome, Barcelona',
      dates: 'Jan 8-20, 2025',
      members: 6,
      status: 'Active',
      progress: 90,
      image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Bali Retreat',
      destination: 'Bali, Indonesia',
      dates: 'Mar 5-12, 2025',
      members: 3,
      status: 'Draft',
      progress: 25,
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
  ];

  const upcomingEvents = [
    { title: 'Flight to Tokyo', date: 'Dec 15', time: '2:30 PM', type: 'flight' },
    { title: 'Hotel Check-in', date: 'Dec 15', time: '6:00 PM', type: 'hotel' },
    { title: 'Team Dinner', date: 'Dec 16', time: '7:30 PM', type: 'activity' },
    { title: 'Sushi Workshop', date: 'Dec 17', time: '11:00 AM', type: 'activity' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              {/* <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'username'}! ✈️
              </h1> */}
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'username'}! ✈️
              </h1>

              <p className="text-blue-100 text-lg">
                Ready to plan your next adventure? Your team is excited to explore new destinations.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Trip</span>
            </motion.button>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Trips
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {recentTrips.map((trip) => (
                  <motion.div
                    key={trip.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                  >
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {trip.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {trip.destination}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {trip.dates}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {trip.members} members
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        trip.status === 'Active' ? 'bg-green-100 text-green-800' :
                        trip.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status}
                      </span>
                      <div className="mt-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${trip.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{trip.progress}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upcoming Events
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      event.type === 'flight' ? 'bg-blue-500' :
                      event.type === 'hotel' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.date} at {event.time}
                      </p>
                    </div>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;