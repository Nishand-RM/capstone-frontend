// frontend/src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      setNews(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // Optional: Refresh news every 10 minutes
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="text-center">Loading news...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load news.</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
      {news.length === 0 ? (
        <p>No news available.</p>
      ) : (
        <ul>
          {news.map((article, index) => (
            <li key={index} className="mb-4 border-b pb-4">
              <h3 className="text-xl font-medium">{article.title}</h3>
              <p className="text-gray-700">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
