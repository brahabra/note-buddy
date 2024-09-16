import { useState } from "react";
import { useSignup } from "../hooks/auth/useSignup";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, username, password);
  };

  return (
    <div>
      <p className="flex justify-center mt-10 mb-16 text-5xl text-white">
        Sign Up
      </p>
      <form className="max-w-md my-10 mx-auto pb-14 pt-12 px-10 bg-white rounded-2xl" onSubmit={handleSubmit}>
        <label className="block mb-2">Email address:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <label className="block mb-2">Username:</label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <label className="block mb-2">Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        {!isLoading ? (
          <button
            className="py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Sign up
          </button>
        ) : (
          <div className="flex justify-center">
            <div className="spinner"/>
          </div>
        )}
        {error && <div className="mt-4 text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;