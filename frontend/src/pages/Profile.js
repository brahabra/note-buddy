import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { format } from 'date-fns';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSnackbar } from 'notistack';

const Profile = () => {
  const { user, dispatch } = useAuthContext();
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : null);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  if (!user) {
    return <p>You need to be logged in to view this page.</p>;
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      enqueueSnackbar('Error: Only JPEG, JPG, and PNG files are allowed!', { variant: 'error' });
      return;
    }

    if (file.size > maxSize) {
      enqueueSnackbar('Error: File size exceeds 2MB!', { variant: 'error' });
      return;
    }

    setProfilePicture(file);
    setProfilePictureUrl(URL.createObjectURL(file)); // Show the new picture immediately
    setIsSaveButtonEnabled(true); // Enable the save button
  };

  const handleProfilePictureUpload = async () => {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      const data = await response.json();
      dispatch({ type: 'LOGIN', payload: data });
      setProfilePictureUrl(`data:image/jpeg;base64,${data.profilePicture}`); // Update the profile picture URL
      console.log("hei: ", profilePictureUrl)
      setIsSaveButtonEnabled(false); // Disable the save button after saving
      enqueueSnackbar('Profile picture updated successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      enqueueSnackbar('Failed to update profile picture', { variant: 'error' });
    }
  };

  return (
    <div>
      <p className="flex justify-center mt-10 mb-16 text-5xl text-white">
        Profile
      </p>
      <div className="relative max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
        <div className="absolute top-0 right-0 mt-4 mr-4 hover:opacity-75">
          <label htmlFor="profilePictureInput" className="cursor-pointer">
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <AccountCircleIcon style={{ fontSize: 64 }} />
            )}
          </label>
          <input
            id="profilePictureInput"
            type="file"
            onChange={handleProfilePictureChange}
            className="hidden"
            accept="image/jpeg, image/jpg, image/png"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <p className="text-lg">{user.username}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <p className="text-lg">{user.email}</p>
        </div>
        <div className="text-gray-500 mb-4">
          <label className="block">Joined:</label>
          <p className="text-lg">{format(new Date(user.createdAt), 'MMMM dd, yyyy')}</p>
        </div>
        {isSaveButtonEnabled && (
          <button
            onClick={handleProfilePictureUpload}
            className={`mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full`}
            disabled={!isSaveButtonEnabled}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;