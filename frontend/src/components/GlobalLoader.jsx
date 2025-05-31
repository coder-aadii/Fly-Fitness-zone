import React from 'react';
import Loader from './Loader';

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <Loader size="large" />
        <h2 className="mt-4 text-xl font-semibold text-orange-500">Fly Fitness Zone</h2>
        <p className="text-gray-600">Loading your fitness journey...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;