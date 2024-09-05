import { useAuthContext } from '../hooks/useAuthContext';
import { format } from 'date-fns';

const Profile = () => {
  const { user } = useAuthContext();

  if (!user) {
    return <p>You need to be logged in to view this page.</p>;
  }

  return (
    <div>
      <p className="flex justify-center mt-10 mb-16 text-5xl text-white">
        Profile
      </p>
      <div className="relative max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
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
      </div>
    </div>
  );
};

export default Profile;