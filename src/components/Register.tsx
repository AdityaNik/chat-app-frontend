import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { user } from './store/items/user';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUserData = useSetRecoilState(user);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const response = fetch("https://jubilant-laughter-bce5d7d8aa.strapiapp.com/api/auth/local/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    response.then(async (res) => {
      const data = await res.json();
      console.log(data);
      if (res.ok) {
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
      } else {
        throw new Error(data.error.message);
      }
    });
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <label htmlFor="password" className="block text-xs font-medium text-gray-700">
              password should be more than 6 characters
            </label>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
            text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => {
            navigate('/login');
          }}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </button>
      </p>
    </div>
    </div>
  );
}

export default Register;