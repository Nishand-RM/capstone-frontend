// frontend/src/components/AlertPreferences.jsx

import React, { useState } from 'react';
import axios from 'axios';

const AlertPreferences = () => {
  const [email, setEmail] = useState('');
  const [categories, setCategories] = useState([
    'politics',
    'sports',
    'technology',
    'business',
    'health',
    'entertainment',
  ]);
  const [selectedCategories, setSelectedCategories] = useState(['politics', 'sports', 'technology']);
  const [frequency, setFrequency] = useState('immediate');
  const [message, setMessage] = useState('');

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((category) => category !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter a valid email.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        email,
        preferences: {
          categories: selectedCategories,
          frequency,
          notificationTypes: ['email'], // Extendable for SMS, Push
        },
      });

      if (response.status === 201) {
        setMessage('Preferences saved successfully!');
        setEmail('');
        setSelectedCategories(['politics', 'sports', 'technology']);
        setFrequency('immediate');

        // Store email in localStorage for later use
        localStorage.setItem('userEmail', response.data.email);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Failed to save preferences. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4">Set Your Alert Preferences</h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Email:</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Categories:</label>
          <div className="flex flex-wrap">
            {categories.map((category) => (
              <label key={category} className="mr-4 mb-2 flex items-center">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                  className="mr-2"
                />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Frequency:</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="immediate">Immediate</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default AlertPreferences;
