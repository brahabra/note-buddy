import React from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const Profile = () => {
  const { user } = useAuthContext();

  if (!user) {
    return <p>You need to be logged in to view this page.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Username:</label>
        <p className="text-lg">{user.username}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email:</label>
        <p className="text-lg">{user.email}</p>
      </div>
    </div>
  );
};

export default Profile;