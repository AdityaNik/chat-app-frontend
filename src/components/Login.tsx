import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { user } from './store/items/user';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setUserData = useSetRecoilState(user);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error on new attempt

    try {
      const response = await fetch("https://jubilant-laughter-bce5d7d8aa.strapiapp.com/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      localStorage.setItem("token", data.jwt);
      setUserData({
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`
        },
        isLoding: false,
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Welcome Back</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <label htmlFor="password" className="block text-xs font-medium text-gray-700">
              password should be more than 6 characters
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-lg text-lg font-medium 
              hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-medium text-blue-600 hover:text-blue-500 transition"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
