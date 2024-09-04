import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-[1400px] mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2 hover:text-yellow-300">
            <HomeIcon />
            <span>Home</span>
          </Link>
          <Link to="/chat" className="flex items-center space-x-2 hover:text-yellow-300">
            <ChatIcon />
            <span>Chat</span>
          </Link>
          <Link to="/profile" className="flex items-center space-x-2 hover:text-yellow-300">
            <AccountCircleIcon />
            <span>Profile</span>
          </Link>
        </div>
        <nav>
          {user ? (
            <div className="flex items-center space-x-4">
              <button onClick={handleClick}>
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="bg-blue-500 px-3 py-1 rounded">
                Login
              </Link>
              <Link to="/signup" className="bg-green-500 px-3 py-1 rounded">
                Signup
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;