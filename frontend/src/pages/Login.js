import { useState } from "react";
import { useLogin } from "../hooks/auth/useLogin";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div>
      <p className="flex justify-center mt-10 mb-16 text-5xl text-white">
        Login
      </p>
      <form className="max-w-md my-10 mx-auto pb-14 pt-12 px-10 bg-white rounded-2xl" onSubmit={handleSubmit}>
        <label className="block mb-2">Email address:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
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
            className="py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Log in
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

export default Login;