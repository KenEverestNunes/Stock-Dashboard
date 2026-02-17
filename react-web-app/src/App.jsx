import React from 'react';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

function App() {

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="pt-20">
        <Dashboard />
      </main>
    </div>
    </>
  );
}

export default App;