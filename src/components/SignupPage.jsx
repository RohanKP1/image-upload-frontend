import React, { useState } from 'react';
import { signup } from '../services/api';

const SignupPage = ({ setToken, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles form submission for signup.
   * Prevents default form submission.
   * Calls signup service, sets app token and local storage if successful.
   * Sets error state if there is an error.
   * @param {React.FormEvent<HTMLFormElement>} e - Form event
   */
/*******  d708dfd7-7fa6-48f3-97d5-308ce6a947b8  *******/  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signup(username, password);
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
    } catch (err) {
      if (err.response) {
        setError('Signup failed: ' + (err.response.data?.detail || 'Invalid details.'));
      } else if (err.request) {
        setError('Cannot connect to the server. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create a new account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              type="button"
              className="text-indigo-600 hover:underline font-medium"
              onClick={onSwitchToLogin}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;