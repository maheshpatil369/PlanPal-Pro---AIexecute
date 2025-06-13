import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout'; 

const HomePage = () => {
  return (
    <PublicLayout> 
      <div className="flex flex-col items-center justify-center text-gray-800 dark:text-white p-6 py-12 rounded-lg bg-white dark:bg-gray-800 shadow-xl">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
            Welcome to PlanPal!
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-600 dark:text-gray-300">
            Your ultimate companion for planning and organizing your trips, adventures, and daily tasks.
            Seamlessly collaborate, discover new destinations, and keep everything in one place.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-6">
            <Link
              to="/login"
              className="w-full md:w-auto inline-block bg-purple-600 text-white font-semibold py-3 px-10 rounded-lg shadow-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="w-full md:w-auto inline-block bg-yellow-400 text-gray-800 font-semibold py-3 px-10 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default HomePage;