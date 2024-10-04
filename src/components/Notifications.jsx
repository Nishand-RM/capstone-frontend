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
    console.log('Stored Email:', storedEmail); // Debugging
    if (storedEmail) {
      setEmail(storedEmail);
      fetchNotifications(storedEmail);
    }
  }, []);

  const fetchNotifications = async (userEmail) => {
    setLoading(true);
    setError('');
    console.log('Fetching notifications for:', userEmail); // Debugging
    try {
      const response = await axios.get('http://localhost:5000/api/news/notifications', {
        params: { email: userEmail },
      });

      console.log('Notifications Response:', response.data); // Debugging
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    console.log('Manually fetching notifications for:', email); // Debugging
    await fetchNotifications(email);
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4">Notifications History</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!email ? (
        <form onSubmit={handleEmailSubmit}>
          <label className="block mb-2 font-medium">Enter your email to view notifications:</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Load Notifications
          </button>
        </form>
      ) : loading ? (
        <p className="text-center">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id} className="mb-4 border-b pb-4">
              <h3 className="text-xl font-medium">{notification.title}</h3>
              <p className="text-gray-700">{notification.description}</p>
              {notification.url && (
                <a
                  href={notification.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Read more
                </a>
              )}
              <p className="text-sm text-gray-500">{new Date(notification.sentAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
