// frontend/src/components/Notifications.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Retrieve the user's email from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchNotifications(storedEmail);
    }
  }, []);

  const fetchNotifications = async (userEmail) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/news/notifications', {
        params: { email: userEmail },
      });

      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications.');
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setError('');
    fetchNotifications(email);
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Notifications History</h2>
      
      {!email ? (
        <form onSubmit={handleEmailSubmit} className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Enter your email to view notifications:</label>
          <div className="flex">
            <input
              type="email"
              className="flex-grow border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
            >
              Load
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <p className="text-center text-gray-500">Loading notifications...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications found.</p>
      ) : (
        <ul className="space-y-6">
          {notifications.map((notification) => (
            <li key={notification._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600">{notification.title}</h3>
                  <p className="text-gray-700 mt-2">{notification.description}</p>
                  {notification.url && (
                    <a
                      href={notification.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-2 inline-block"
                    >
                      Read more
                    </a>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {notification.category.split(', ').map((cat) => (
                      <span
                        key={cat}
                        className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-full"
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <p className="text-sm text-gray-500">{new Date(notification.sentAt).toLocaleString()}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
