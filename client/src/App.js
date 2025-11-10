import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { PublicReviews } from './PublicReviews';
import './index.css'; // Import the basic styles

function App() {
  return (
    <BrowserRouter>
      {/* Navigation Header for easy testing */}
      <header className="app-header">
        <nav>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Manager Dashboard
          </NavLink>
          <NavLink 
            to="/public" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Public Review Page (Guest View)
          </NavLink>
        </nav>
      </header>

      {/* Main Content Area */}
      <main>
        <Routes>
          {/* The Manager Dashboard is the home page */}
          <Route path="/" element={<Dashboard />} />
          
          {/* The Public Review Display Page */}
          <Route path="/public" element={<PublicReviews />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;