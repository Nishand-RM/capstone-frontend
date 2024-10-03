// frontend/src/App.js

import React from 'react';
import AlertPreferences from './components/AlertPreferences';
import Dashboard from './components/Dashboard';
import Notifications from './components/Notifications';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Real-Time News Alerts</h1>
        <p className="text-gray-600">Customize your news notifications</p>
      </header>
      <main className="max-w-4xl mx-auto">
        <AlertPreferences />
        <Dashboard />
        <Notifications />
      </main>
    </div>
  );
};

export default App;
